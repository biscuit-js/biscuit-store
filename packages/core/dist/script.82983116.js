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
})({"../src/internal/repositories.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.settings = exports.middlewares = exports.states = exports.repositories = void 0;

/** storage instance */
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
},{}],"../src/internal/debugger.js":[function(require,module,exports) {
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
},{"./repositories":"../src/internal/repositories.js"}],"../src/internal/messages.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = void 0;

/** debug messages */
const messages = {
  noRepo: name => `repository <${name}> not found.`,
  noState: name => `state <${name}> not found.`,
  initialType: 'The initial must be an object.',
  noListener: 'The subscriber\'s listener must be a function.',
  noValidAction: 'An invalid dependencies was processed.',
  storageNameError: fnName => `biscuit ${fnName} error: storage name is not a string.`,
  noStoreParams: 'The createStore method must contain the storage parameters.',
  noRepoName: 'The repository name is a required field.',
  middleNoFunc: 'Middleware should be provided as a feature.',
  debuggerNoFunc: 'Debugger should be provided as a feature.',
  actionString: 'The state name must be a string.',
  repoNotFind: 'Repository not found.',
  repoExists: 'A repository with this name already exists.'
};
exports.messages = messages;
},{}],"../src/internal/emitter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitter = void 0;

var _debugger = require("./debugger");

var _messages = require("./messages");

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
        throw new _debugger.CreateError(_messages.messages.noListener, taskName);
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
      new _debugger.Log(`subscribe -> store: ${taskName}, state: ${state}`, taskName);
      return {
        /** task params */
        params: task,

        /**
        * Remove listner
        */
        remove: () => {
          new _debugger.Log(`unsubscribe -> store: ${task.name}, state: ${task.state}`, task.name);
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
        throw new _debugger.CreateError(_messages.messages.noListener);
      }

      const tasks = [];

      for (const action of actions) {
        new _debugger.Log(`subscribe -> store: ${action.repo}, state: ${action.state}`, action.repo);

        if (!action.repo) {
          throw new _debugger.CreateError(_messages.messages.noValidAction);
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
            new _debugger.Log(`unsubscribe -> store: ${task.name}, state: ${task.state}`, task.name);
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
      new _debugger.Log(`dispatch -> store: ${action.repo}, state: ${action.state}`, action.repo);

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
},{"./debugger":"../src/internal/debugger.js","./messages":"../src/internal/messages.js"}],"../src/internal/helper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStateRepo = getStateRepo;
exports.getRepository = getRepository;
exports.activeMiddlewares = activeMiddlewares;
exports.gettter = gettter;
exports.compareObject = compareObject;
exports.actionError = void 0;

var _repositories = require("./repositories");

var _debugger = require("./debugger");

var _messages = require("./messages");

function getStateRepo(action) {
  return _repositories.states[`"${action.state}"`][action.repo];
}

function getRepository(name) {
  return _repositories.repositories[name].content;
}

const actionError = action => {
  if (!action || !action.repo || !action.state) {
    throw new _debugger.CreateError('Invalid action parameters.');
  }

  if (!_repositories.repositories[action.repo]) {
    throw new _debugger.CreateError(_messages.messages.noRepo(action.repo));
  }

  if (!_repositories.states[`"${action.state}"`]) {
    throw new _debugger.CreateError(_messages.messages.noState(action.state), action.repo);
  }
};
/**
 * Helper method for running middleware
 * @param {object} context handler context
 * @param {function} fn callback
 * @async
 * @private
 */


exports.actionError = actionError;

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
},{"./repositories":"../src/internal/repositories.js","./debugger":"../src/internal/debugger.js","./messages":"../src/internal/messages.js"}],"../src/internal/dispatch.js":[function(require,module,exports) {
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
},{"./repositories":"../src/internal/repositories.js","./helper":"../src/internal/helper.js","./emitter":"../src/internal/emitter.js"}],"../src/internal/utils.js":[function(require,module,exports) {
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
},{}],"../src/internal/store.js":[function(require,module,exports) {
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

var _messages = require("./messages");

/**
 * BISCUIT STORAGE
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */

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
      resolve({
        data
      });
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
    throw new _debugger.CreateError(_messages.messages.noRepo(name));
  }

  if ((0, _utils.type)(instance) !== 'object') {
    throw new _debugger.CreateError(_messages.messages.initialType);
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
    throw new _debugger.CreateError(_messages.messages.noRepo(name));
  }

  return (0, _helper.gettter)({ ...(0, _helper.getRepository)(name)
  });
}
/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)"
 * method or with an implementation via "manager".
 * @param {import('../types/state').StateAction} action the parameters of the action
 * @return {object} state data
 * @public
 */


function getState(action) {
  (0, _helper.actionError)(action);
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
 * @param {import('../types/state').StateAction} action the parameters of the action
 * @param {object | import('../types/state').DispatchPayload} payload
 * payload data or callback function
 * @return {import('../types/state').Dispatcher}
 * returns methods: before, after, merge
 * @async
 * @public
 */


function dispatch(action, payload = {}) {
  const voids = {};
  (0, _helper.actionError)(action);

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
 * @param {import('../types/state').StateAction} action the parameters of the action
 * @param {import('../types/subscribe').SubscribeListner} fn callback
 * @return {Promise<any>}
 * @async
 * @public
 */


function subscribeToState(action, fn = () => undefined) {
  const that = Promise;

  try {
    (0, _helper.actionError)(action);
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
 * @param {import('../types/state').SubscribeListner} fn callback
 * @callback
 * @async
 * @public
 */


function subscribeToStore(repo, fn = () => undefined) {
  const that = Promise;

  try {
    if (!_repositories.repositories[repo]) {
      throw new _debugger.CreateError(_messages.messages.noRepo(repo));
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
  (0, _helper.actionError)(action);
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
     * @param {import('../types/state').StateAction} targetAction
     * the action that you want to merge
     * @public
     */
    mergeState: targetAction => {
      (0, _helper.actionError)(targetAction);
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
     * @param {import('../types/state').StateAction} targetAction
     * the action that you want to compare
     * @return {bool}
     * @public
     */
    compareStates: targetAction => {
      (0, _helper.actionError)(targetAction);
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
      _repositories.repositories[name] = {
        content: { ...(0, _helper.getRepository)(action.repo)
        }
      };
      _repositories.states[`"${action.state}"`][name] = {
        content: { ...(0, _helper.getStateRepo)(action).content
        }
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
},{"./repositories":"../src/internal/repositories.js","./emitter":"../src/internal/emitter.js","./helper":"../src/internal/helper.js","./dispatch":"../src/internal/dispatch.js","./debugger":"../src/internal/debugger.js","./utils":"../src/internal/utils.js","./messages":"../src/internal/messages.js"}],"../src/internal/creator.js":[function(require,module,exports) {
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

var _debugger = require("./debugger");

var _repositories = require("./repositories");

var _store = require("./store");

var _utils = require("./utils");

var _helper = require("./helper");

var _messages = require("./messages");

/**
 * This method is responsible for creating a new repository.
 * Takes as the first argument a string with the repository name.
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {import('../types/store').Store} initial initial object
 * @public
 */
function newRepo(name, initial = {}) {
  if (!name) {
    throw new _debugger.CreateError(_messages.messages.noRepoName);
  }

  if (_repositories.repositories[name]) {
    throw new _debugger.CreateError(_messages.messages.repoExists);
  }

  if (typeof name !== 'string') {
    throw new _debugger.CreateError(_messages.messages.storageNameError('newRepo'));
  }

  if ((0, _utils.type)(initial) !== 'object') {
    throw new _debugger.CreateError(_messages.messages.initialType, name);
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
 * @param {import('../types/store').Store} params name of the linked storage
 * @return {import('../types/state').ActionCreator} returns the "add" method
 * @public
 */


function createStateTo(params) {
  if (!_repositories.repositories[params.repo]) {
    throw new _debugger.CreateError(_messages.messages.repoNotFind);
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
     * @param {import('../types/state').StateOptions} options state options
     * @return {import('../types/state').StateAction}
    * @public
    */
    bind: (action, options = {
      branch: false,
      initial: {}
    }) => {
      if (typeof action !== 'string') {
        throw new _debugger.CreateError(_messages.messages.actionString, params.repo);
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
        * @param {import('../types/state').DispatchPayload} payload
        * @public
        */
        dispatch: (payload = {}) => (0, _store.dispatch)(actionParams, payload),

        /**
        * Subscribe to state
        * @param {import('../types/subscribe').SubscribeListner} fn callback
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
 * @param {import('../types/state').ActionCreator} createActions
 * createactionsto(storage name) method
 * @param {array[string]} actions actions string array
 * @return {{import('../types/state').StateAction}[]} actions
 * @public
 */


function initialActions(createActions, actions) {
  return actions.map(item => {
    const args = typeof item === 'string' ? [item] : [item.name, item.options];
    return createActions.bind.apply(null, args);
  });
}
/**
 * This helper method converts the actions received via the argument to an array
 * @return {import('../types/state').StateCollection} returns the "compile" method
 * @public
 */


function stateCollection() {
  const collection = {};
  return {
    /**
    * compile state collection
    * @return {import('../types/state').StateCollectionRepo} actions collection
    * @public
    */
    compile: (...actions) => {
      for (let action of actions) {
        (0, _helper.actionError)(action);

        if (!collection[action.repo]) {
          collection[action.repo] = [{ ...action
          }];
          continue;
        }

        collection[action.repo].push({ ...action
        });
      }

      return { ...collection
      };
    },

    /**
     * Get the entire collection actions
     * @return {import('../types/state').StateCollectionRepo} collections instance
     * @public
     */
    all: () => ({ ...collection
    }),

    /**
     * Get a collection by matching the storage name
     * @param {string} repo storage name
     * @return {import('../types/state').StateAction[]} collections instance
     * @public
     */
    fromRepo: repo => [...collection[repo]],

    /**
     * Get the result filtered by state name
     * @param {string} stateName state name
     * @return {import('../types/state').StateAction[]} state list
     * @public
     */
    outOfState: stateName => {
      let out = null;
      Object.keys(collection).forEach(key => {
        out = collection[key].filter(({
          state
        }) => state === stateName);
      });
      return out;
    }
  };
}
/**
 * This helper method can combine multiple collections of actions.
 * Accepts "stateCollection(...action)"
 * @param {import('../types/state').StateCollection} collection array StateCollection
 * @public
 */


function combineStateCollections(...collections) {
  let allState = [];

  for (let collection of collections) {
    Object.keys(collection.all()).forEach(repoName => {
      allState = [...allState, ...collection.fromRepo(repoName)];
    });
  }

  const sc = stateCollection();
  sc.compile.apply(null, allState);
  return sc;
}
/**
 * This method allows you to add middleware for the state handler.
 * @param {import('../types/store').Store} store the store params
 * @return {import('../types/store').MiddlewareParams} returns a set of methods
 * @public
 */


function middleware(store) {
  if (!_repositories.repositories[store.repo]) {
    throw new _debugger.CreateError(_messages.messages.noRepo(store.repo));
  }

  const s = store.repo;
  return {
    /**
    * Adds a handler to the middleware task list.
    * @param {function} fn middle function
    * @public
    */
    add: fn => {
      if (typeof fn !== 'function') {
        throw new _debugger.CreateError(_messages.messages.middleNoFunc, s);
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
 * @param {import('../types/store').Store} store store object
 * @param {import('../types/store').DebuggerListener} fn debugger callback function
 * @public
 */


function createDebuger(store, fn) {
  if (!_repositories.repositories[store.repo]) {
    throw new _debugger.CreateError(_messages.messages.noRepo(store.repo));
  }

  if (typeof fn !== 'function') {
    throw new _debugger.CreateError(_messages.messages.debuggerNoFunc);
  }

  _debugger.debugCollection[store.repo] = fn;
}
/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a repository.
 * @param {import('../types/store').StoreSettings} options
 * an object containing the store settings
 * @return {import('../types/store').StoreParams}
 * returns a set of actions
 * @public
 */


function createStore(options) {
  if (!options) {
    throw new _debugger.CreateError(_messages.messages.noStoreParams);
  }
  /** DefaultParams */


  const params = {
    strictMode: true,
    ...options
  };
  /** Create a new storage */

  const repo = newRepo(params.repo.name, params.repo.initial);
  const createAction = createStateTo(repo);
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
      output.actions[key] = createAction.bind(paramType ? param : param.name, paramType ? {} : {
        initial: param.initial,
        branch: param.branch
      });
    }
  }
  /** Adding middleware to the repository */


  if (params.middleware && params.middleware.length > 0) {
    const middle = middleware(repo);

    for (const fn of params.middleware) {
      middle.add(fn);
    }
  }
  /** Adding debuger to the repository */


  if (params.debugger) {
    createDebuger(repo, params.debugger);
  }
  /** Strict mod */


  _repositories.settings.strictMode[params.repo.name] = params.strictMode;
  return output;
}
},{"./debugger":"../src/internal/debugger.js","./repositories":"../src/internal/repositories.js","./store":"../src/internal/store.js","./utils":"../src/internal/utils.js","./helper":"../src/internal/helper.js","./messages":"../src/internal/messages.js"}],"../src/index.js":[function(require,module,exports) {
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
Object.defineProperty(exports, "createStateTo", {
  enumerable: true,
  get: function () {
    return _creator.createStateTo;
  }
});
Object.defineProperty(exports, "initialActions", {
  enumerable: true,
  get: function () {
    return _creator.initialActions;
  }
});
Object.defineProperty(exports, "stateCollection", {
  enumerable: true,
  get: function () {
    return _creator.stateCollection;
  }
});
Object.defineProperty(exports, "combineStateCollections", {
  enumerable: true,
  get: function () {
    return _creator.combineStateCollections;
  }
});
Object.defineProperty(exports, "middleware", {
  enumerable: true,
  get: function () {
    return _creator.middleware;
  }
});
Object.defineProperty(exports, "createDebuger", {
  enumerable: true,
  get: function () {
    return _creator.createDebuger;
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

var _creator = require("./internal/creator");

var _store = require("./internal/store");
},{"./internal/creator":"../src/internal/creator.js","./internal/store":"../src/internal/store.js"}],"../src/script.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _1 = require("./");

var _a = _1.createStore({
  repo: {
    name: 'user',
    initial: {
      value: 0
    }
  },
  states: {
    testAdd: 'TEST/ADD',
    testRemove: 'TEST/REMOVE',
    testStep: {
      name: 'TEST/STEP',
      branch: true,
      initial: {
        name: 'fill'
      }
    }
  }
}),
    store = _a.store,
    actions = _a.actions;

_1.middleware(store).add(function (context, next) {
  console.log('context', context);
  next();
});

_1.createDebuger(store, function (e) {
  console.log(e);
});

store.subscribe(function (state) {
  console.log(state);
});

_1.subscribeToState(actions.testAdd, function (state) {
  console.log(state);
});

_1.subscribeToStore('user', function (state) {
  console.log(state);
});

actions.testAdd.subscribe(function (state) {
  console.log(state);
});
actions.testAdd.dispatch({
  value: 12
}).after(function (state) {
  console.log(state);
});

_1.dispatch(actions.testAdd, {
  value: 2
}).before(function (state) {
  console.log(state);
});

_1.dispatch(actions.testAdd, function (prev) {
  return {
    value: prev.value += 999
  };
});

console.log(actions.testAdd.getState().value);
console.log(_1.getState(actions.testAdd).value);
console.log(_1.getRepo('user').value);

_1.addRepo('user', {
  id: 2
});

var superAction = _1.createStateTo(store).bind('SUPER/ACTION');

console.log(superAction);

var actionCollection = _1.initialActions(_1.createStateTo(store), [{
  name: 'FIRST/ACTION',
  options: {
    branch: true,
    initial: {
      name: 'fil'
    }
  }
}, 'TWO/ACTION', 'LAST/ACTION']);

console.log(actionCollection);

var collection = _1.stateCollection();

collection.compile(actions.testAdd, actions.testRemove);
console.log(collection.all());
console.log(collection.fromRepo('user'));
console.log(collection.outOfState('TEST/ADD'));

var collection1 = _1.stateCollection();

collection1.compile(actions.testStep);

var combineCollection = _1.combineStateCollections(collection, collection1);

console.log('sss', combineCollection.all());

_1.manager(actions.testStep).merge();

console.log('compare instance', _1.manager(actions.testStep).compareRepoWithInstance({
  value: 0,
  id: 2,
  name: 'fill'
}));
console.log('1111111', _1.getRepo('user'));

_1.addRepo('user', {
  result: 999
});

console.log('not pull', _1.getState(actions.testStep));

_1.manager(actions.testStep).pull();

console.log('pull', _1.getState(actions.testStep)); // manager(actions.testStep).remove();

_1.manager(actions.testStep).clone('cloneuser');

console.log('get clone', _1.getRepo('cloneuser'));
},{"./":"../src/index.js"}],"../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53321" + '/');

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
},{}]},{},["../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/script.ts"], null)
//# sourceMappingURL=/script.82983116.js.map