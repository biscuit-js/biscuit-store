
/**
 * A function that performs the logic
 * of the asynchronous function call task
 * @param {*} connector
 * @param {*} context
 * @param {*} next
 */
export async function runCall(connector, context, next) {
	let { payload, state, getAction, current } = context;
	let handleData = null;
	const update = await connector.fn(
		{ ...context.current, payload, state, getAction, current }
	);

	if (connector.handler) {
		handleData = connector.handler(update);
	}

	next(handleData || update);
};