import { CreateError, createDebuger } from './debugger';
import { settings } from './repositories';
import { messages } from './messages';
import { callFromStore } from './callFromStore';
import { container } from './container';
import { combineActions } from './combineActions';
import { middleware } from './middleware';
import { createActionTo } from './createActionTo';
import { newStore } from './newStore';

/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a store.
 * @param {import('../../types/store').StoreSettings} options
 * an object containing the store settings
 * @return {import('../../types/store').StoreParams}
 * returns a set of actions
 * @public
 */
export function createStore(options) {
	if (!options) {
		throw new CreateError(messages.noStoreParams);
	}

	/** DefaultParams */
	const params = { strictMode: true, ...options };

	/** Create a new storage */
	const store = newStore(params.name, params.initial);
	const createAction = createActionTo(store);

	/** Set of storage parameters */
	const output = {
		store: { ...store },
		actions: {},
	};

	/** Combine actions */
	if (params.combineActions) {
		const data = combineActions(params.combineActions);
		params.actions = { ...params.actions, ...data.actions };
		middleware(store).add(data.middleware[0]);
	}

	/** Adding States to the store */
	if (params.actions) {
		for (const key in params.actions) {
			const param = params.actions[key];
			const paramType = typeof param === 'string';
			output.actions[key] = createAction.bind(
				paramType ? param : param.name,
				paramType
					? {}
					: { initial: param.initial, branch: param.branch }
			);
		}
	}

	/** Adding middleware to the store */
	if (params.middleware && params.middleware.length > 0) {
		const middle = middleware(store);
		for (const fn of params.middleware) {
			middle.add(fn);
		}
	}

	/** Adding debuger to the store */
	if (params.debugger) {
		createDebuger(store, params.debugger);
	}

	/**
	 * Runs a method that writes the object
	 * to the store during initialization
	 */
	if (params.initialCall) {
		callFromStore(store, params.initialCall);
	}

	/** Add to container */
	if (params.addToContainer) {
		container.include(output.actions);
	}

	/** Strict mod */
	settings.strictMode[params.name] = params.strictMode;

	return output;
}