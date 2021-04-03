import { CreateError } from './debugger';
import { repositories, states } from './repositories';
import { dispatch, subscribeToState, getState } from './store';
import { messages } from './messages';

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