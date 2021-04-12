
/**
 * A function that performs the logic
 * of the asynchronous function call task
 * @param {*} connector
 * @param {*} context
 * @param {*} next
 */
export function runCall({ fn, handler }) {
	return async (context, next) => {
		let { payload, state, getAction, current } = context;
		let handleData = null;
		const update = await fn(
			{ ...context.current, payload, state, getAction, current }
		);

		if (handler) {
			handleData = await handler(update);
		}

		next(handleData || update);
	};
};