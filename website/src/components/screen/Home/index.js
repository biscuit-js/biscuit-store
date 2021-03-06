import React from 'react';
import { Header } from '../../widget/Header';
import { About } from '../../widget/About';
import { Example } from '../../widget/Example';
import { Advantages } from '../../widget/Advantages';
import { Footer } from '../../widget/Footer';

export function Home() {
	return (
		<div className='home'>
			<Header />
			<About />
			<Example />
			<Advantages />
			<Footer />
		</div>
	);
}
