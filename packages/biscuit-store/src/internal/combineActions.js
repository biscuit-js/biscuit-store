
/**
 * This method allows you to add combined state
 * containers to the createStore structure
 * @param {import('../../types/store').CombineProto} proto actions object
 * @return {import('../../types/store').CombineActions}
 *  a set of parameters containing the actions and middleware fields
*/
export function combineActions(proto) {
	const actions = {};
	const middle = {};
	for (let key in proto) {
		actions[key] = `${key}/action`;
		middle[actions[key]] = proto[key];
	}

	return {
		actions,
		middleware: [
			async ({ action, state, payload }, next) => {
				if (!middle[action]) {
					next(payload);
					return;
				}

				const res = await middle[action](state, payload);
				if (res) {
					next(res);
					return;
				}
				next(state);
			},
		],
	};
}