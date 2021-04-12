import { createAdapter } from '../src/index';
import { testStore } from './testStore.js';

it('debounce test', (done) => {
	expect.assertions(3);

	const adapter = createAdapter();
	adapter.debounce(
		'add/action',
		({ payload, state, send }) => {
			send({ value: state.value + payload.value });
		},
		200
	);

	const { add } = testStore('actionDebounce', adapter);

	setTimeout(() => {
		expect(add.getState().value).toEqual(0);
	}, 200);

	setTimeout(() => {
		expect(add.getState().value).toEqual(1);
	}, 350);

	setTimeout(() => {
		expect(add.getState().value).toEqual(11);
		done();
	}, 450);

	(async function () {
		await add.dispatch({ value: 1 }).wait;
		await add.dispatch({ value: 10 }).wait;
		await add.dispatch({ value: 10 }).wait;
	})();
});

it('throttle test', (done) => {
	expect.assertions(2);

	const adapter = createAdapter();
	adapter.throttle(
		'add/action',
		({ payload, state, send }) => {
			send({ value: state.value + payload.value });
		},
		200
	);

	const { add } = testStore('actionThrottle', adapter);

	setTimeout(() => {
		expect(add.getState().value).toEqual(1);
	}, 200);

	setTimeout(() => {
		expect(add.getState().value).toEqual(11);
		done();
	}, 350);

	setTimeout(() => {
		add.dispatch({ value: 10 });
	}, 300);

	(async function () {
		await add.dispatch({ value: 1 }).wait;
		await add.dispatch({ value: 10 }).wait;
		await add.dispatch({ value: 10 }).wait;
	})();
});
