
import { settings } from './repositories';

/** debuger list */
export const debugCollection = {};

/**
 * Write log object
 * @param {string} message message
 * @param {string} repoName repository name
 */
const writeLog = function (type, message, repoName) {
    if (Object.keys(debugCollection).length > 0) {
        const line = this.stack.split('\n')[1].split(':')[2];
        createLog(
            {
                message: this.name + ': ' + message,
                file: line,
                level: repoName ? 'local' : 'global',
                repo: repoName,
                type,
            },
            repoName
        );
    }
};

/**
 * This method processes the storage logs
 * and outputs them to the debugger if necessary.
 * @param {any} data is error -> new Error, is warn -> string
 * @param {string} repoName repository name
 * @public
 */
export const createLog = function (data, repoName) {
    for (const key in debugCollection) {
        if (key === repoName) {
            debugCollection[key](data);
        }

        if (!repoName) {
            debugCollection[key](data);
        }
    }
};

/**
 * Create  log
 * @param {string} message message
 * @param {string} repoName repository name
 * @public
 */
export class Log extends Error {
    constructor(message, repoName) {
        super(message);
        this.name = 'Biscuit log';
        writeLog.call(this, 'log', message, repoName);
    }
}

/**
 * Create warning log
 * @param {string} message message
 * @param {string} repoName repository name
 * @public
 */
export class Warning extends Error {
    constructor(message, repoName) {
        super(message);

        if (settings.strictMode[repoName]) {
            // eslint-disable-next-line no-console
            console.warn(message);
        }

        this.name = 'Biscuit warn';
        writeLog.call(this, 'warning', message, repoName);
    }
}

/**
 * Create error log
 * @param {string} message message
 * @param {string} repoName repository name
 * @public
 */
export class CreateError extends Error {
    constructor(message, repoName) {
        super(message);
        this.name = 'Biscuit error';
        writeLog.call(this, 'error', message, repoName);
    }
}