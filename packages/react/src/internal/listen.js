import React, { useEffect, useState } from 'react';
import { getData } from './utils';

export function listen(event, exp) {
	const expLen = Object.keys(exp).length;

	const checkState = (current, setState) => {
		let active = false;
		let success = 0;
		for (let key in exp) {
			if (
				typeof current[key] !== 'undefined' &&
				current[key] === exp[key]
			) {
				success += 1;
			}
		}

		if (success === expLen) {
			active = true;
		}

		setState({ current, active });
	};

	return {
		render: (Component) => {
			return (props) => {
				const [state, setState] = useState({
					active: false,
					current: getData(event.name, event.type),
				});

				useEffect(() => {
					checkState(state.current, setState);
					const task = event.subscribe((current) => {
						checkState(current, setState);
					});
					return () => task.unsubscribe();
				}, []);

				return state.active ? (
					<Component {...{ ...state.current, ...props }} />
				) : null;
			};
		},
	};
}