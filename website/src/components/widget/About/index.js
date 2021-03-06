import React from 'react';
import { Title } from '../../ui/Title';
import './styles.css';

export function About() {
	return (
		<div className='about'>
			<div className='aboutWrapper'>
				<Title text={'About Biscuit'} />
				<p className='text'>
					Biscuit allows you to organize predictable state containers
					in your javascript applications and easily manage them with
					an extensive set of tools. Intuitive patterns of this
					library will allow you not to spend on the organization of
					complex logistics, and will focus on the business logic of
					your project.
				</p>
			</div>
		</div>
	);
}
