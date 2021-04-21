import React from 'react';
import { Title } from '../../ui/Title';
import './styles.css';

export function About() {
	return (
		<div className='about'>
			<div className='aboutWrapper'>
				<Title text={'About Biscuit'} />
				<p className='text'>
					{`Biscuit is a modular tool for creating and editing
					configurable containers for managed states.
					The goal of the Biscuit-store is to simplify
					the process of working with states
					as much as possible while at the same time providing`}
					<br /> {`
					a consistent architectural approach.`}
				</p>
			</div>
		</div>
	);
}
