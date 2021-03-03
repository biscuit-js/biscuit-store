import { repositories } from './repositories';
import { dispatch } from './store';
import {
	getStateLink,
	getStoreContent,
	compareObject,
	actionError,
} from './helper';

/**
 * The State Manager allows you to manage the storage and its state.
 * Provides a set of methods for two-way merge, replace, copy,
 * and other actions between the selected storage and state.
 * @param {import('../../types/state').AnyAction} action
 * the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */
export function createManager(action) {
	actionError(action);
	return {
		/**
		 * This method will combine data
		 * from the state with data from the storage.
		 * @public
		 */
		merge: () => {
			repositories[action.name].content = {
				...getStoreContent(action.name),
				...getStateLink(action).content,
			};
		},

		/**
		 * This method will merge data
		 * from the storage with data from the state.
		 * @public
		 */
		pull: () => {
			getStateLink(action).content = {
				...getStateLink(action).content,
				...getStoreContent(action.name),
			};
		},

		/**
		 * This method will replace the data from the storage with state data.
		 * @public
		 */
		replaceStore: () => {
			repositories[action.name].content = {
				...getStateLink(action).content,
			};
		},

		/**
		 * This method will replace the data
		 * from the state with the storage data.
		 * @public
		 */
		replaceState: () => {
			getStateLink(action).content = {
				...getStoreContent(action.name),
			};
		},

		/**
		 * This method will merge the data of the selected state
		 * with the data of the state specified in the arguments.
		 * @param {import('../../types/state').AnyAction} targetAction
		 * the action that you want to merge
		 * @public
		 */
		mergeState: (targetAction) => {
			actionError(targetAction);
			getStateLink(action).content = {
				...getStateLink({
					type: targetAction.type,
					name: action.name,
				}).content,
				...getStateLink(action).content,
			};
		},

		/**
		 * This method compares two states
		 * WARNING: states should not contain methods
		 * @param {import('../../types/state').AnyAction} targetAction
		 * the action that you want to compare
		 * @return {bool}
		 * @public
		 */
		compareStates: (targetAction) => {
			actionError(targetAction);
			return compareObject(
				getStateLink(action).content,
				getStateLink(targetAction).content
			);
		},

		/**
		 * Сompare state and store
		 * WARNING: states should not contain methods
		 * @return {bool}
		 * @public
		 */
		compareWithState: () => {
			return compareObject(
				getStoreContent(action.name),
				getStateLink(action).content
			);
		},

		/**
		 * compare state and instance object
		 * WARNING: states should not contain methods
		 * @param {object} instance object instance
		 * @return {bool}
		 * @public
		 */
		compareStateWithInstance: (instance) => {
			return compareObject(getStateLink(action).content, instance);
		},

		/**
		 * \
		 * WARNING: states should not contain methods
		 * @param {object} instance object instance
		 * @return {bool}
		 * @public
		 */
		compareStoreWithInstance: (instance) => {
			return compareObject(getStoreContent(action.name), instance);
		},

		/**
		 * Updates the status of the store.
		 * This method is equivalent to dispatch(...)
		 * @public
		 */
		update: () => {
			dispatch(action, {});
		},

		/**
		 * Returns parameters of the selected action
		 * @public
		 */
		props: action,
	};
}
