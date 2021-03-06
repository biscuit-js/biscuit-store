import React from 'react';
import { Logo } from '../../ui/Logo';
import { Github } from '../../icons/Github';
import { Twitter } from '../../icons/Twitter';
import { Npm } from '../../icons/Npm';
import { Button } from '../../ui/Button';
import { CircleIcon } from '../../ui/CircleIcon';
import './styles.css';

export function Header() {
	return (
		<div className='header'>
			<div className='headerTitleWrapper'>
				<Logo />
				<h1 className='headerTitle'>
					Biscuit-<span>store</span>
				</h1>
				<p>JavaScript library for application state-management.</p>
				<div className='buttonBlock'>
					<a href='/docs/start'>
						<Button type={'superButton'} text='Get started' />
					</a>
					<a href='/docs/about'>
						<Button type={'superButton'} text='Docs' />
					</a>
				</div>
			</div>
			<div className='iconsBlock'>
				<a
					target='_blank'
					rel='noopener noreferrer'
					href='https://github.com/biscuit-js/biscuit-store'>
					<CircleIcon icon={<Github />} />
				</a>
				<a
					target='_blank'
					rel='noopener noreferrer'
					href='https://twitter.com/BiscuitJs'>
					<CircleIcon icon={<Twitter />} />
				</a>
				<a
					target='_blank'
					rel='noopener noreferrer'
					href='https://www.npmjs.com/package/@biscuit-store/core'>
					<CircleIcon icon={<Npm />} />
				</a>
			</div>
		</div>
	);
}
