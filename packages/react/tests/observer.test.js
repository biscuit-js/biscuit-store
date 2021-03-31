import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { observer } from '../src/index';
import { testStore } from './testStore.js';

let container = null;
beforeEach(() => {
	container = document.createElement('div');
	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});

it('observer test', (done) => {
	expect.assertions(3);
	const { add } = testStore('testobs');

	let iteration = 0;
	const TestComponent = observer(
		({ testobs, data }) => {
			const { value } = testobs;
			useEffect(() => {
				iteration += 1;

				if (iteration === 1) {
					expect(value).toBe(0);
				}

				if (iteration === 2) {
					expect(value).toBe(10);
					done();
				}
			}, [value]);
			return (
				<div>
					{data}
					{value}
				</div>
			);
		},
		[add]
	);

	act(() => {
		render(<TestComponent data={'test'} />, container);
	});
	expect(container.textContent).toBe('test0');

	add.dispatch({ value: 10 });
});

it('observer test multydeps', (done) => {
	expect.assertions(4);
	const { add, remove } = testStore('testmobs');

	let iteration = 0;
	const TestComponent = observer(
		({ testmobs, data }) => {
			const { value } = testmobs;
			useEffect(() => {
				iteration += 1;

				if (iteration === 1) {
					expect(value).toBe(0);
				}

				if (iteration === 2) {
					expect(value).toBe(10);
				}

				if (iteration === 3) {
					expect(value).toBe(20);
					done();
				}
			}, [value]);
			return (
				<div>
					{data}
					{value}
				</div>
			);
		},
		[add, remove]
	);

	act(() => {
		render(<TestComponent data={'test'} />, container);
	});
	expect(container.textContent).toBe('test0');

	add.dispatch({ value: 10 });
	setTimeout(() => {
		remove.dispatch({ value: 20 });
	}, 100);
});

it('observer test different dependencies', (done) => {
	expect.assertions(5);
	const { add } = testStore('testobs1', 10);
	const { remove } = testStore('testobs2', 20);

	let iteration = 0;
	const TestComponent = observer(
		({ testobs1, testobs2, data }) => {
			useEffect(() => {
				iteration += 1;

				if (iteration === 1) {
					expect(testobs1.value).toBe(10);
					expect(testobs2.value).toBe(20);
				}

				if (iteration === 2) {
					expect(testobs2.value).toBe(30);
				}

				if (iteration === 3) {
					expect(testobs1.value).toBe(40);
					done();
				}
			}, [testobs1.value, testobs2.value]);
			return (
				<div>
					{data}
					{testobs2.value}
				</div>
			);
		},
		[add, remove]
	);

	act(() => {
		render(<TestComponent data={'test'} />, container);
	});
	expect(container.textContent).toBe('test20');

	remove.dispatch({ value: 30 });
	setTimeout(() => {
		add.dispatch({ value: 40 });
	}, 100);
});

it('observer test store', (done) => {
	expect.assertions(4);
	const { store, add, remove } = testStore('testobs50');

	let iteration = 0;
	const TestComponent = observer(
		({ testobs50, data }) => {
			const { value } = testobs50;
			useEffect(() => {
				iteration += 1;
				if (iteration === 1) {
					expect(value).toBe(0);
				}

				if (iteration === 2) {
					expect(value).toBe(40);
				}

				if (iteration === 3) {
					expect(value).toBe(50);
					done();
				}
			}, [value]);
			return (
				<div>
					{data}
					{value}
				</div>
			);
		},
		[store]
	);

	act(() => {
		render(<TestComponent data={'test'} />, container);
	});
	expect(container.textContent).toBe('test0');

	add.dispatch({ value: 40 });
	setTimeout(() => {
		remove.dispatch({ value: 50 });
	}, 100);
});

it('observer branck test', (done) => {
	expect.assertions(7);
	const { store, add, sandbox } = testStore('testobs200');

	let iteration = 0;
	const TestComponent = observer(
		({ testobs200, field }) => {
			const { value, data } = testobs200;
			useEffect(() => {
				iteration += 1;
				if (iteration === 1) {
					expect(data).toBe('test-200');
					expect(value).toBe(0);
				}

				if (iteration === 2) {
					expect(data).toBe('test-200');
					expect(value).toBe(40);
				}

				if (iteration === 3) {
					expect(data).toBe('test-400');
					expect(value).toBe(0);
					done();
				}
			}, [value, data]);
			return (
				<div>
					{field}
					{value}
				</div>
			);
		},
		[sandbox, store]
	);

	act(() => {
		render(<TestComponent field={'test'} />, container);
	});
	expect(container.textContent).toBe('test0');

	add.dispatch({ value: 40 });
	sandbox.dispatch({ data: 'test-400' });
});