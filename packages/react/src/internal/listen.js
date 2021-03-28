import React, { useEffect, useState } from 'react';
import { getData, checkState } from './utils';

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

	/** checking the storage by mask and starting the render */
	const renderTask = (current, set) => {
		let active = false;
		checkState({ current, event, exp, expLen }, () => {
			active = true;
		});
		set({ current, active });
	};

	/** checking the storage by mask and starting the update */
	const updateTask = (current, set) => {
		checkState({ current, event, exp, expLen }, () => set({ current }));
	};

	/** Template for rendering or replacing */
	const renderer = (Component, NewComponent) => {
		return (props) => {
			const [state, setState] = useState({
				active: false,
				current: { [event.name]: getData(event.name, event.type) },
			});

			useEffect(() => {
				renderTask(state.current, setState);
				const task = event.subscribe((current) => {
					renderTask({ [event.name]: current }, setState);
				});
				return () => task.unsubscribe();
			}, []);

			if (NewComponent) {
				const p = { ...state.current, ...props };

				if (!state.active) {
					return <Component {...p} />;
				}
				return <NewComponent {...p} />;
			}

			return state.active ? (
				<Component {...{ ...state.current, ...props }} />
			) : null;
		};
	};

	/** Template for updating */
	const updater = (Component) => {
		return (props) => {
			const [state, setState] = useState({
				current: { [event.name]: getData(event.name, event.type) },
			});

			useEffect(() => {
				updateTask(state.current, setState);
				const task = event.subscribe((current) => {
					updateTask({ [event.name]: current }, setState);
				});
				return () => task.unsubscribe();
			}, []);

			return <Component {...{ ...state.current, ...props }} />;
		};
	};

	return {
		/**
		 * The render method mounts the component
		 * if the mask and storage parameters match,
		 * and unmounts it if it does not match.
		 * @param {ReactComponent} Component react component
		 * @return {ReactComponent} react component
		 */
		render: (Component) => renderer(Component),

		/**
		 * The method replaces the component with the specified one
		 * if the mask and storage parameters match,
		 * and unmounts it if it does not match.
		 * @param {ReactComponent} Component react component
		 * @param {ReactComponent} NewComponent new react component
		 * @return {ReactComponent} react component
		 */
		replace: (Component, NewComponent) => renderer(Component, NewComponent),

		/**
		 * Updating a component when the mask and storage values match
		 * @param {ReactComponent} Component react component
		 * @return {ReactComponent} react component
		 */
		update: (Component) => updater(Component),
	};
}