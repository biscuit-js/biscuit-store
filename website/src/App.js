import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from './components/screen/Home';
import { Docs } from './components/screen/Docs';
import './styles.css';

export default function App() {
	return (
		<div className='App'>
			<Router>
				<Switch>
					<Route path={'/docs'}>
						<Docs />
					</Route>
					<Route path='/'>
						<Home />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}
