import { actionError } from './helper';

/**
 * This helper method converts the actions received via the argument to an array
 * @return {import('../../types/state').StateCollection}
 * returns the "compile" method
 * @public
 */
export function stateCollection() {
	const collection = {};
	return {
		/**
		 * compile state collection
		 * @return {import('../../types/state').StateCollectionRepo}
		 * actions collection
		 * @public
		 */
		compile: (...actions) => {
			for (let action of actions) {
				actionError(action);

				if (!collection[action.name]) {
					collection[action.name] = [{ ...action }];
					continue;
				}

				collection[action.name].push({ ...action });
			}

			return { ...collection };
		},
		/**
		 * Get the entire collection actions
		 * @return {import('../../types/state').StateCollectionRepo}
		 * collections instance
		 * @public
		 */
		all: () => ({ ...collection }),

		/**
		 * Get a collection by matching the storage name
		 * @param {string} name storage name
		 * @return {import('../../types/state').StateAction[]}
		 * collections instance
		 * @public
		 */
		fromStore: (name) => [...collection[name]],

		/**
		 * Get the result filtered by state name
		 * @param {string} stateName state name
		 * @return {import('../../types/state').StateAction[]} state list
		 * @public
		 */
		outOfState: (actionName) => {
			let out = [];
			for (let key in collection) {
				out = [
					...out,
					...collection[key].filter(
						({ type }) => type === actionName
					),
				];
			}

			return out;
		},
	};
}
