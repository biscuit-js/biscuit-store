import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const rootElement = document.getElementById('root');
ReactDOM.render(
	<StrictMode>
		<App />
	</StrictMode>,
	rootElement
);
