import test from 'ava';
import Promise from 'bluebird';

import frame from '../lib/frame';
import speedIndex from '../lib/speed-index';

function calculateVisualProgressFromImages(images = [], delay = 1000) {
	const baseTs = new Date().getTime();

	return Promise.map(images, (imgPath, i) => frame.create(imgPath, baseTs + i * delay))
		.tap(speedIndex.calculateVisualProgress);
}

test('visual progress should be 100 if there is a single frame only', async t => {
	const frames = await calculateVisualProgressFromImages(['./assets/grayscale.png']);
	t.is(frames[0].getProgress(), 100);
});

test('visual progress should be 100 if there is not change', async t => {
	const frames = await calculateVisualProgressFromImages([
		'./assets/grayscale.png',
		'./assets/grayscale.png'
	]);

	for (const frame of frames) {
		t.is(frame.getProgress(), 100);
	}
});

test('visual progress should have 0 and 100 for different images', async t => {
	const frames = await calculateVisualProgressFromImages([
		'./assets/Solid_black.png',
		'./assets/grayscale.png'
	]);

	t.is(frames[0].getProgress(), 0);
	t.is(frames[1].getProgress(), 100);
});

test('speed index calculate teh right value', async t => {
	const res = await calculateVisualProgressFromImages([
		'./assets/Solid_black.png',
		'./assets/grayscale.png'
	]).then(speedIndex.calculateSpeedIndex);

	t.is(res, 1000);
});
