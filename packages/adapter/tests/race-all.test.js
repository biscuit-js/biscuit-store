import { createAdapter } from '../src/index';
import { testStore } from './testStore.js';

const fnTest = (limit, value) => ({ payload }) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ data: value * payload.value });
		}, limit);
	});
};

it('race test', (done) => {
	expect.assertions(2);

	const adapter = createAdapter();

	adapter.race(
		'add/action',
		(result) => {
			expect(result.data).toEqual(2000);
			return { value: result.data * 2 };
		},
		[fnTest(200, 2000), fnTest(100, 1000), fnTest(300, 4000)]
	);

	const { add } = testStore('testRace', adapter);

	add.subscribe((state) => {
		expect(state.value).toEqual(4000);
		done();
	});
	add.dispatch({ value: 2 });
});

it('all test', (done) => {
	expect.assertions(2);

	const adapter = createAdapter();

	adapter.all(
		'add/action',
		(result) => {
			expect(result).toEqual([
				{ data: 100 },
				{ data: 200 },
				{ data: 300 },
			]);
			return { value: result[2].data };
		},
		[fnTest(0, 10), fnTest(100, 20), fnTest(200, 30)]
	);

	const { add } = testStore('testAll', adapter);

	add.subscribe((state) => {
		expect(state.value).toEqual(300);
		done();
	});
	add.dispatch({ value: 10 });
});