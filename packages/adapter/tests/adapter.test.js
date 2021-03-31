import { createAdapter } from '../src/index';
import { testStore } from './testStore.js';

it('`adapter test`', (done) => {
	expect.assertions(3);

	const adapter = createAdapter();

	const func = async ({ payload, state }) => {
		return await new Promise((resolve) => {
			setTimeout(() => {
				resolve({ value: payload.value + state.value });
				expect(payload.value).toEqual(20);
				done();
			}, 1000);
		});
	};

	adapter.action('add/action', ({ payload }) => {
		expect(payload.value).toEqual(10);
		return payload;
	});

	adapter.action('remove/action', ({ payload }) => {
		expect(payload.value).toEqual(30);
		return payload;
	});

	adapter.call('step/action', func);

	const { add, step, remove } = testStore('test1', adapter);

	add.dispatch({ value: 10 });
	step.dispatch({ value: 20 });
	remove.dispatch({ value: 30 });
});