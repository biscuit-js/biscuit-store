import React, { useEffect } from 'react';
import {
	render,
	unmountComponentAtNode,
} from '../../../website/src/node_modules/react-dom';
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

it('renderer test', (done) => {
	expect.assertions(1);
	const { add, store } = testStore('test-renderer-1');
	let iteration = 0;
	function TestComponent({ value }) {
		useEffect(() => {
			iteration += 1;

			if (iteration === 1) {
				expect(value).toBe('test-sucсess');
				done();
			}
		}, [value]);

		return (
			<div>
				<p>{value}</p>
			</div>
		);
	}

	const RTestComponent = listen(store, { state: true }).render(TestComponent);

	act(() => {
		render(<RTestComponent value={'test-start'} />, container);
	});

	add.dispatch({ state: true, value: 'test-sucсess' });
});