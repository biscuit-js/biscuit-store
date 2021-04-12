import { createAdapter } from '../src/index';
import { testStore } from './testStore.js';

it('includeContext test', (done) => {
	expect.assertions(2);

	const adapter = createAdapter();

	adapter.includeContext((ctx) => {
		return { value: 'ctx_ready' };
	});

	adapter.action('add/action', ({ payload, value }) => {
		expect(value).toEqual('ctx_ready');
		return payload;
	});

	const { add } = testStore('test1', adapter);

	add.subscribe((state) => {
		expect(state.value).toEqual(1);
		done();
	});
	add.dispatch({ value: 1 });
});

it('includeContext async test', (done) => {
	expect.assertions(2);

	const adapter = createAdapter();

	const fn = async (a) => {
		return { value: a };
	};

	adapter.includeContext(() => fn('ctx_async_ready'));

	adapter.action('add/action', ({ payload, value }) => {
		expect(value).toEqual('ctx_async_ready');
		return payload;
	});

	const { add } = testStore('test2', adapter);

	add.subscribe((state) => {
		expect(state.value).toEqual(2);
		done();
	});
	add.dispatch({ value: 2 });
});