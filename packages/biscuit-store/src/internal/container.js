import { actionError } from './helper';

let box = null;
/**
 * Allows you to store actions in an isolated container
 * and retrieve them if necessary. It can be useful
 * for eliminating cyclic dependencies.
 */
export const container = {
	/**
	 * The method allows you to put actions in a container
	 * @param {object} actions actions object
	 */
	include: (actions) => {
		for (let key in actions) {
			actionError(actions[key]);
			box = { ...box, [actions[key].name]: actions };
		}
	},
	/**
	 * The method allows you to put actions in a container
	 * @param {string} storeName store name
	 * @return {object} actions
	 */
	extract: (storeName) => {
		return box[storeName];
	},
};