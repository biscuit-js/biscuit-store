import React, { useEffect, useState } from 'react';
import { getData } from './utils';

/**
 * The listen method listens to a store or action.
 * If the values of the storage object match the values
 * of the mask object specified in the parameters.
 * then the react component will be manipulated
 * depending on the method called from the closure.
 * @param {StateAction | Store} event action and store (not static action)
 * @param {object} exp mask object
 * @return methods
 */
export function listen(event, exp) {
	const expLen = Object.keys(exp).length;

	/** checking the storage by mask and starting the update */
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
		/**
		 * The render method mounts the component
		 * if the mask and storage parameters match,
		 * and unmounts it if it does not match.
		 * @param {ReactComponent} Component react component
		 * @return {ReactComponent} react component
		 */
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