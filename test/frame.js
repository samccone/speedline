import test from 'ava';

import frame from '../lib/frame';

const DEFAULT_IMAGE = './assets/Solid_black.png';
const DEFAULT_TS = new Date().getTime();

test('getTimeStamp returns the right timestamps', t => {
	const f = frame.create(DEFAULT_IMAGE, DEFAULT_TS);
	t.is(f.getTimeStamp(), DEFAULT_TS);
});

test('getHistogram get the right histogram for black pixel', async t => {
	const res = await frame.create('./assets/Solid_black.png', DEFAULT_TS).getHistogram();

	for (const x of res) {
		t.true(x[0] > 0, 'Lowest pixel doesn\'t match with black');
	}
});

test('getHistogram should not takes in account white pixels', async t => {
	const res = await frame.create('./assets/grayscale.png', DEFAULT_TS).getHistogram();

	for (const x of res) {
		t.true(x[255] === 0, 'Highest pixel is not white');
	}
});

test('frames can set and retrieve progress', t => {
	const PROGRESS = 43;
	const f = frame.create(DEFAULT_IMAGE, DEFAULT_TS);

	f.setProgress(PROGRESS);
	t.is(f.getProgress(), PROGRESS);
});

test('extract frames from timeline should returns an array of frames', async t => {
	const frames = await frame.extractFramesFromTimeline('./assets/nyt.json');
	t.true(Array.isArray(frames), 'Frames is not an array');
});
