// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/core/repositories.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.settings = exports.middlewares = exports.states = exports.repositories = exports.collections = void 0;

/** actions collection */
let collections = {};
/** storage instance */

exports.collections = collections;
const repositories = {};
/** states instance */

exports.repositories = repositories;
const states = {};
/** middlewares list */

exports.states = states;
const middlewares = {};
/** store settings */

exports.middlewares = middlewares;
const settings = {
  strictMode: {}
};
exports.settings = settings;
},{}],"../src/core/debugger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateError = exports.Warning = exports.Log = exports.createLog = exports.debugCollection = void 0;

var _repositories = require("./repositories");

/** debuger list */
const debugCollection = {};
/**
 * Write log object
 * @param {string} message message
 * @param {string} repoName repository name
 */

exports.debugCollection = debugCollection;

const writeLog = function (type, message, repoName) {
  if (Object.keys(debugCollection).length > 0) {
    const line = this.stack.split('\n')[1].split(':')[2];
    createLog({
      message: this.name + ': ' + message,
      file: line,
      level: repoName ? 'local' : 'global',
      repo: repoName,
      type
    }, repoName);
  }
};
/**
 * This method processes the storage logs
 * and outputs them to the debugger if necessary.
 * @param {any} data is error -> new Error, is warn -> string
 * @param {string} repoName repository name
 * @public
 */


const createLog = function (data, repoName) {
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


exports.createLog = createLog;

class Log extends Error {
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


exports.Log = Log;

class Warning extends Error {
  constructor(message, repoName) {
    super(message);

    if (_repositories.settings.strictMode[repoName]) {
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


exports.Warning = Warning;

class CreateError extends Error {
  constructor(message, repoName) {
    super(message);
    this.name = 'Biscuit error';
    writeLog.call(this, 'error', message, repoName);
  }

}

exports.CreateError = CreateError;
},{"./repositories":"../src/core/repositories.js"}],"../src/core/emitter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitter = void 0;

var _debugger = require("./debugger");

const messages = {
  noListener: 'The subscriber\'s listener must be a function.',
  noValidAction: 'An invalid dependencies was processed.'
};
/**
 * Module of the library responsible for creating tasks and subscribing to them.
 * @param  {string} action action name
 * @return {object} methods
 * @public
 */

function createEmmitor() {
  const taskBuffer = {};
  return {
    /**
    * This method allows you to subscribe to an action.
    * Creates a task that puts its own callback function,
    * which should then be started by the dispatcher
    * @param {string} stateName name of the state to subscribe to
    * @param {function} listener callback function
    * @param {string} state store state
    * @return {object{params: object, remove: function}} returned task id
    * @public
    */
    subscribeAction: (taskName, listener, state) => {
      if (typeof listener !== 'function') {
        throw new _debugger.CreateError(messages.noListener, taskName);
      }

      if (!taskBuffer[taskName]) {
        taskBuffer[taskName] = [];
      }
      /** create task */


      const task = {
        state,
        name: taskName,
        todo: listener,
        id: taskBuffer[taskName].length
      };
      /** write task to buffer */

      taskBuffer[task.name][task.id] = task;
      new _debugger.Log(`subscribe -> store: ${taskName}, state: ${state}`);
      return {
        /** task params */
        params: task,

        /**
        * Remove listner
        */
        remove: () => {
          new _debugger.Log(`unsubscribe -> store: ${task.name}, state: ${task.state}`);
          taskBuffer[task.name].splice(task.id, 1);
        }
      };
    },

    /**
    * This method allows you to subscribe to multiple actions.
    * Creates multiple tasks that run a single callback function.
    * @param {actions[object{repo: string, store: string}]} actions array actions
    * @param {function} listener callback
    * @return {}
    */
    subscribeActions: (actions, listener) => {
      if (typeof listener !== 'function') {
        throw new _debugger.CreateError(messages.noListener);
      }

      const tasks = [];

      for (const action of actions) {
        new _debugger.Log(`subscribe -> store: ${action.repo}, state: ${action.state}`);

        if (!action.repo) {
          throw new _debugger.CreateError(messages.noValidAction);
        }

        if (!taskBuffer[action.repo]) {
          taskBuffer[action.repo] = [];
        }
        /** create task */


        const task = {
          state: action.state,
          name: action.repo,
          todo: listener,
          id: taskBuffer[action.repo].length
        };
        /** write task to buffer */

        taskBuffer[task.name][task.id] = task;
        /** write tasks to an array, for subsequent
        *  deletion via the remove method */

        tasks.push(task);
      }

      return {
        /** tasks array */
        params: tasks,

        /**
        * Remove listners
        */
        remove: () => {
          for (const task of tasks) {
            new _debugger.Log(`unsubscribe -> store: ${task.name}, state: ${task.state}`);
            taskBuffer[task.name].splice(task.id, 1);
          }
        }
      };
    },

    /**
    * Starts all tasks that match the specified state name
    * and passes data to their callback functions.
    * @param {object{repo: string, state: string}} action action params
    * @async
    * @public
    */
    dispatchAction: action => {
      new _debugger.Log(`dispatch -> store: ${action.repo}, state: ${action.state}`);

      if (taskBuffer[action.repo]) {
        taskBuffer[action.repo].forEach(task => {
          /**
          * If the status field is not defined,
          * then run the task without additional checks, if the field is found,
          * then perform a state comparison
          */
          if (task.state === action.state) {
            task.todo(task);
          }

          if (task.state === undefined) {
            task.todo(task);
          }
        });
        return;
      }

      new _debugger.Warning(`store "${action.repo}" has no active subscriptions.`, action.repo);
    }
  };
}

const emitter = createEmmitor();
exports.emitter = emitter;
},{"./debugger":"../src/core/debugger.js"}],"../src/core/helper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStateRepo = getStateRepo;
exports.getRepository = getRepository;
exports.activeMiddlewares = activeMiddlewares;
exports.gettter = gettter;
exports.compareObject = compareObject;

var _repositories = require("./repositories");

function getStateRepo(action) {
  return _repositories.states[`"${action.state}"`][action.repo];
}

function getRepository(name) {
  return _repositories.repositories[name].content;
}
/**
 * Helper method for running middleware
 * @param {object} context handler context
 * @param {function} fn callback
 * @async
 * @private
 */


async function activeMiddlewares(context, fn = () => null) {
  if (_repositories.middlewares[context.repo]) {
    await _repositories.middlewares[context.repo].forEach(middle => {
      middle(context, fn);
    });
  } else {
    fn(context.payload);
  }
}
/**
 * This method is used to get the values of the object without
 * the possibility of overwriting.
 * by attempting to write generates an error.
 * @param {object} instance object to extract
 * @return {object} returns a modified copy of the object
 * @private
 */


function gettter(instance) {
  return Object.freeze({ ...instance
  });
}
/**
 * Helper method for comparing two objects
 * Warning: can't compare methods
 * @param {object} firstState first object
 * @param {object} lastState last object
 * @return {bool}
 * @private
 */


function compareObject(firstState, lastState) {
  let propInFirst = 0;
  let propInLast = 0;
  let prop;

  if (firstState === lastState) {
    return true;
  }

  if (firstState === null || typeof firstState !== 'object' || lastState === null || typeof lastState !== 'object') {
    return false;
  }

  for (prop in firstState) {
    propInFirst += 1;
  }

  for (prop in lastState) {
    propInLast += 1;

    if (!(prop in firstState) || !compareObject(firstState[prop], lastState[prop])) {
      return false;
    }
  }

  return propInFirst === propInLast;
}
},{"./repositories":"../src/core/repositories.js"}],"../src/core/dispatch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchProto = dispatchProto;
exports.dispatchInitMiddleware = dispatchInitMiddleware;

var _repositories = require("./repositories");

var _helper = require("./helper");

var _emitter = require("./emitter");

function dispatchProto({
  action,
  prev,
  act,
  payData
}) {
  /**
  * Call before state change
  * @param {function} fn callback
  * @public
  */
  this.before = fn => {
    fn(prev);
    return this;
  };
  /**
  * Merge state into repository
  * @public
  */


  this.merge = () => {
    _repositories.repositories[action.repo].content = { ...act,
      ...payData
    };
    return this;
  };
  /**
  * Call after state change
  * @param {function} fn callback
  * @async
  * @public
  */


  this.after = async fn => {
    let task;

    const call = function (resolve) {
      resolve({ ...(0, _helper.getStateRepo)(action).content
      });
      task.remove();
    };

    await new Promise(resolve => {
      task = _emitter.emitter.subscribeAction(action.repo, () => call(resolve), action.state);
    }).then(fn);
    return this;
  };
}

async function dispatchInitMiddleware({
  action,
  payData,
  act
}) {
  return await new Promise(resolve => {
    (0, _helper.activeMiddlewares)({
      action: action.state,
      repo: action.repo,
      payload: payData,
      state: act
    }, newPayload => {
      resolve(newPayload);
    });
  });
}
},{"./repositories":"../src/core/repositories.js","./helper":"../src/core/helper.js","./emitter":"../src/core/emitter.js"}],"../src/core/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttle = throttle;
exports.debounce = debounce;
exports.type = type;
exports.memoize = exports.sandbox = void 0;

/**
 * Creates a throttled function that only invokes func
 * at most once per every wait milliseconds.
 * @param {function} callback target function
 * @param {number} limit counter
 * @return {function}
 */
function throttle(callback, limit) {
  let waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}
/**
 * Creates a debounced function that delays invoking func
 * until after wait milliseconds have elapsed since
 * the last time the debounced function was invoked.
 * @param {function} callback target function
 * @param {number} limit counter
 * @return {function}
 */


function debounce(callback, limit) {
  let isCooldown = false;
  return function () {
    if (isCooldown) {
      return;
    }

    callback.apply(this, arguments);
    isCooldown = true;
    setTimeout(() => isCooldown = false, limit);
  };
}
/**
 * This method set allows you to. save the state of functions
 * tied to the timer. Required for the case when the timer
 * function is initialized in a method with a frequent call,
 * for example, in the react function component.
 * @param {function} fn target function
*/


const sandbox = fn => {
  return {
    run: function () {
      let throt = null;
      /** initial run
       * @param {function} call target function
       * @param {number} timer timeout
      */

      const initialThrottle = (call, timer) => {
        if (!throt) {
          throt = fn(call, timer);
        }
      };
      /** initial run
       * @param {args[any]} args arguments
       * @return {function}
       */


      const throttleCaller = (...args) => {
        return throt(...args);
      };
      /** initial
      * @param {function} call target function
      * @param {number} timer timeout
      * @return {function} throttleCaller
      */


      return (call, timer) => {
        initialThrottle(call, timer);
        return throttleCaller;
      };
    }()
  };
};
/**
 * memoized function
 * @param {function} fn target function
 * @return {function}
*/


exports.sandbox = sandbox;

const memoize = fn => {
  const cache = {};
  return (...args) => {
    const n = args[0];

    if (n in cache) {
      return cache[n];
    } else {
      const result = fn(n);
      cache[n] = result;
      return result;
    }
  };
};
/**
 * Strict type checking
 * @param {*} value any value
 */


exports.memoize = memoize;

function type(value) {
  const regex = /^\[object (\S+?)]$/;
  const matches = Object.prototype.toString.call(value).match(regex) || [];
  return (matches[1] || 'undefined').toLowerCase();
}
},{}],"../src/core/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRepo = addRepo;
exports.getRepo = getRepo;
exports.getState = getState;
exports.dispatch = dispatch;
exports.subscribeToState = subscribeToState;
exports.subscribeToStore = subscribeToStore;
exports.manager = manager;

var _repositories = require("./repositories");

var _emitter = require("./emitter");

var _helper = require("./helper");

var _dispatch = require("./dispatch");

var _debugger = require("./debugger");

var _utils = require("./utils");

/**
 * BISCUIT STORAGE
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */
const messages = {
  noRepo: name => `repository <${name}> not found.`,
  noState: name => `state <${name}> not found.`,
  initialType: 'The initial must be an object.'
};

const actionError = action => {
  if (!action || !action.repo || !action.state) {
    throw new _debugger.CreateError('Invalid action parameters.');
  }

  if (!_repositories.repositories[action.repo]) {
    throw new _debugger.CreateError(messages.noRepo(action.repo));
  }

  if (!_repositories.states[`"${action.state}"`]) {
    throw new _debugger.CreateError(messages.noState(action.state), action.repo);
  }
};
/**
 * Allows you to subscribe to the store. and tracks its change.
 * @param {string} repo repository name
 * @param {function} fn callback
 * @param {string} state state name
 * @return {Promise}
 * @async
 */


const subscriber = function (repo, fn, state) {
  let task;
  const promise = new Promise(resolve => {
    task = _emitter.emitter.subscribeAction(repo, () => {
      /** if there is a state then pick it up */
      const data = state ? getState({
        repo,
        state
      }) : getRepo(repo);
      fn(data, task);
      resolve(data);
    }, state);
  });
  const resolve = this.resolve(promise);
  resolve['unsubscribe'] = task.remove;
  return resolve;
};
/**
 * This method allows you to add new values to the repository.
 * Accepts the storage name and object.
 * @param {string} name repository name
 * @param {object} instance object with added data
 * @public
 */


function addRepo(name, instance) {
  if (!_repositories.repositories[name]) {
    throw new _debugger.CreateError(messages.noRepo(name));
  }

  if ((0, _utils.type)(instance) !== 'object') {
    throw new _debugger.CreateError(messages.initialType);
  }

  _repositories.repositories[name].content = { ...(0, _helper.getRepository)(name),
    ...instance
  };
}
/**
 * This method is used to get data from the storage by its key.
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "addRepo"
 * method or with state injection via "manager".
 * @param {string} name storage name
 * @return {object} storage data
 * @public
 */


function getRepo(name) {
  if (!_repositories.repositories[name]) {
    throw new _debugger.CreateError(messages.noRepo(name));
  }

  return (0, _helper.gettter)({ ...(0, _helper.getRepository)(name)
  });
}
/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)"
 * method or with an implementation via "manager".
 * @param {object{repo: string, state: string}} action the parameters of the action
 * @return {object} state data
 * @public
 */


function getState(action) {
  actionError(action);
  return (0, _helper.gettter)({ ...(0, _helper.getStateRepo)(action).content
  });
}
/**
 * This is one of the most important methods.
 * allows you to asynchronously update and change the state of the storage.
 *
 * The first argument accepts action parameters,
 * the second argument accepts an object with new data
 * or a callback function that returns the past state
 * as an argument and returns a new state.
 *
 * Dispatch also returns several methods for working with states.
 * @param {object{repo: string, state: string}} action the parameters of the action
 * @param {object | function} payload payload data or callback function
 * @return {object} returns methods: before, after, merge
 * @async
 * @public
 */


function dispatch(action, payload = {}) {
  const voids = {};
  actionError(action);

  if ((0, _utils.type)(payload) !== 'function' && (0, _utils.type)(payload) !== 'object') {
    throw new _debugger.CreateError('The payload must be an object or function.', action.repo);
  }

  (async function () {
    const act = (0, _helper.getStateRepo)(action).content;
    const prev = { ...act
    };
    /** if the function
     * then pass the current state to the callback  */

    let payData = typeof payload === 'function' ? payload(prev) : payload;

    _dispatch.dispatchProto.call(voids, {
      action,
      prev,
      act,
      payData
    });
    /** initial middlewares */


    payData = await (0, _dispatch.dispatchInitMiddleware)({
      action,
      payData,
      act
    });
    /** update state data */

    (0, _helper.getStateRepo)(action).content = { ...act,
      ...payData
    };
    /** create dispatch action */

    _emitter.emitter.dispatchAction(action);
  })();

  return voids;
}
/**
 * This is one of the most important methods.
 * Allows you to subscribe to the state. and tracks its change.
 * The first argument takes the parameters of the action.
 * results can be obtained through the callback of the second
 * argument or through the return promise.
 * @param {object{repo: string, state: string}} action the parameters of the action
 * @param {function} fn callback
 * @callback
 * @async
 * @public
 */


function subscribeToState(action, fn = () => undefined) {
  const that = Promise;

  try {
    actionError(action);
    return subscriber.call(that, action.repo, fn, action.state);
  } catch (e) {
    return that.reject(e);
  }
}
/**
 * This is one of the most important methods.
 * Allows you to subscribe to the store. and tracks its change.
 * The first argument takes the name store.
 * results can be obtained through the callback of the
 * second argument or through the return promise.
 * @param {string} repo repository name
 * @param {function} fn callback
 * @callback
 * @async
 * @public
 */


function subscribeToStore(repo, fn = () => undefined) {
  const that = Promise;

  try {
    if (!_repositories.repositories[repo]) {
      throw new _debugger.CreateError(messages.noRepo(repo));
    }

    return subscriber.call(that, repo, fn);
  } catch (e) {
    return that.reject(e);
  }
}
/**
 * The State Manager allows you to manage the storage and its state.
 * Provides a set of methods for two-way merge, replace, copy,
 * and other actions between the selected storage and state.
 * @param {object{repo: string, state: string}} action the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */


function manager(action) {
  actionError(action);
  return {
    /**
     * This method will combine data from the state with data from the storage.
     * @public
     */
    merge: () => {
      _repositories.repositories[action.repo].content = { ...(0, _helper.getRepository)(action.repo),
        ...(0, _helper.getStateRepo)(action).content
      };
    },

    /**
     * This method will merge data from the storage with data from the state.
     * @public
     */
    pull: () => {
      (0, _helper.getStateRepo)(action).content = { ...(0, _helper.getStateRepo)(action).content,
        ...(0, _helper.getRepository)(action.repo)
      };
    },

    /**
     * This method will replace the data from the storage with state data.
     * @public
     */
    replaceRepo: () => {
      _repositories.repositories[action.repo].content = { ...(0, _helper.getStateRepo)(action).content
      };
    },

    /**
     * This method will replace the data from the state with the storage data.
     * @public
     */
    replaceState: () => {
      (0, _helper.getStateRepo)(action).content = { ...(0, _helper.getRepository)(action.repo)
      };
    },

    /**
     * This method will merge the data of the selected state
     * with the data of the state specified in the arguments.
     * @param {object{repo: string, state: string}} targetAction
     * the action that you want to merge
     * @public
     */
    mergeState: targetAction => {
      actionError(targetAction);
      (0, _helper.getStateRepo)(action).content = { ...(0, _helper.getStateRepo)({
          state: targetAction.state,
          repo: action.repo
        }).content,
        ...(0, _helper.getStateRepo)(action).content
      };
    },

    /**
     * This method removes the storage and its copies from all states.
     * WARNING: This method can be useful for optimization,
     * but it can make the code non-obvious,
     * which will lead to difficulties in support.
     * @public
     */
    remove: () => {
      delete _repositories.repositories[action.repo];
      Object.keys(_repositories.states[`"${action.state}"`]).forEach(item => {
        if (item === action.repo) {
          delete _repositories.states[`"${action.state}"`][action.repo];
        }
      });
    },

    /**
     * This method compares two states for identity
     * WARNING: states should not contain methods
     * @param {object{repo: string, state: string}} targetAction
     * the action that you want to compare
     * @return {bool}
     * @public
     */
    compareStates: targetAction => {
      actionError(targetAction);
      return (0, _helper.compareObject)((0, _helper.getStateRepo)(action).content, ...(0, _helper.getStateRepo)({
        state: targetAction.state,
        repo: action.repo
      }).content);
    },

    /**
     * Сompare state and repository
     * WARNING: states should not contain methods
     * @return {bool}
     * @public
     */
    compareWithState: () => {
      return (0, _helper.compareObject)((0, _helper.getRepository)(action.repo), (0, _helper.getStateRepo)(action).content);
    },

    /**
     * compare state and instance object
     * WARNING: states should not contain methods
     * @param {object} instance object instance
     * @return {bool}
     * @public
     */
    compareStateWithInstance: instance => {
      return (0, _helper.compareObject)((0, _helper.getStateRepo)(action).content, instance);
    },

    /**
     * compare repository and instance object
     * WARNING: states should not contain methods
     * @param {object} instance object instance
     * @return {bool}
     * @public
     */
    compareRepoWithInstance: instance => {
      return (0, _helper.compareObject)((0, _helper.getRepository)(action.repo), instance);
    },

    /**
     * Clones the selected storage and its state.
     * WARNING: It is best to avoid using this method,
     * as the best practice would be to do initialization of repositories in one place.
     * Copying the repository can lead to code support difficulties.
     * @param {string} name name for the new storage
     * @public
     */
    clone: name => {
      _repositories.repositories[name] = { ...(0, _helper.getRepository)(action.repo)
      };
      _repositories.states[`"${action.state}"`][name] = { ...(0, _helper.getStateRepo)(action).content
      };
    },

    /**
     * Updates the status of the repository.
     * This method is equivalent to dispatch(...)
     * @public
     */
    update: () => {
      dispatch(action, {});
    },

    /**
     * Returns parameters of the selected action
     * @public
     */
    props: action
  };
}
},{"./repositories":"../src/core/repositories.js","./emitter":"../src/core/emitter.js","./helper":"../src/core/helper.js","./dispatch":"../src/core/dispatch.js","./debugger":"../src/core/debugger.js","./utils":"../src/core/utils.js"}],"../src/core/creator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newRepo = newRepo;
exports.createStateTo = createStateTo;
exports.initialActions = initialActions;
exports.stateCollection = stateCollection;
exports.combineStateCollections = combineStateCollections;
exports.middleware = middleware;
exports.createDebuger = createDebuger;
exports.createStore = createStore;
exports.getStateCollection = void 0;

var _debugger = require("./debugger");

var _repositories = require("./repositories");

var _store = require("./store");

var _utils = require("./utils");

/** debug messages */
const messages = {
  storageNameError: fnName => `biscuit ${fnName} error: storage name is not a string.`,
  noStoreParams: 'The createStore method must contain the storage parameters.',
  noRepoName: 'The repository name is a required field.',
  middleNoFunc: 'Middleware should be provided as a feature.',
  debuggerNoFunc: 'Debugger should be provided as a feature.',
  actionString: 'The state name must be a string.',
  repoNotFind: 'Repository not found.',
  initialType: 'The initial must be an object.',
  repoExists: 'A repository with this name already exists.'
};
/**
 * This method is responsible for creating a new repository.
 * Takes as the first argument a string with the repository name.
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {object} initial initial object
 * @public
 */

function newRepo(name, initial = {}) {
  if (!name) {
    throw new _debugger.CreateError(messages.noRepoName);
  }

  if (_repositories.repositories[name]) {
    throw new _debugger.CreateError(messages.repoExists);
  }

  if (typeof name !== 'string') {
    throw new _debugger.CreateError(messages.storageNameError('newRepo'));
  }

  if ((0, _utils.type)(initial) !== 'object') {
    throw new _debugger.CreateError(messages.initialType, name);
  }

  _repositories.repositories[name] = {
    content: initial
  };
  return {
    repo: name,

    /** Subscribe by change @param {function} fn */
    subscribe: fn => (0, _store.subscribeToStore)(name, fn),

    /** get reposiory */
    get: () => (0, _store.getRepo)(name),

    /** add to reposiory @param {object} instance */
    add: instance => (0, _store.addRepo)(name, instance)
  };
}
/**
 * This method binds states to the storage via the "add" method.
 * Gets the storage name string as an argument.
 * @param {object} params name of the linked storage
 * @return {object} returns the "add" method
 * @public
 */


function createStateTo(params) {
  if (!_repositories.repositories[params.repo]) {
    throw new _debugger.CreateError(messages.repoNotFind);
  }

  const createNewState = stns => {
    if (!stns.branch) {
      return _repositories.repositories[params.repo];
    }

    return {
      content: { ..._repositories.repositories[params.repo].content,
        ...stns.initial
      }
    };
  };

  return {
    /** This method binds the state to the selected storagee
    * @param {string} action state name
    * @public
    */
    bind: (action, options = {
      branch: false,
      initial: {}
    }) => {
      if (typeof action !== 'string') {
        throw new _debugger.CreateError(messages.actionString, params.repo);
      }

      const actionStr = `"${action}"`;
      _repositories.states[actionStr] = { ..._repositories.states[actionStr],
        [params.repo]: createNewState(options)
      };
      const actionParams = {
        repo: params.repo,
        state: action
      };
      return { ...actionParams,

        /**
        * Update state
        * @param {object} payload
        * @public
        */
        dispatch: (payload = {}) => (0, _store.dispatch)(actionParams, payload),

        /**
        * Subscribe to state
        * @param {function} fn callback
        * @public
        */
        subscribe: fn => (0, _store.subscribeToState)(actionParams, fn),

        /**
        * Get state
        * @public
        */
        getState: () => (0, _store.getState)(actionParams)
      };
    },

    /** repository key */
    repo: params.repo
  };
}
/**
 * This helper method takes the first parameter "createactionsTo"
 * and adds actions to it from the string array of the second argument.
 * @param {object} createActions createactionsto(storage name) method
 * @param {array[string]} actions actions string array
 * @public
 */


function initialActions(createActions, actions) {
  actions.forEach(item => {
    createActions.bind(item);
  });
}
/**
 * This helper method converts the actions received via the argument to an array
 * @param {args[string]} actions accepts multiple actions as arguments
 * @return {object} returns the "compile" method
 * @public
 */


function stateCollection(...actions) {
  const collection = {};
  return {
    /**
    * compile state collection
    * @return {object} actions collection
    * @public
    */
    compile: () => {
      for (let action of actions) {
        collection[action.repo].push({ ...action
        });
      }

      return collection;
    }
  };
}
/**
 * This helper method can combine multiple collections of actions.
 * Accepts "stateCollection(...action)"
 * @param {args[object]} collection array actions
 * @public
 */


function combineStateCollections(...collection) {
  collection.forEach(item => {
    _repositories.collections = ({ ..._repositories.collections,
      ...item.compile()
    }, function () {
      throw new Error('"' + "collections" + '" is read-only.');
    }());
  });
}
/**
 * A set of helper methods for extracting actions from collections
 * @static
 * @public
 */


const getStateCollection = {
  /**
  * Get the entire collection actions
  * @return {object} collections instance
  * @public
  */
  all: () => ({ ..._repositories.collections
  }),

  /**
  * Get a collection by matching the storage name
  * @param {string} repo storage name
  * @return {object} collections instance
  * @public
  */
  fromRepo: repo => ({ ..._repositories.collections[repo]
  }),

  /**
  * Get the result filtered by state name
  * @param {string} stateName state name
  * @return {array[object]} state list
  * @public
  */
  outOfState: stateName => {
    let out = null;
    Object.keys(_repositories.collections).forEach(key => {
      out = _repositories.collections[key].filter(({
        state
      }) => state === stateName);
    });
    return out;
  }
};
/**
 * This method allows you to add middleware for the state handler.
 * @param {string} action the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */

exports.getStateCollection = getStateCollection;

function middleware(action) {
  const s = action.repo;
  return {
    /**
    * Adds a handler to the middleware task list.
    * @param {function} fn middle function
    * @public
    */
    add: fn => {
      if (typeof fn !== 'function') {
        throw new _debugger.CreateError(messages.middleNoFunc, s);
      }

      if (_repositories.middlewares[s]) {
        _repositories.middlewares[s].push(fn);
      } else {
        _repositories.middlewares[s] = [fn];
      }
    }
  };
}
/**
 * This method allows you to add your own debugger.
 * The debugger will accept and output logs instead of the standard debugger.
 * @param {string} repo a string with the name of the repository
 * @param {function} fn debugger callback function
 * @public
 */


function createDebuger(repo, fn) {
  if (typeof fn !== 'function') {
    throw new _debugger.CreateError(messages.debuggerNoFunc);
  }

  _debugger.debugCollection[repo] = fn;
}
/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a repository.
 * @param {import('../types/createStore').StoreSettings} options
 * an object containing the store settings
 * @return {import('../types/createStore').StoreParams}
 * returns a set of actions
 * @public
 */


function createStore(options) {
  if (!options) {
    throw new _debugger.CreateError(messages.noStoreParams);
  }
  /** DefaultParams */


  const params = {
    strictMode: true,
    ...options
  };
  /** Create a new storage */

  const repo = newRepo(params.repo.name, params.repo.initial);
  const target = createStateTo(repo);
  /** Set of storage parameters */

  const output = {
    store: { ...repo
    },
    actions: {}
  };
  /** Adding States to the repository */

  if (params.states) {
    for (const key in params.states) {
      const param = params.states[key];
      const paramType = typeof param === 'string';
      output.actions[key] = target.bind(paramType ? param : param.name, paramType ? {} : {
        initial: param.initial,
        branch: param.branch
      });
    }
  }
  /** Adding middleware to the repository */


  if (params.middleware && params.middleware.length > 0) {
    const middle = middleware(target);

    for (const fn of params.middleware) {
      middle.add(fn);
    }
  }
  /** Adding debuger to the repository */


  if (params.debugger) {
    createDebuger(params.repo.name, params.debugger);
  }
  /** Strict mod */


  _repositories.settings.strictMode[params.repo.name] = params.strictMode;
  return output;
}
},{"./debugger":"../src/core/debugger.js","./repositories":"../src/core/repositories.js","./store":"../src/core/store.js","./utils":"../src/core/utils.js"}],"../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createStore", {
  enumerable: true,
  get: function () {
    return _creator.createStore;
  }
});
Object.defineProperty(exports, "newRepo", {
  enumerable: true,
  get: function () {
    return _creator.newRepo;
  }
});
Object.defineProperty(exports, "manager", {
  enumerable: true,
  get: function () {
    return _store.manager;
  }
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _store.dispatch;
  }
});
Object.defineProperty(exports, "getRepo", {
  enumerable: true,
  get: function () {
    return _store.getRepo;
  }
});
Object.defineProperty(exports, "getState", {
  enumerable: true,
  get: function () {
    return _store.getState;
  }
});
Object.defineProperty(exports, "addRepo", {
  enumerable: true,
  get: function () {
    return _store.addRepo;
  }
});
Object.defineProperty(exports, "subscribeToState", {
  enumerable: true,
  get: function () {
    return _store.subscribeToState;
  }
});
Object.defineProperty(exports, "subscribeToStore", {
  enumerable: true,
  get: function () {
    return _store.subscribeToStore;
  }
});

var _creator = require("./core/creator");

var _store = require("./core/store");
},{"./core/creator":"../src/core/creator.js","./core/store":"../src/core/store.js"}],"../src/script.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var index_1 = require("./index");

var _a = index_1.createStore({
  repo: {
    name: 'user',
    initial: {
      value: 0
    }
  },
  states: {
    testAdd: 'TEST/ADD',
    testRemove: 'TEST/ADD'
  }
}),
    store = _a.store,
    actions = _a.actions;
},{"./index":"../src/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54906" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/script.ts"], null)
//# sourceMappingURL=/script.82983116.js.map