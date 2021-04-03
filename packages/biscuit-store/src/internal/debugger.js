import { repositories, settings } from './repositories';
import { messages } from './messages';

/** debuger list */
export const debugCollection = {};

/**
 * Write log object
 * @param {string} message message
 * @param {string} storeName store name
 */
const writeLog = function (type, message, storeName) {
	if (Object.keys(debugCollection).length > 0) {
		const line = this.stack.split('\n')[1].split(':')[2];
		createLog(
			{
				message: this.name + ': ' + message,
				file: line,
				level: storeName ? 'local' : 'global',
				store: storeName,
				type,
			},
			storeName
		);
	}
};

/**
 * This method processes the storage logs
 * and outputs them to the debugger if necessary.
 * @param {any} data is error -> new Error, is warn -> string
 * @param {string} storeoName store name
 * @public
 */
export const createLog = function (data, storeName) {
	for (const key in debugCollection) {
		if (key === storeName) {
			debugCollection[key](data);
		}

		if (!storeName) {
			debugCollection[key](data);
		}
	}
};

/**
 * Create  log
 * @param {string} message message
 * @param {string} storeName store name
 * @public
 */
export class Log extends Error {
	constructor(message, storeName) {
		super(message);
		this.name = 'Biscuit log';
		writeLog.call(this, 'log', message, storeName);
	}
}

/**
 * Create warning log
 * @param {string} message message
 * @param {string} storeName store name
 * @public
 */
export class Warning extends Error {
	constructor(message, storeName) {
		super(message);

		if (settings.strictMode[storeName]) {
			// eslint-disable-next-line no-console
			console.warn(message);
		}

		this.name = 'Biscuit warn';
		writeLog.call(this, 'warning', message, storeName);
	}
}

/**
 * Create error log
 * @param {string} message message
 * @param {string} storeName store name
 * @public
 */
export class CreateError extends Error {
	constructor(message, storeName) {
		super(message);
		this.name = 'Biscuit error';
		writeLog.call(this, 'error', message, storeName);
	}
}

/**
 * This method allows you to add your own debugger.
 * The debugger will accept and output logs instead of the standard debugger.
 * @param {import('../../types/store').Store} store store object
 * @param {import('../../types/store').DebuggerListener} fn
 * debugger callback function
 * @public
 */
export function createDebuger(store, fn) {
	if (!repositories[store.name]) {
		throw new CreateError(messages.noStore(store.name));
	}

	if (typeof fn !== 'function') {
		throw new CreateError(messages.debuggerNoFunc);
	}

	debugCollection[store.name] = fn;
}
