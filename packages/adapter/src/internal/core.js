import { runAction } from './action';
import { runCall } from './call';
import { runPromiseFunc } from './promiseFunc';
import { makeChannel } from './makeChannel';
import { includeContext } from './includeContext';
import { runCallEffect } from './debounce';

/** A collection of tasks for the scheduler */
const tasks = {
	action: runAction,
	call: runCall,
	all: runPromiseFunc,
	race: runPromiseFunc,
	debounce: runCallEffect,
	throttle: runCallEffect,
};

/**
 * This is a feature for creating middleware for the biscuit-store.
 * Allows you to create a manageable condition.
 * @public
 */
export function createAdapter() {
	const connectors = {};
	let includes = { modify: async () => ({}) };
	const taskCache = {};

	/**
	 * Function for processing the task
	 * @param {object} connector
	 * @param {object} context
	 * @param {function} next
	 * @return {bool}
	 */
	const runWork = async (connector, context, next) => {
		if (connector) {
			const n = connector.actionName;
			if (!taskCache[n]) {
				taskCache[n] = tasks[connector.type](connector);
			}

			if (connector.await) {
				await taskCache[n](context, next);
				return true;
			}
			taskCache[n](context, next);
			return true;
		}
	};

	/**
	 * The function creates a task
	 * @param {object} params
	 */
	const createWork = (params) => {
		connectors[params.type] = {
			...connectors[params.type],
			[`"${params.actionName}"`]: params,
		};
	};

	return {
		/**
		 * Сonnector for biscuit middleware
		 * launches tasks from the scheduler when an action is triggered
		 * @param {object} context context contains action parameters
		 * @param {function} next callback function
		 * @public
		 */
		connect: async (context, next) => {
			let resolve;
			const ctx = { ...context, current: await includes.modify(context) };

			for (let key in tasks) {
				if (connectors[key] && connectors[key][`"${ctx.action}"`]) {
					const connector = connectors[key][`"${ctx.action}"`];
					resolve = await runWork(connector, ctx, next);
					break;
				}
			}

			if (!resolve) {
				next(ctx.payload);
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
			createWork({ type, actionName, fn, await: false });
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
			createWork({
				type,
				actionName,
				fn,
				handler,
				await: true,
			});
		},

		/**
		 * This method implements the logic identical to promise.all.
		 * @param {string} actionName action name
		 * @param {function} handler handler of the received result
		 * @param {function[]} fns arrauy async functions
		 */
		all: (actionName, handler = null, fns = []) => {
			const type = 'all';
			createWork({
				type,
				actionName,
				fns,
				handler,
				await: true,
			});
		},

		/**
		 * This method implements the logic identical to promise.race.
		 * @param {string} actionName action name
		 * @param {function} handler handler of the received result
		 * @param {function[]} fns arrauy async functions
		 */
		race: (actionName, handler = null, fns = []) => {
			const type = 'race';
			createWork({
				type,
				actionName,
				fns,
				handler,
				await: true,
			});
		},

		/**
		 * This method allows you to call an action with the debounce effect
		 * @param {string} actionName action name
		 * @param {function} fn listner function
		 * @param {number} limit time limit
		 * @param {bool} immediate first call
		 */
		debounce: (actionName, fn, limit = 0, immediate = false) => {
			const type = 'debounce';
			createWork({
				type,
				actionName,
				fn,
				limit,
				immediate,
				await: true,
			});
		},

		/**
		 * This method allows you to call an action with the throttle effect
		 * @param {string} actionName action name
		 * @param {function} fn listner function
		 * @param {number} limit time limit
		 */
		throttle: (actionName, fn, limit = 0) => {
			const type = 'throttle';
			createWork({
				type,
				actionName,
				fn,
				limit,
				immediate: false,
				await: true,
			});
		},

		/**
		 * Allows you to include the dataset in the adapter context
		 * can get data from asynchronous asynchronous function
		 * @param {function} ctxCreator context creator function
		 * @param {object} options behavioral options
		 * @async
		 */
		includeContext: includeContext.bind(includes),

		/**
		 * Function for creating a channel
		 */
		makeChannel,
	};
}
