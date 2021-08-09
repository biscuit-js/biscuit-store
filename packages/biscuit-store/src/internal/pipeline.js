import { CreateError } from './debugger';
import { messages } from './messages';

/**
 * Simultaneous launch of several dispatchers
 * @param { import("../../../types/types").StateAction[] } actions state actions
 * @return {(...payload: {[prop: string]: any}) => void}
 * method that accepts the payload
 */
export function pipeline(...actions) {
	return async function (...payload) {
		let i = 0;
		for (let action of actions) {
			let p = !payload[i] ? {} : payload[i];
			if ('dispatch' in action) {
				await action.dispatch(p);
				i += 1;
				continue;
			}
			throw new CreateError(messages.pipelineNotAction);
		}
	};
}