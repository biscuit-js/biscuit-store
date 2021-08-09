import { pipeline } from '@biscuit-store/core';

/**
 * ### usePipeline
 * This hook synchronously launches several actions.
 * Returns a callback that can accept one or more values,.
 * @param {import('../../../types').StateAction[]} actions state params
 * @return callback
 * @public
 */
export function usePipeline(...actions) {
	return pipeline(...actions);
}