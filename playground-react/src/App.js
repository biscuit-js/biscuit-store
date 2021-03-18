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

const ListenTest = listen(testStore, { state: true }).render(Test);

export default ({ value }) => {
	return (
		<div className='App'>
			<h1>Biscuit-store playground-react</h1>
			<ListenTest test={'test'} />
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
