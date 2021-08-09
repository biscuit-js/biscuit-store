import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { usePipeline } from '../src/index';
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

it('usePipeline test', (done) => {
	expect.assertions(3);
	const { add, remove, store } = testStore('test-pipeline');

	const TestComponent = ({ value }) => {
		const pipeline = usePipeline(add, remove);
		useEffect(() => {
			pipeline({ value }, { value: 200 });
		}, []);
		return <div>{value}</div>;
	};

	act(() => {
		render(<TestComponent value={100} />, container);
	});
	expect(container.textContent).toBe('100');

	let iteration = 0;

	store.subscribe((state) => {
		iteration += 1;
		if (iteration === 1) {
			expect(state.value).toBe(100);
		}

		if (iteration === 2) {
			expect(state.value).toBe(200);
			done();
		}
	});
});