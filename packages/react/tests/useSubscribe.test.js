import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useSubscribe } from '../src/index';
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

it('useSubscribe test', (done) => {
	expect.assertions(3);
	const { add } = testStore('test-s');

	const TestComponent = ({ value }) => {
		const [data, setData] = useSubscribe(add);
		useEffect(() => {
			setData({ value });
		}, []);

		useEffect(() => {
			if (value === 'test') {
				expect(value).toBe('test');
			}
		}, [value]);

		return <div>{data.value}</div>;
	};

	act(() => {
		render(<TestComponent value={'test'} />, container);
	});
	expect(container.textContent).toBe('0');

	add.subscribe((state) => {
		expect(state.value).toBe('test');
		done();
	});
});

it('useSubscribe test update false', (done) => {
	expect.assertions(3);
	const { add } = testStore('test-suf');

	const TestComponent = ({ value }) => {
		const [data, setData] = useSubscribe(add, false);
		useEffect(() => {
			setData({ value });
		}, []);

		useEffect(() => {
			expect(true).toBe(true);
		}, [value]);

		return <div>{data.value}</div>;
	};

	act(() => {
		render(<TestComponent value={'test'} />, container);
	});
	expect(container.textContent).toBe('0');

	add.subscribe((state) => {
		expect(state.value).toBe('test');
		done();
	});
});