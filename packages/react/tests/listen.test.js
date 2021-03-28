import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { listen } from '../src/index';
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

it('listen.render test', (done) => {
	expect.assertions(2);
	const { add, store } = testStore('testrenderer');
	let iteration = 0;
	function TestComponent({ testrenderer, field }) {
		const { value } = testrenderer;
		useEffect(() => {
			iteration += 1;

			if (iteration === 1) {
				expect(field).toBe('test-start');
				expect(value).toBe('test-sucсess');
				done();
			}
		}, [value, field]);

		return (
			<div>
				<p>{value}</p>
			</div>
		);
	}

	const RTestComponent = listen(store, { state: true }).render(TestComponent);

	act(() => {
		render(<RTestComponent field={'test-start'} />, container);
	});

	add.dispatch({ state: true, value: 'test-sucсess' });
});

it('listen.update test', (done) => {
	expect.assertions(3);
	const { add, store } = testStore('testupdate', 'start');
	let iteration = 0;
	function TestComponent({ testupdate, field }) {
		const { value } = testupdate;
		useEffect(() => {
			iteration += 1;

			if (iteration === 1) {
				expect(field).toBe('test-start-1');
				expect(value).toBe('start');
			}

			if (iteration === 2) {
				expect(value).toBe('updated');
				done();
			}
		}, [value, field]);

		return (
			<div>
				<p>{value}</p>
			</div>
		);
	}

	const RTestComponent = listen(store, { state: true }).update(TestComponent);

	act(() => {
		render(<RTestComponent field={'test-start-1'} />, container);
	});
	(async function () {
		await add.dispatch({ state: false, value: 'no-updated' }).wait;
		await add.dispatch({ state: true, value: 'updated' }).wait;
	})();
});

it('listen.replace test', (done) => {
	expect.assertions(4);
	const { add, store } = testStore('testreplace', 'first');
	const propText = 'test-first';

	function TestComponent1({ testreplace, field }) {
		const { value } = testreplace;
		useEffect(() => {
			expect(field).toBe(propText);
			expect(value).toBe('first');
		}, [value, field]);

		return (
			<div>
				<p>{value}</p>
			</div>
		);
	}

	function TestComponent2({ testreplace, field }) {
		const { value } = testreplace;
		useEffect(() => {
			expect(field).toBe(propText);
			expect(value).toBe('last');
			done();
		}, []);

		return (
			<div>
				<p>{value}</p>
			</div>
		);
	}

	const RTestComponent = listen(store, { value: 'last' }).replace(
		TestComponent1,
		TestComponent2
	);

	act(() => {
		render(<RTestComponent field={propText} />, container);
	});
	add.dispatch({ value: 'last' });
});