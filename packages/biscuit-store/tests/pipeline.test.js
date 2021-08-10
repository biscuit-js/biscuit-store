import { pipeline, createStore } from '../src/index.js';

const testStore = (name, value) => {
	return createStore({
		name: 'test-' + name,
		initial: { value },
		actions: {
			testStart: 'TEST/START',
			testStep: 'TEST/STEP',
			testStop: 'TEST/STOP',
		},
		strictMode: false,
	});
};

it('default pipeline', (done) => {
	expect.assertions(3);

	const target = testStore(1, 100);
	const { testStart, testStep, testStop } = target.actions;

	pipeline(testStart, testStep, testStop)();

	let iteration = 0;
	target.store.subscribe(({ value }) => {
		iteration += 1;
		expect(value).toEqual(100);
		if (iteration === 3) {
			done();
		}
	});
});

it('pipeline once payload', (done) => {
	expect.assertions(3);

	const target = testStore(2, 100);
	const { testStart, testStep, testStop } = target.actions;

	pipeline(testStart, testStep, testStop)({ value: 200 });

	let iteration = 0;
	target.store.subscribe(({ value }) => {
		iteration += 1;
		expect(value).toEqual(200);
		if (iteration === 3) {
			done();
		}
	});
});

it('pipeline multy payload', (done) => {
	expect.assertions(3);

	const target = testStore(3, 100);
	const { testStart, testStep, testStop } = target.actions;

	pipeline(testStart, testStep, testStop)(
		{ value: 200 },
		{ value: 300 },
		{ value: 400 }
	);

	let iteration = 0;
	target.store.subscribe(({ value }) => {
		iteration += 1;
		if (iteration === 1) {
			expect(value).toEqual(200);
		}
		if (iteration === 2) {
			expect(value).toEqual(300);
		}
		if (iteration === 3) {
			expect(value).toEqual(400);
			done();
		}
	});
});

it('pipeline not action', (done) => {
	expect.assertions(1);
	pipeline({})({ value: 200 }).catch((e) => {
		expect(e.message).toEqual(
			'One of the arguments is not an action of the store.'
		);
		done();
	});
});