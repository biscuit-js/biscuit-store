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
    const connectors = [];

    return {
        /** connector for biscuit middleware
         * launches tasks from the scheduler when an action is triggered
         * @param {object} context context contains action parameters
         * @param {function} next callback function
         * @public
         */
        connect: async (context, next) => {
            let resolve = false;
            for (let connector of connectors) {
                if (connector.act === context.action) {
                    const task = () => tasks[connector.type](connector, context, next);

                    if (connector.await) {
                        await task();
                    } else {
                        task();
                    }


                    resolve = true;
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
         * @param {import('../../types/adapter').ActionListner} fn callback function
         */
        action: (actionName, fn) => {
            connectors.push({
                act: actionName,
                fn,
                type: 'action',
                await: false,
            });
        },

        /**
         * Сall async method
         * сalls an asynchronous function and handler in the scheduler.
         * @param {string} actionName action name
         * @param {import('../../types/adapter').ActionListner} fn async function
         * @param {import('../../types/adapter').CallHandler} handler handler of the received result
         */
        call: (actionName, fn, handler = null) => {
            connectors.push({
                act: actionName,
                fn,
                handler,
                type: 'call',
                await: true,
            });
        },

        /**
         * Function for creating a channel
         */
        makeChannel,
    };
}
