import { createStore, combineActions } from '../src/index.js';

it('combineActions func test', () => {
	const data = combineActions({
		start: (state, payload) => {
			state.value += payload.value;
		},
		step: (state, payload) => {
			state.data += payload.data;
		},
	});

	expect(data.actions).toEqual({
		start: 'start/action',
		step: 'step/action',
	});
	expect(typeof data.middleware[0]).toEqual('function');
});

it('combineActions field test', (done) => {
	expect.assertions(7);
	const { actions } = createStore({
		name: 'testCombine1',
		initial: { count: 0, value: 1, data: 0 },
		actions: {
			first: 'first/action',
		},
		combineActions: {
			start: (state, payload) => {
				expect(state.value).toEqual(1);
				expect(payload.value).toEqual(222);

				state.value += payload.value;
			},
			step: (state, payload) => {
				expect(state.data).toEqual(0);
				expect(payload.data).toEqual(333);

				state.data += payload.data;
			},
		},
		strictMode: false,
	});

	const { start, step, first } = actions;

	first.subscribe((state) => {
		expect(state.count).toEqual(1);
	});

	start.subscribe((state) => {
		expect(state.value).toEqual(223);
	});

	step.subscribe((state) => {
		expect(state.data).toEqual(333);
		done();
	});

	(async () => {
		await first.dispatch({ count: 1 }).wait;
		await start.dispatch({ value: 222 }).wait;
		await step.dispatch({ data: 333 }).wait;
	})();
});