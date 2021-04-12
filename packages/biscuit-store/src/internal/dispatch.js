import { repositories } from './repositories';
import {
	activeMiddlewares,
	getStateLink,
	getStoreContentActions,
} from './helper';
import { emitter } from './emitter';

export function dispatchProto({ action, prev, payData }) {
	/**
	 * Call before state change
	 * @param {function} fn callback
	 * @public
	 */
	this.before = (fn) => {
		fn(prev);
		return this;
	};

	/**
	 * Merge state into store
	 * @public
	 */
	this.merge = () => {
		repositories[action.name].content = {
			...prev,
			...payData,
		};

		return this;
	};

	/**
	 * Call after state change
	 * @param {function} fn callback
	 * @async
	 * @public
	 */
	this.after = async (fn) => {
		let task;
		const call = function (resolve) {
			resolve({
				...getStateLink(action).content,
			});
			task.remove();
		};

		await new Promise((resolve) => {
			task = emitter.subscribeAction(action, () => call(resolve));
		}).then(fn);
		return this;
	};
}

export async function dispatchInitMiddleware({ action, payData, prev }) {
	const actions = getStoreContentActions(action.name);
	return await new Promise((resolve) => {
		activeMiddlewares(
			{
				action: action.type,
				store: action.name,
				payload: payData,
				state: prev,
				getAction: (actionName) => actions[`"${actionName}"`],
			},
			(newPayload) => {
				resolve(newPayload || payData);
			}
		);
	});
}