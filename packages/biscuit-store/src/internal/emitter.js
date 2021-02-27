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
        subscribeAction: (taskName, listener, state) => {
            if (typeof listener !== 'function') {
                throw new CreateError(messages.noListener, taskName);
            }

            if (!taskBuffer[taskName]) {
                taskBuffer[taskName] = [];
            }
            /** create task */
            const task = {
                state,
                name: taskName,
                todo: listener,
                id: taskBuffer[taskName].length,
            };
            /** write task to buffer */
            taskBuffer[task.name][task.id] = task;

            new Log(`subscribe -> store: ${taskName}, state: ${state}`, taskName);
            return {
                /** task params */
                params: task,
                /**
				 * Remove listner
				 */
                remove: () => {
                    new Log(
                        `unsubscribe -> store: ${task.name}, state: ${task.state}`,
                        task.name
                    );
                    taskBuffer[task.name].splice(task.id, 1);
                },
            };
        },

        /**
		 * This method allows you to subscribe to multiple actions.
		 * Creates multiple tasks that run a single callback function.
		 * @param {actions[object{name: string, type: string}]} actions array actions
		 * @param {function} listener callback
		 * @return {}
		 */
        subscribeActions: (actions, listener) => {
            if (typeof listener !== 'function') {
                throw new CreateError(messages.noListener);
            }

            const tasks = [];
            for (const action of actions) {
                new Log(
                    `subscribe -> name: ${action.name}, type: ${action.state}`,
                    action.name
                );

                if (!action.name) {
                    throw new CreateError(messages.noValidAction);
                }

                if (!taskBuffer[action.name]) {
                    taskBuffer[action.name] = [];
                }
                /** create task */
                const task = {
                    state: action.type,
                    name: action.name,
                    todo: listener,
                    id: taskBuffer[action.name].length,
                };
                /** write task to buffer */
                taskBuffer[task.name][task.id] = task;
                /** write tasks to an array, for subsequent
				 *  deletion via the remove method */
                tasks.push(task);
            }

            return {
                /** tasks array */
                params: tasks,
                /**
				 * Remove listners
				 */
                remove: () => {
                    for (const task of tasks) {
                        new Log(
                            `unsubscribe -> name: ${task.name}, type: ${task.state}`,
                            task.name,
                        );
                        taskBuffer[task.name].splice(task.id, 1);
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
        dispatchAction: (action) => {
            new Log(
                `dispatch -> name: ${action.name}, type: ${action.type}`,
                action.name
            );

            if (taskBuffer[action.name]) {
                taskBuffer[action.name].forEach((task) => {
                    /**
					 * If the status field is not defined,
					 * then run the task without additional checks, if the field is found,
					 * then perform a state comparison
					 */
                    if (task.state === action.type) {
                        task.todo(task);
                    }

                    if (task.state === undefined) {
                        task.todo(task);
                    }
                });
                return;
            }

            new Warning(
                `store "${action.name}" has no active subscriptions.`,
                action.name
            );
        },
    };
}

export const emitter = createEmitter();