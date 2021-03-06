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
	const { add } = testStore('test-obs');

	let iteration = 0;
	const TestComponent = observer(
		({ value, data }) => {
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
	const { add, remove } = testStore('test-obs');

	let iteration = 0;
	const TestComponent = observer(
		({ value, data }) => {
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
	expect.assertions(4);
	const { add } = testStore('test-obs1', 10);
	const { remove } = testStore('test-obs2', 20);

	let iteration = 0;
	const TestComponent = observer(
		({ value, data }) => {
			useEffect(() => {
				iteration += 1;

				if (iteration === 1) {
					expect(value).toBe(20);
				}

				if (iteration === 2) {
					expect(value).toBe(30);
				}

				if (iteration === 3) {
					expect(value).toBe(40);
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
	expect(container.textContent).toBe('test20');

	remove.dispatch({ value: 30 });
	setTimeout(() => {
		add.dispatch({ value: 40 });
	}, 100);
});

it('observer test store', (done) => {
	expect.assertions(4);
	const { store, add, remove } = testStore('test-obs50');

	let iteration = 0;
	const TestComponent = observer(
		({ value, data }) => {
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