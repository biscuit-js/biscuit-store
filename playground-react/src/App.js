import React, { useEffect } from 'react';
import { listen, observer } from '@biscuit-store/react';
import { testStore, step } from './store/test';
import './styles.css';

const Test = ({ field, test }) => {
	return (
		<div>
			{field}_{test.data}
		</div>
	);
};

const TestTwo = ({ field, test }) => {
	return (
		<div>
			two {test.value} {field}
		</div>
	);
};

const ListenTest = listen(testStore, { state: true }).replace(Test, TestTwo);

export default observer(
	({ test }) => {
		const { value } = test;

		useEffect(() => {
			const counter = setInterval(() => {
				step.dispatch((prev) => ({ value: (prev.value += 1) }));
			}, 1000);

			return () => clearInterval(counter);
		}, []);

		return (
			<div className='App'>
				<h1>Biscuit-store playground-react</h1>
				<p>{value}</p>
				<ListenTest field={'test'} />
				<button
					onClick={() =>
						step.dispatch((prev) => ({
							state: !prev.state,
							data: 'ready',
						}))
					}>
					click
				</button>
			</div>
		);
	},
	[step]
);
