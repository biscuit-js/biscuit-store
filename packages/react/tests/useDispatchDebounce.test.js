import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useDispatchDebounce } from '../src/index';
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

it('useDispatchDebounce test', (done) => {
	expect.assertions(2);
	const { add } = testStore('test-0');

	const TestComponent = ({ value }) => {
		const setAdd = useDispatchDebounce(add, 500, true);
		setTimeout(() => {
			setAdd({ value: 1 });
		}, 0);
		setTimeout(() => {
			setAdd({ value: 2 });
		}, 300);
		setTimeout(() => {
			setAdd({ value: 3 });
		}, 600);
		return <div />;
	};

	act(() => {
		render(<TestComponent />, container);
	});

	let iteration = 0;
	add.subscribe((state) => {
		iteration += 1;
		if (iteration === 1) {
			expect(add.getState().value).toBe(1);
		}

		if (iteration === 2) {
			expect(add.getState().value).toBe(2);
			done();
		}
	});
});

it('useDispatchDebounce immediate', (done) => {
	expect.assertions(1);
	const { add } = testStore('test-1');

	const TestComponent = ({ value }) => {
		const setAdd = useDispatchDebounce(add, 300, false);
		setTimeout(() => {
			setAdd({ value: 1 });
		}, 0);
		setTimeout(() => {
			setAdd({ value: 2 });
		}, 200);
		return <div />;
	};

	act(() => {
		render(<TestComponent />, container);
	});

	let iteration = 0;
	add.subscribe((state) => {
		iteration += 1;
		if (iteration === 1) {
			expect(add.getState().value).toBe(1);
			done();
		}
	});
});