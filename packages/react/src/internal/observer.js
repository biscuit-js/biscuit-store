import React, { memo, useEffect, useState } from 'react';
import { utils } from '@biscuit-store/core';
import { loopDeps, getData } from './utils';

const { emitter, CreateError } = utils;

/**
 * ### Observer
 * The observer for the states of a component
 * Allows you to subscribe a component to one or more store states.
 * Makes an update when the state changes and forwards the changed data.
 * @param {import('../../types/component').ReactComponent} Element react element
 * @param {import('../../types/interfaces').Deps} deps dependence on the state
 * @return {import('../../types/component').ReactComponent}
 * @public
 */
export function observer(Element, deps) {
	let initial = {};
	let task;

	/** Create decorator */
	const Decorator = (props) => {
		const [state, setState] = useState(() => {
			initial = loopDeps(deps, initial);
			return initial;
		});

		useEffect(() => {
			if (!deps.length) {
				throw new CreateError('The observer must have dependencies.');
			}

			/** Creating a subscription to the store state */
			task = emitter.subscribeActions(deps, (e) => {
				initial[e.name] = {
					...initial[e.name],
					...getData(e.name, e.type),
				};
				/** Trigger an update */
				setState((prev) => ({ ...prev, ...initial }));
			});

			/** Unsubscribe when the component is unmounted */
			return () => task.remove();
		}, []);

		return <Element {...props} {...state} />;
	};

	/** Memoization decorator */
	return memo(Decorator);
}