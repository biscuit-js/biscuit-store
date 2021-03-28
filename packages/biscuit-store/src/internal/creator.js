import { debugCollection, CreateError } from './debugger';
import { repositories, states, middlewares, settings } from './repositories';

import {
	dispatch,
	subscribeToState,
	getState,
	getStore,
	subscribeToStore,
	addStore,
} from './store';
import { typeOf } from './utils';
import { actionError } from './helper';
import { messages } from './messages';
import { callFromStore } from './callFromStore';

/**
 * This method is responsible for creating a new store.
 * Takes as the first argument a string with the store name.
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {import('../../types/store').Store} initial initial object
 * @public
 */
export function newStore(name, initial = {}) {
	if (!name) {
		throw new CreateError(messages.noStoreName);
	}

	if (typeof name !== 'string') {
		throw new CreateError(messages.storageNameError('newStore'));
	}

	if (typeOf(initial) !== 'object') {
		throw new CreateError(messages.initialType, name);
	}

	repositories[name] = { content: initial, actions: {} };

	return {
		name,
		/** Subscribe by change @param {function} fn */
		subscribe: (fn) => subscribeToStore(name, fn),
		/** get reposiory */
		get: () => getStore(name),
		/** add to reposiory @param {object} instance */
		add: (instance) => addStore(name, instance),
	};
}

/**
 * This method binds states to the storage via the "add" method.
 * Gets the storage name string as an argument.
 * @param {import('../../types/store').Store} params name of the linked storage
 * @return {import('../../types/state').ActionCreator} returns the "add" method
 * @public
 */
export function createActionTo(params) {
	if (!repositories[params.name]) {
		throw new CreateError(messages.storeNotFind);
	}

	const createNewState = (stns) => {
		if (!stns.branch) {
			return repositories[params.name];
		}

		return {
			content: {
				...repositories[params.name].content,
				...stns.initial,
			},
		};
	};

	return {
		/** This method binds the state to the selected storagee
		 * @param {string} action state name
		 * @param {import('../../types/state').StateOptions} options
		 * state options
		 * @return {import('../../types/state').StateAction}
		 * @public
		 */
		bind: (action, options = { branch: false, initial: {} }) => {
			if (typeof action !== 'string') {
				throw new CreateError(messages.actionString, params.name);
			}

			const actionStr = `"${action}"`;

			states[actionStr] = {
				...states[actionStr],
				[params.name]: createNewState(options),
			};

			const actionParams = {
				name: params.name,
				type: action,
			};

			const returnedParams = {
				...actionParams,
				/**
				 * Update state
				 * @param {import('../../types/state').DispatchPayload} payload
				 * @public
				 */
				dispatch: (payload = {}) => dispatch(actionParams, payload),
				/**
				 * Subscribe to state
				 * @param {import('../../types/subscribe').SubscribeListner} fn
				 * callback
				 * @public
				 */
				subscribe: (fn) => subscribeToState(actionParams, fn),

				/**
				 * Get state
				 * @public
				 */
				getState: () => getState(actionParams),
			};

			repositories[params.name].actions[`"${action}"`] = returnedParams;
			return returnedParams;
		},
		/** store name */
		name: params.name,
	};
}

/**
 * This helper method takes the first parameter "createactionsTo"
 * and adds actions to it from the string array of the second argument.
 * @param {import('../../types/state').ActionCreator} createActions
 * createactionsto(storage name) method
 * @param {array[string]} actions actions string array
 * @return {{import('../types/state').StateAction}[]} actions
 * @public
 */
export function initialActions(createActions, actions) {
	return actions.map((item) => {
		const args =
			typeof item === 'string' ? [item] : [item.name, item.options];

		return createActions.bind.apply(null, args);
	});
}

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

/**
 * This method allows you to add middleware for the state handler.
 * @param {import('../../types/store').Store} store the store params
 * @return {import('../../types/store').MiddlewareParams}
 * returns a set of methods
 * @public
 */
export function middleware(store) {
	if (!repositories[store.name]) {
		throw new CreateError(messages.noStore(store.name));
	}

	const s = store.name;
	return {
		/**
		 * Adds a handler to the middleware task list.
		 * @param {function} fn middle function
		 * @public
		 */
		add: (fn) => {
			if (typeof fn !== 'function') {
				throw new CreateError(messages.middleNoFunc, s);
			}

			if (middlewares[s]) {
				middlewares[s].push(fn);
			} else {
				middlewares[s] = [fn];
			}
		},
	};
}

/**
 * This method allows you to add your own debugger.
 * The debugger will accept and output logs instead of the standard debugger.
 * @param {import('../../types/store').Store} store store object
 * @param {import('../../types/store').DebuggerListener} fn
 * debugger callback function
 * @public
 */
export function createDebuger(store, fn) {
	if (!repositories[store.name]) {
		throw new CreateError(messages.noStore(store.name));
	}

	if (typeof fn !== 'function') {
		throw new CreateError(messages.debuggerNoFunc);
	}

	debugCollection[store.name] = fn;
}

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

	/** Strict mod */
	settings.strictMode[params.name] = params.strictMode;

	return output;
}