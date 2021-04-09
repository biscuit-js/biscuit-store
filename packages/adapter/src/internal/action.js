
/**
 * A function that performs the logic
 * of an action processing task
 * @param {*} connector
 * @param {*} context
 * @param {*} next
 */
export function runAction({ fn }) {
	return async (context, next) => {
		let { payload, state, getAction, current } = context;
		const prevState = { ...state };
		const update = fn(
			{ ...current, payload, state, send: next, getAction }
		);

		if (update && prevState !== state) {
			next(update || state);
		}
	};
};