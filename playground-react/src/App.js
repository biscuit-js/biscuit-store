import React from 'react';
import { listen } from '@biscuit-store/react';
import { testStore, step } from './store/test';
import './styles.css';

const Test = ({ test, value }) => {
	return (
		<div>
			{test}_{value}
		</div>
	);
};

const RTest = listen(testStore, { state: true, text: 'ready' }).render(Test);

export default ({ value }) => {
	return (
		<div className='App'>
			<h1>Hello CodeSandbox</h1>
			<h2>{value}</h2>
			<RTest test={'test'} />
			<button
				onClick={() =>
					step.dispatch((prev) => ({
						state: !prev.state,
						text: 'ready',
					}))
				}>
				click
			</button>
		</div>
	);
};
