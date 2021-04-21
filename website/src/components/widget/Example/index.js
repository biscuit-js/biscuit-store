import React from 'react';
import { Title } from '../../ui/Title';
import { CodeBox } from '../../ui/CodeBox';
import { Pagger } from '../../ui/Pagger';
import { firstStep, combineActions, twoStep, subscribe, last } from './code';
import { Button } from '../../ui/Button';
import './styles.css';

const elements = [
	{
		target: <CodeBox code={firstStep} />,
		title: 'Store',
		value: 0,
	},
	{
		target: <CodeBox code={twoStep} />,
		title: 'Adapter',
		value: 300,
	},
	{
		target: <CodeBox code={combineActions} />,
		title: 'Combine actions',
		value: 600,
	},
	{
		target: <CodeBox code={subscribe} />,
		title: 'Subscribe',
		value: 900,
	},
	{
		target: <CodeBox code={last} />,
		title: 'React',
		value: 1200,
	},
];

export function Example() {
	return (
		<div className='example'>
			<div className='exampleWrapper'>
				<Title text={'Default examples'} />
				<div className='codeWrapper'>
					<Pagger data={elements} />
				</div>
				<a
					target='_blank'
					rel='noopener noreferrer'
					href='https://codesandbox.io/s/biscuit-storeexample-react-r3neo?file=/src/index.js'>
					<Button type={'middleButton'} text='Example' />
				</a>
			</div>
		</div>
	);
}
