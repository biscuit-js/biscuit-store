import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { subscribe } from '../src/index';
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

it('subscribe test', (done) => {
	expect.assertions(5);
	const { add } = testStore('subtest');

	let increment = 0;
	const TestComponent = ({ value, data, dispatchAdd }) => {
		useEffect(() => {
			increment += 1;
			if (increment === 1) {
				expect(typeof dispatchAdd).toBe('function');
				expect(data).toBe('test');
				expect(value).toBe(0);
				dispatchAdd({ value: 50 });
			}

			if (increment === 2) {
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
	};

	const stateToProps = (store) => {
		const { value } = store.subtest;
		return { value };
	};

	const dispatchToProps = {
		dispatchAdd: add,
	};

	const Test = subscribe(stateToProps, dispatchToProps)(TestComponent);

	act(() => {
		render(<Test data={'test'} />, container);
	});
	expect(container.textContent).toBe('test0');
});