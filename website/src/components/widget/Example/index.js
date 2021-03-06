import React from 'react';
import { Title } from '../../ui/Title';
import { CodeBox } from '../../ui/CodeBox';
import { Pagger } from '../../ui/Pagger';
import { firstStep, twoStep, last } from './code';
import { Button } from '../../ui/Button';
import './styles.css';

const elements = [
	{
		target: <CodeBox code={firstStep} />,
		title: 'create store',
		value: 0,
	},
	{
		target: <CodeBox code={twoStep} />,
		title: 'create adapter',
		value: 300,
	},
	{
		target: <CodeBox code={last} />,
		title: 'subscribe',
		value: 600,
	},
];

export function Example() {
	return (
		<div className='example'>
			<div className='exampleWrapper'>
				<Title text={'Start in three steps'} />
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
