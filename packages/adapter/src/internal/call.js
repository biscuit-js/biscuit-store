
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
		const ctx = { ...current, payload,
			state, getAction };
		const update = await fn(ctx);

		if (handler) {
			handleData =
				await handler(update, ctx);
		}

		next({ ...state, ...(handleData ? handleData : update) });
	};
};