'use strict';

import Promise from 'bluebird';

function calculateFrameProgress(current, initial, target) {
	const props = {
		current: current.getHistogram(),
		initial: initial.getHistogram(),
		target: target.getHistogram()
	};

	return Promise.props(props).then(function (results) {
		let total = 0;
		let match = 0;

		for (let channel = 0; channel < 3; channel++) {
			for (let pixelVal = 0; pixelVal < 256; pixelVal++) {
				const currentCount = results.current[channel][pixelVal];
				const initialCount = results.initial[channel][pixelVal];
				const targetCount = results.target[channel][pixelVal];

				const currentDiff = Math.abs(currentCount - initialCount);
				const targetDiff = Math.abs(targetCount - initialCount);

				match += Math.min(currentDiff, targetDiff);
				total += targetDiff;
			}
		}

		let progress;
		if (match === 0 && total === 0) {	// All images are the same
			progress = 100;
		} else {													// When images differs
			progress = Math.floor(match / total * 100);
		}
		return progress;
	});
}

function calculateVisualProgress(frames) {
	const initial = frames[0];
	const target = frames[frames.length - 1];

	return Promise
		.map(frames, f => calculateFrameProgress(f, initial, target))
		.each((progress, index) => frames[index].setProgress(progress))
		.then(() => frames);
}

function calculateSpeedIndex(frames) {
	let speedIndex = 0;
	let lastTs = frames[0].getTimeStamp();
	let lastProgress = frames[0].getProgress();

	frames.forEach(function (frame) {
		const elapsed = frame.getTimeStamp() - lastTs;
		speedIndex += elapsed * (1 - lastProgress);
		lastTs = frame.getTimeStamp();
		lastProgress = frame.getProgress() / 100;
	});

	return speedIndex;
}

module.exports = {
	calculateVisualProgress,
	calculateSpeedIndex
};
