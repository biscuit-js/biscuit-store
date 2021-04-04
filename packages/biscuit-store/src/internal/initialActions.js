/**
 * This helper method takes the first parameter "createactionsTo"
 * and adds actions to it from the string array of the second argument.
 * @param {import('../../types/state').ActionCreator} createActions
 * createactionsto(storage name) method
 * @param {array[string]} actions actions string array
 * @return {{import('../types/state').StateAction}[]} actions
 * @public
 */
export function initialActions(createActions, actions) {
	return actions.map((item) => {
		const args =
			typeof item === 'string' ? [item] : [item.name, item.options];

		return createActions.bind.apply(null, args);
	});
}
