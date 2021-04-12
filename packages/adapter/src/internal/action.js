
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
		let checkSend;
		const update = fn(
			{ ...current, payload, state, get send() {
				checkSend = true;
				return next;
			}, getAction }
		);

		if (!checkSend) {
			next(update || state);
		}
	};
};