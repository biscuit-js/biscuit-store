
/**
 * A function that performs the logic
 * of an action processing task
 * @param {*} connector
 * @param {*} context
 * @param {*} next
 */
export async function runAction(connector, context, next) {
	let { payload, state, getAction, current } = context;
	const update = connector.fn(
		{ ...current, payload, state, send: next, getAction }
	);

	if (update) {
		next(update);
	}
};