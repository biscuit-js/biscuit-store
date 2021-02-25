
/**
 * A function that performs the logic
 * of an action processing task
 * @param {*} connector
 * @param {*} context
 * @param {*} next
 */
export async function runAction(connector, context, next) {
    const update = connector.fn(
        context.payload,
        context.state,
        { send: next, getAction: context.getAction }
    );

    if (update) {
        next(update);
    }
};