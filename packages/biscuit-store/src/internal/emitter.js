import { Warning, CreateError, Log } from './debugger';
import { messages } from './messages';
/**
 * Module of the library responsible for creating tasks and subscribing to them.
 * @param  {string} action action name
 * @return {object} methods
 * @public
 */
function createEmitter() {
	const taskBuffer = {};

	return {
		/**
		 * This method allows you to subscribe to an action.
		 * Creates a task that puts its own callback function,
		 * which should then be started by the dispatcher
		 * @param {string} stateName name of the state to subscribe to
		 * @param {function} listener callback function
		 * @param {string} state store state
		 * @return {object{params: object, remove: function}} returned task id
		 */
		subscribeAction: ({ name, type }, listener) => {
			if (typeof listener !== 'function') {
				throw new CreateError(messages.noListener, name);
			}

			if (!taskBuffer[name]) {
				taskBuffer[name] = [];
			}

			/** create task */
			taskBuffer[name].push({ listener, type });
			/** create index */
			const index = taskBuffer[name].length;

			new Log(`subscribe -> ${name}`, name);
			return {
				/** Remove listner */
				remove: () => {
					taskBuffer[name] = taskBuffer[name].slice(index, 1);
					new Log(`unsubscribe -> ${name}`);
				},
			};
		},

		/**
		 * This method allows you to subscribe to multiple actions.
		 * Creates multiple tasks that run a single callback function.
		 * @param {actions[object{name: string, type: string}]} actions
		 * array actions
		 * @param {function} listener callback
		 * @return {}
		 */
		subscribeActions: (actions, listener) => {
			if (typeof listener !== 'function') {
				throw new CreateError(messages.noListener);
			}
			const tasks = [];
			for (const { name, type } of actions) {
				if (!name) {
					throw new CreateError(messages.noValidAction);
				}

				if (!taskBuffer[name]) {
					taskBuffer[name] = [];
				}

				/** write task to buffer */
				taskBuffer[name].push({ listener, type });
				/** write tasks to an array, for subsequent
				 *  deletion via the remove method */
				tasks.push({ name, index: taskBuffer[name].length });
				new Log(`subscribe -> ${name}`, name);
			}

			return {
				/** Remove listners */
				remove: () => {
					for (const { name, index } of tasks) {
						taskBuffer[name] = taskBuffer[name].slice(index, 1);
						new Log(`unsubscribe -> ${name}`, name);
					}
				},
			};
		},

		/**
		 * Starts all tasks that match the specified state name
		 * and passes data to their callback functions.
		 * @param {object{name: string, type: string}} action action params
		 * @async
		 * @public
		 */
		dispatchAction: ({ name, type }) => {
			new Log(`dispatch -> name: ${name}, type: ${type}`, name);
			if (taskBuffer[name]) {
				for (let task of taskBuffer[name]) {
					if (task.type === type) {
						task.listener({ name, type: task.type });
						continue;
					}

					if (task.type === undefined) {
						task.listener({ name, type: undefined });
					}
				}
				return;
			}
			new Warning(`store "${name}" has no active subscriptions.`, name);
		},
	};
}

export const emitter = createEmitter();