/**
 * This method implements the logic identical to promise.all.
 * @param {*} connector
 * @param {*} context
 * @param {*} next
 */
export function runPromiseFunc({ fns, handler, type }) {
	return async (context, next) => {
		let { payload, state, getAction, current } = context;

		const runtime = (ctx) => {
			return fns.map((fn) => {
				return fn(ctx);
			});
		};

		const res = await Promise
			[type](runtime({ payload, state, getAction, current }));

		let handleData = await handler(res);

		next(handleData);
	};
};