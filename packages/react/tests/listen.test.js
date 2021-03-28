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

it('render test', (done) => {
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