import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useDispatch } from '../src/index';
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

it('useDispatch test', (done) => {
	expect.assertions(2);
	const { add } = testStore('test-1');

	const TestComponent = ({ value }) => {
		const [setAdd] = useDispatch(add);
		useEffect(() => {
			setAdd({ value });
		}, []);
		return <div>{value}</div>;
	};

	act(() => {
		render(<TestComponent value={'test'} />, container);
	});
	expect(container.textContent).toBe('test');

	add.subscribe((state) => {
		expect(state.value).toBe('test');
		done();
	});
});

it('useDispatch test two call', (done) => {
	expect.assertions(3);
	const { add } = testStore('test-3');

	const TestComponent = ({ value1, value2 }) => {
		const [setAdd1] = useDispatch(add);
		const [setAdd2] = useDispatch(add);
		useEffect(() => {
			setAdd1({ value: value1 });
			setAdd2({ value: value2 });
		}, []);
		return <div>{value1}</div>;
	};

	act(() => {
		render(
			<TestComponent value1={'test-c'} value2={'test-e'} />,
			container
		);
	});
	expect(container.textContent).toBe('test-c');

	add.subscribe((state) => {
		if (state.value === 'test-c') {
			expect(state.value).toBe('test-c');
		}

		if (state.value === 'test-e') {
			expect(state.value).toBe('test-e');
			done();
		}
	});
});

it('useDispatch test static action', (done) => {
	expect.assertions(1);
	const { add } = testStore('test-4');

	const TestComponent = ({ value }) => {
		const [setAdd] = useDispatch({ name: 'test-4', type: 'add/action' });
		useEffect(() => {
			setAdd({ value });
		}, []);
		return <div>{value}</div>;
	};

	act(() => {
		render(<TestComponent value={'test-33'} />, container);
	});

	add.subscribe((state) => {
		expect(state.value).toBe('test-33');
		done();
	});
});