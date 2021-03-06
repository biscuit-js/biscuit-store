import { runAction } from './action';
import { runCall } from './call';
import { makeChannel } from './makeChannel';

/** A collection of tasks for the scheduler */
const tasks = {
	action: runAction,
	call: runCall,
};

/**
 * This is a feature for creating middleware for the biscuit-store.
 * Allows you to create a manageable condition.
 * @public
 */
export function createAdapter() {
	const connectors = {};

	/**
	 * Function for processing the task
	 * @param {object} connector
	 * @param {object} context
	 * @param {function} next
	 * @return {bool}
	 */
	const runWork = async (connector, context, next) => {
		if (connector) {
			const task = () => tasks[connector.type](connector, context, next);
			if (connector.await) {
				await task();
			} else {
				task();
			}
			return true;
		}
		return false;
	};

	/**
	 * The function creates a task
	 * @param {object} params
	 */
	const createWork = ({ type, actionName, fn, handler, aw }) => {
		connectors[type] = {
			...connectors[type],
			[`"${actionName}"`]: {
				fn,
				type,
				handler,
				await: aw,
			},
		};
	};

	return {
		/** connector for biscuit middleware
		 * launches tasks from the scheduler when an action is triggered
		 * @param {object} context context contains action parameters
		 * @param {function} next callback function
		 * @public
		 */
		connect: async (context, next) => {
			let resolve = false;

			for (let key in tasks) {
				if (connectors[key]) {
					const connector = connectors[key][`"${context.action}"`];
					resolve = await runWork(connector, context, next);
					break;
				}
			}

			if (!resolve) {
				next(context.payload);
			}
		},

		/**
		 * Сreate action
		 * dds an action to the scheduler
		 * @param {string} actionName action name
		 * @param {import('../../types/adapter').ActionListner} fn
		 * callback function
		 */
		action: (actionName, fn) => {
			const type = 'action';
			createWork({ type, actionName, fn, aw: false });
		},

		/**
		 * Сall async method
		 * сalls an asynchronous function and handler in the scheduler.
		 * @param {string} actionName action name
		 * @param {import('../../types/adapter').ActionListner} fn
		 * async function
		 * @param {import('../../types/adapter').CallHandler} handler
		 * handler of the received result
		 */
		call: (actionName, fn, handler = null) => {
			const type = 'call';
			createWork({ type, actionName, fn, handler, aw: true });
		},

		/**
		 * Function for creating a channel
		 */
		makeChannel,
	};
}
