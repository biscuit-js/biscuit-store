import { createAdapter } from '../src/index';
import { testStore } from './testStore.js';

it('calling makeChannel', (done) => {
	expect.assertions(2);
	const adapter = createAdapter();
	const chan = adapter.makeChannel();

	adapter.action('add/action', ({ payload }) => {
		chan.include(payload);
		return payload;
	});

	adapter.action('remove/action', async ({ payload }) => {
		return await chan.extract(payload);
	});

	const { add, remove } = testStore('test-1', adapter);

	add.subscribe((state) => {
		expect(state.value).toEqual(10);
	});

	remove.subscribe((state) => {
		expect(state).toEqual({ value: 10, data: 20 });
		done();
	});

	setTimeout(() => {
		add.dispatch({ data: 20 });
	}, 1000);

	remove.dispatch({ value: 10 });
});