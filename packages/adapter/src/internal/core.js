
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
        connect: (context, next) => {
            let resolve = false;
            for (let connector of connectors) {
                if (connector.act === context.action) {
                    (async function () {
                        const update = connector.fn(
                            context.payload,
                            context.state,
                            { send: next, getAction: context.getAction }
                        );

                        if (update) {
                            next(update);
                        }
                    })();
                    resolve = true;
                    break;
                }
            }

            if (!resolve) {
                next(context.payload);
            }
        },

        /** create action
         * adds an action to the scheduler
         * @param {string} actionName action name
         * @param {function} fn callback function
         * @public
         */
        action: (actionName, fn) => {
            connectors.push({ act: actionName, fn });
        },
    };
}
