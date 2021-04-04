/**
 * This method implements the logic identical to promise.all.
 * @param {*} connector
 * @param {*} context
 * @param {*} next
 */
export async function runPromiseFunc(connector, context, next) {
	let { payload, state, getAction, current } = context;

	const runtime = (ctx) => {
		return connector.fns.map((fn) => {
			return fn(ctx);
		});
	};

	const res = await Promise
		[connector.type](runtime({ payload, state, getAction, current }));

	let handleData = await connector.handler(res);

	next(handleData);
};