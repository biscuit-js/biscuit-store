
/**
 * A function that performs the logic
 * of the asynchronous function call task
 * @param {*} connector
 * @param {*} context
 * @param {*} next
 */
export async function runCall(connector, context, next) {
    let handleData = null;
    const update = await connector.fn(
        context.payload,
        context.state,
        { getAction: context.getAction }
    );

    if (connector.handler) {
        handleData = connector.handler(update);
    }

    next(handleData || update);
};