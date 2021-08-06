function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

/** storage instance */
var repositories = {};
/** states instance */

var states = {};
/** middlewares list */

var middlewares = {};
/** store settings */

var settings = {
  strictMode: {}
};

/** debug messages */
var messages = {
  noStore: function noStore(name) {
    return "store <" + name + "> not found.";
  },
  noState: function noState(name) {
    return "state <" + name + "> not found.";
  },
  initialType: 'The initial must be an object.',
  noListener: 'The subscriber\'s listener must be a function.',
  noValidAction: 'An invalid dependencies was processed.',
  storageNameError: function storageNameError(fnName) {
    return "biscuit " + fnName + " error: storage name is not a string.";
  },
  noStoreParams: 'The createStore method must contain the storage parameters.',
  noStoreName: 'The store name is a required field.',
  middleNoFunc: 'Middleware should be provided as a feature.',
  debuggerNoFunc: 'Debugger should be provided as a feature.',
  actionString: 'The state name must be a string.',
  storeNotFind: 'store not found.',
  storeExists: 'A store with this name already exists.'
};

/** debuger list */

var debugCollection = {};
/**
 * Write log object
 * @param {string} message message
 * @param {string} storeName store name
 */

var writeLog = function writeLog(type, message, storeName) {
  if (Object.keys(debugCollection).length > 0) {
    var line = this.stack.split('\n')[1].split(':')[2];
    createLog({
      message: this.name + ': ' + message,
      file: line,
      level: storeName ? 'local' : 'global',
      store: storeName,
      type: type
    }, storeName);
  }
};
/**
 * This method processes the storage logs
 * and outputs them to the debugger if necessary.
 * @param {any} data is error -> new Error, is warn -> string
 * @param {string} storeoName store name
 * @public
 */


var createLog = function createLog(data, storeName) {
  for (var key in debugCollection) {
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

var Log = /*#__PURE__*/function (_Error) {
  _inheritsLoose(Log, _Error);

  function Log(message, storeName) {
    var _this;

    _this = _Error.call(this, message) || this;
    _this.name = 'Biscuit log';
    writeLog.call(_assertThisInitialized(_this), 'log', message, storeName);
    return _this;
  }

  return Log;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Create warning log
 * @param {string} message message
 * @param {string} storeName store name
 * @public
 */

var Warning = /*#__PURE__*/function (_Error2) {
  _inheritsLoose(Warning, _Error2);

  function Warning(message, storeName) {
    var _this2;

    _this2 = _Error2.call(this, message) || this;

    if (settings.strictMode[storeName]) {
      // eslint-disable-next-line no-console
      console.warn(message);
    }

    _this2.name = 'Biscuit warn';
    writeLog.call(_assertThisInitialized(_this2), 'warning', message, storeName);
    return _this2;
  }

  return Warning;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Create error log
 * @param {string} message message
 * @param {string} storeName store name
 * @public
 */

var CreateError = /*#__PURE__*/function (_Error3) {
  _inheritsLoose(CreateError, _Error3);

  function CreateError(message, storeName) {
    var _this3;

    _this3 = _Error3.call(this, message) || this;
    _this3.name = 'Biscuit error';
    writeLog.call(_assertThisInitialized(_this3), 'error', message, storeName);
    return _this3;
  }

  return CreateError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * This method allows you to add your own debugger.
 * The debugger will accept and output logs instead of the standard debugger.
 * @param {import('../../types/store').Store} store store object
 * @param {import('../../types/store').DebuggerListener} fn
 * debugger callback function
 * @public
 */

function createDebuger(store, fn) {
  if (!repositories[store.name]) {
    throw new CreateError(messages.noStore(store.name));
  }

  if (typeof fn !== 'function') {
    throw new CreateError(messages.debuggerNoFunc);
  }

  debugCollection[store.name] = fn;
}

function _createForOfIteratorHelperLoose$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * Module of the library responsible for creating tasks and subscribing to them.
 * @param  {string} action action name
 * @return {object} methods
 * @public
 */

function createEmitter() {
  var taskBuffer = {};
  return {
    /**
     * This method allows you to subscribe to an action.
     * Creates a task that puts its own callback function,
     * which should then be started by the dispatcher
     * @param {string} stateName name of the state to subscribe to
     * @param {function} listener callback function
     * @param {string} state store state
     * @return {object{params: object, remove: function}} returned task id
     */
    subscribeAction: function subscribeAction(_ref, listener) {
      var name = _ref.name,
          type = _ref.type;

      if (typeof listener !== 'function') {
        throw new CreateError(messages.noListener, name);
      }

      if (!taskBuffer[name]) {
        taskBuffer[name] = [];
      }
      /** create task */


      taskBuffer[name].push({
        listener: listener,
        type: type
      });
      /** create index */

      var index = taskBuffer[name].length;
      new Log("subscribe -> " + name, name);
      return {
        /** Remove listner */
        remove: function remove() {
          taskBuffer[name] = taskBuffer[name].slice(index, 1);
          new Log("unsubscribe -> " + name);
        }
      };
    },

    /**
     * This method allows you to subscribe to multiple actions.
     * Creates multiple tasks that run a single callback function.
     * @param {actions[object{name: string, type: string}]} actions
     * array actions
     * @param {function} listener callback
     * @return {}
     */
    subscribeActions: function subscribeActions(actions, listener) {
      if (typeof listener !== 'function') {
        throw new CreateError(messages.noListener);
      }

      var tasks = [];

      for (var _iterator = _createForOfIteratorHelperLoose$2(actions), _step; !(_step = _iterator()).done;) {
        var _step$value = _step.value,
            name = _step$value.name,
            type = _step$value.type;

        if (!name) {
          throw new CreateError(messages.noValidAction);
        }

        if (!taskBuffer[name]) {
          taskBuffer[name] = [];
        }
        /** write task to buffer */


        taskBuffer[name].push({
          listener: listener,
          type: type
        });
        /** write tasks to an array, for subsequent
         *  deletion via the remove method */

        tasks.push({
          name: name,
          index: taskBuffer[name].length
        });
        new Log("subscribe -> " + name, name);
      }

      return {
        /** Remove listners */
        remove: function remove() {
          for (var _iterator2 = _createForOfIteratorHelperLoose$2(tasks), _step2; !(_step2 = _iterator2()).done;) {
            var _step2$value = _step2.value,
                name = _step2$value.name,
                index = _step2$value.index;
            taskBuffer[name] = taskBuffer[name].slice(index, 1);
            new Log("unsubscribe -> " + name, name);
          }
        }
      };
    },

    /**
     * Starts all tasks that match the specified state name
     * and passes data to their callback functions.
     * @param {object{name: string, type: string}} action action params
     * @async
     * @public
     */
    dispatchAction: function dispatchAction(_ref2) {
      var name = _ref2.name,
          type = _ref2.type;
      new Log("dispatch -> name: " + name + ", type: " + type, name);

      if (taskBuffer[name]) {
        for (var _iterator3 = _createForOfIteratorHelperLoose$2(taskBuffer[name]), _step3; !(_step3 = _iterator3()).done;) {
          var task = _step3.value;

          if (task.type === type) {
            task.listener({
              name: name,
              type: task.type
            });
            continue;
          }

          if (task.type === undefined) {
            task.listener({
              name: name,
              type: undefined
            });
          }
        }

        return;
      }

      new Warning("store \"" + name + "\" has no active subscriptions.", name);
    }
  };
}

var emitter = createEmitter();

/**
 * Creates a throttled function that only invokes func
 * at most once per every wait milliseconds.
 * @param {function} callback target function
 * @param {number} limit counter
 * @return {function}
 */
function throttle(callback, limit) {
  var waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
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

function debounce(callback, limit, immediate) {
  var timeout;

  function debounced() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var that = this;

    var later = function later() {
      callback.apply(that, args);
    };

    clearTimeout(timeout);

    if (immediate) {
      later();
    }
    timeout = setTimeout(later, limit);
  }

  debounced.clear = function () {
    clearTimeout(timeout);
  };

  return debounced;
}
/**
 * This method set allows you to. save the state of functions
 * tied to the timer. Required for the case when the timer
 * function is initialized in a method with a frequent call,
 * for example, in the react function component.
 * @param {function} fn target function
*/

var sandbox = function sandbox(fn) {
  return {
    run: function () {
      var than = null;
      /** initial run
                * @param {function} call target function
                * @param {number} timer timeout
               */

      var initial = function initial(call, timer, immediate) {
        if (immediate === void 0) {
          immediate = undefined;
        }

        if (!than) {
          than = fn(call, timer, immediate);
        }
      };
      /** initial run
                * @param {args[any]} args arguments
                * @return {function}
                */


      var caller = function caller() {
        return than.apply(void 0, arguments);
      };
      /** initial
               * @param {function} call target function
               * @param {number} timer timeout
               * @return {function} throttleCaller
               */


      return function (call, timer, immediate) {
        initial(call, timer, immediate);
        return caller;
      };
    }()
  };
};
/**
 * Strict type checking
 * @param {*} value any value
 */

function typeOf(value) {
  var regex = /^\[object (\S+?)]$/;
  var matches = Object.prototype.toString.call(value).match(regex) || [];
  return (matches[1] || 'undefined').toLowerCase();
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime_1 = createCommonjsModule(function (module) {
  var runtime = function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.

    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }

    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function () {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function (record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports );

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
});

var regenerator = runtime_1;

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Get store link
 * @param {string} name
 */

function getStateLink(action) {
  return states["\"" + action.type + "\""][action.name];
}
/**
 * Get store content
 * @param {string} name
 */

function getStoreContent(name) {
  return repositories[name].content;
}
/**
 * Get store actions
 * @param {string} name
 */

function getStoreContentActions(name) {
  return repositories[name].actions;
}
/**
 * To obtain the name of the store depending on the type of
 * @param {object | string} target
 */

function getStoreName(target) {
  if (typeof target === 'string') {
    return target;
  }

  return target.name;
}
/**
 * Сhecking the existence of a repository by name
 * @param {string} name
 */

function checkStoreName(name) {
  if (repositories[name]) {
    throw new CreateError("\u041Core than one store uses the name <" + name + ">.", name);
  }
}
/**
 * Validating an action
 * @param {import('../../types/state').AnyAction} action
 */

var actionError = function actionError(action) {
  if (!action || !action.name || !action.type) {
    throw new CreateError('Invalid action parameters.');
  }

  if (!repositories[action.name]) {
    throw new CreateError(messages.noStore(action.name));
  }

  if (!states["\"" + action.type + "\""]) {
    throw new CreateError(messages.noState(action.type), action.name);
  }
};
/**
 * Helper method for running middleware
 * @param {object} context handler context
 * @param {function} fn callback
 * @async
 * @private
 */

function activeMiddlewares(context, fn) {
  return regenerator.async(function activeMiddlewares$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (fn === void 0) {
            fn = function fn() {
              return null;
            };
          }

          if (!middlewares[context.store]) {
            _context.next = 6;
            break;
          }

          _context.next = 4;
          return regenerator.awrap(middlewares[context.store].forEach(function (middle) {
            middle(context, fn);
          }));

        case 4:
          _context.next = 7;
          break;

        case 6:
          fn(context.payload);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, null, Promise);
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
  return Object.freeze(_objectSpread$7({}, instance));
}
/**
 * Helper method for comparing two objects
 * Warning: can't compare methods
 * @param {object} first first object
 * @param {object} last last object
 * @return {bool}
 * @private
 */

function compareObject(first, last) {
  if (first === last) {
    return true;
  }

  if (first === null || typeof first !== 'object' || last === null || typeof last !== 'object') {
    return false;
  }

  if (Object.keys(first).length !== Object.keys(last).length) {
    return false;
  }

  var equal = true;

  for (var key in first) {
    if (typeof first[key] === 'object' && typeof last[key] === 'object') {
      if (!compareObject(first[key], last[key])) {
        equal = false;
      }
    } else if (typeof first[key] === 'function' && typeof last[key] === 'function') {
      if (first.toString() !== last.toString()) {
        equal = false;
      }
    } else if (first[key] !== last[key]) {
      equal = false;
    }
  }

  return equal;
}

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function dispatchProto(_ref) {
  var _this = this;

  var action = _ref.action,
      prev = _ref.prev,
      payData = _ref.payData;

  /**
   * Call before state change
   * @param {function} fn callback
   * @public
   */
  this.before = function (fn) {
    fn(prev);
    return _this;
  };
  /**
   * Merge state into store
   * @public
   */


  this.merge = function () {
    repositories[action.name].content = _objectSpread$6(_objectSpread$6({}, prev), payData);
    return _this;
  };
  /**
   * Call after state change
   * @param {function} fn callback
   * @async
   * @public
   */


  this.after = function _callee(fn) {
    var task, call;
    return regenerator.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            call = function call(resolve) {
              resolve(_objectSpread$6({}, getStateLink(action).content));
              task.remove();
            };

            _context.next = 3;
            return regenerator.awrap(new Promise(function (resolve) {
              task = emitter.subscribeAction(action, function () {
                return call(resolve);
              });
            }).then(fn));

          case 3:
            return _context.abrupt("return", _this);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, null, Promise);
  };
}
function dispatchInitMiddleware(_ref2) {
  var action, payData, prev, actions;
  return regenerator.async(function dispatchInitMiddleware$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          action = _ref2.action, payData = _ref2.payData, prev = _ref2.prev;
          actions = getStoreContentActions(action.name);
          _context2.next = 4;
          return regenerator.awrap(new Promise(function (resolve) {
            activeMiddlewares({
              action: action.type,
              store: action.name,
              payload: payData,
              state: prev,
              getAction: function getAction(actionName) {
                return actions["\"" + actionName + "\""];
              }
            }, function (newPayload) {
              resolve(newPayload || payData);
            });
          }));

        case 4:
          return _context2.abrupt("return", _context2.sent);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, null, Promise);
}

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Allows you to subscribe to the store. and tracks its change.
 * @param {string} name store name
 * @param {function} fn callback
 * @param {string} type state name
 * @return {Promise}
 * @async
 */

var subscriber = function subscriber(params, fn) {
  var task;
  var name = params.name,
      type = params.type;
  var promise = new Promise(function (resolve) {
    task = emitter.subscribeAction({
      name: name,
      type: type
    }, function () {
      /** if there is a state then pick it up */
      var data = type ? getState({
        name: name,
        type: type
      }) : getStore(name);
      fn(data, task);
      resolve({
        data: data
      });
    });
  });
  var resolve = this.resolve(promise);
  resolve['unsubscribe'] = task.remove;
  return resolve;
};
/**
 * This method allows you to add new values to the store.
 * Accepts the storage name and object.
 * @param {string | import('../../../types').Store} target
 * store name or store
 * @param {object} instance object with added data
 * @public
 */


function addStore(target, instance) {
  var name = getStoreName(target);

  if (!repositories[name]) {
    throw new CreateError(messages.noStore(name));
  }

  if (typeOf(instance) !== 'object') {
    throw new CreateError(messages.initialType);
  }

  repositories[name].content = _objectSpread$5(_objectSpread$5({}, getStoreContent(name)), instance);
}
/**
 * This method is used to get data from the storage by its key.
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "addStore"
 * method or with state injection via "manager".
 * @param {string | import('../../../types').Store} target
 * store name or store
 * @return {object} storage data
 * @public
 */

function getStore(target) {
  var name = getStoreName(target);

  if (!repositories[name]) {
    throw new CreateError(messages.noStore(name));
  }

  return gettter(_objectSpread$5({}, getStoreContent(name)));
}
/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)"
 * method or with an implementation via "manager".
 * @param {import('../../types/state').AnyAction} action
 * the parameters of the action
 * @return {object} state data
 * @public
 */

function getState(action) {
  actionError(action);
  return gettter(_objectSpread$5({}, getStateLink(action).content));
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
 * @param {import('../../types/state').AnyAction} action
 * the parameters of the action
 * @param {object | import('../../types/state').DispatchPayload} payload
 * payload data or callback function
 * @return {import('../../types/state').Dispatcher}
 * returns methods: before, after, merge
 * @async
 * @public
 */

function dispatch(action, payload) {
  if (payload === void 0) {
    payload = {};
  }

  var voids = {};
  actionError(action);

  if (typeOf(payload) !== 'function' && typeOf(payload) !== 'object') {
    throw new CreateError('The payload must be an object or function.', action.name);
  }

  function promise() {
    var state, prev, payData;
    return regenerator.async(function promise$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            state = getStateLink(action);
            prev = _objectSpread$5({}, state.content);
            /** if the function
             * then pass the current state to the callback  */

            payData = typeof payload === 'function' ? payload(prev) : payload;
            dispatchProto.call(voids, {
              action: action,
              prev: prev,
              payData: payData
            });
            /** initial middlewares */

            _context.next = 6;
            return regenerator.awrap(dispatchInitMiddleware({
              action: action,
              payData: payData,
              prev: prev
            }));

          case 6:
            payData = _context.sent;

            /** update state data */
            getStateLink(action).content = _objectSpread$5(_objectSpread$5({}, state.content), payData);
            /** create dispatch action */

            emitter.dispatchAction(action);
            return _context.abrupt("return", true);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, null, Promise);
  }

  var task = promise();
  return _objectSpread$5({
    wait: task
  }, voids);
}
/**
 * This is one of the most important methods.
 * Allows you to subscribe to the state. and tracks its change.
 * The first argument takes the parameters of the action.
 * results can be obtained through the callback of the second
 * argument or through the return promise.
 * @param {import('../../types/state').AnyAction} action
 * the parameters of the action
 * @param {import('../../types/subscribe').SubscribeListner} fn callback
 * @return {Promise<any>}
 * @async
 * @public
 */

function subscribeToState(action, fn) {
  if (fn === void 0) {
    fn = function fn() {
      return undefined;
    };
  }

  var that = Promise;

  try {
    actionError(action);
    return subscriber.call(that, action, fn);
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
 * @param {string | import('../../../types').Store} target store name or store
 * @param {import('../../types/state').SubscribeListner} fn callback
 * @callback
 * @async
 * @public
 */

function subscribeToStore(target, fn) {
  if (fn === void 0) {
    fn = function fn() {
      return undefined;
    };
  }

  var storeName = getStoreName(target);
  var that = Promise;

  try {
    if (!repositories[storeName]) {
      throw new CreateError(messages.noStore(storeName));
    }

    return subscriber.call(that, {
      name: storeName,
      type: undefined
    }, fn);
  } catch (e) {
    return that.reject(e);
  }
}

/**
 * The method makes an asynchronous call
 * and pours the result into the storage.
 * @param {import('../../types/store').Store} store
 * the parameters of the action
 * @param {function} fn callback
 * @async
 * @public
 */

function callFromStore(store, fn) {
  var result;
  return regenerator.async(function callFromStore$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regenerator.awrap(fn(getStore(store)));

        case 2:
          result = _context.sent;

          if (!(typeOf(result) !== 'object')) {
            _context.next = 5;
            break;
          }

          throw new CreateError('The result of the call must return an object.');

        case 5:
          addStore(store, result);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, null, Promise);
}

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var box = null;
/**
 * Allows you to store actions in an isolated container
 * and retrieve them if necessary. It can be useful
 * for eliminating cyclic dependencies.
 */

var container = {
  /**
   * The method allows you to put actions in a container
   * @param {object} actions actions object
   */
  include: function include(actions) {
    for (var key in actions) {
      var _objectSpread2;

      actionError(actions[key]);
      box = _objectSpread$4(_objectSpread$4({}, box), {}, (_objectSpread2 = {}, _objectSpread2[actions[key].name] = actions, _objectSpread2));
    }
  },

  /**
   * The method allows you to put actions in a container
   * @param {string} storeName store name
   * @return {object} actions
   */
  extract: function extract(storeName) {
    return box[storeName];
  }
};

/**
 * This method allows you to add combined state
 * containers to the createStore structure
 * @param {import('../../types/store').CombineProto} proto actions object
 * @return {import('../../types/store').CombineActions}
 *  a set of parameters containing the actions and middleware fields
*/
function combineActions(proto) {
  var actions = {};
  var middle = {};

  for (var key in proto) {
    actions[key] = key + "/action";
    middle[actions[key]] = proto[key];
  }

  return {
    actions: actions,
    middleware: [function _callee(_ref, next) {
      var action, state, payload, res;
      return regenerator.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              action = _ref.action, state = _ref.state, payload = _ref.payload;

              if (middle[action]) {
                _context.next = 4;
                break;
              }

              next(payload);
              return _context.abrupt("return");

            case 4:
              _context.next = 6;
              return regenerator.awrap(middle[action](state, payload));

            case 6:
              res = _context.sent;

              if (!res) {
                _context.next = 10;
                break;
              }

              next(res);
              return _context.abrupt("return");

            case 10:
              next(state);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, null, Promise);
    }]
  };
}

/**
 * This method allows you to add middleware for the state handler.
 * @param {import('../../types/store').Store} store the store params
 * @return {import('../../types/store').MiddlewareParams}
 * returns a set of methods
 * @public
 */

function middleware(store) {
  if (!repositories[store.name]) {
    throw new CreateError(messages.noStore(store.name));
  }

  var s = store.name;
  return {
    /**
     * Adds a handler to the middleware task list.
     * @param {function} fn middle function
     * @public
     */
    add: function add(fn) {
      if (typeof fn !== 'function') {
        throw new CreateError(messages.middleNoFunc, s);
      }

      if (middlewares[s]) {
        middlewares[s].push(fn);
      } else {
        middlewares[s] = [fn];
      }
    }
  };
}

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * This method binds states to the storage via the "add" method.
 * Gets the storage name string as an argument.
 * @param {import('../../types/store').Store} params name of the linked storage
 * @return {import('../../types/state').ActionCreator} returns the "add" method
 * @public
 */

function createActionTo(params) {
  if (!repositories[params.name]) {
    throw new CreateError(messages.storeNotFind);
  }

  var createNewState = function createNewState(stns) {
    if (!stns.branch) {
      return repositories[params.name];
    }

    return {
      content: _objectSpread$3(_objectSpread$3({}, repositories[params.name].content), stns.initial)
    };
  };

  return {
    /** This method binds the state to the selected storagee
     * @param {string} action state name
     * @param {import('../../types/state').StateOptions} options
     * state options
     * @return {import('../../types/state').StateAction}
     * @public
     */
    bind: function bind(action, options) {
      var _objectSpread2;

      if (options === void 0) {
        options = {
          branch: false,
          initial: {}
        };
      }

      if (typeof action !== 'string') {
        throw new CreateError(messages.actionString, params.name);
      }

      var actionStr = "\"" + action + "\"";
      states[actionStr] = _objectSpread$3(_objectSpread$3({}, states[actionStr]), {}, (_objectSpread2 = {}, _objectSpread2[params.name] = createNewState(options), _objectSpread2));
      var actionParams = {
        name: params.name,
        type: action
      };

      var returnedParams = _objectSpread$3(_objectSpread$3({}, actionParams), {}, {
        /**
         * Update state
         * @param {import('../../types/state').DispatchPayload} payload
         * @public
         */
        dispatch: function dispatch$1(payload) {
          if (payload === void 0) {
            payload = {};
          }

          return dispatch(actionParams, payload);
        },

        /**
         * Subscribe to state
         * @param {import('../../types/subscribe').SubscribeListner} fn
         * callback
         * @public
         */
        subscribe: function subscribe(fn) {
          return subscribeToState(actionParams, fn);
        },

        /**
         * Get state
         * @public
         */
        getState: function getState$1() {
          return getState(actionParams);
        }
      });

      repositories[params.name].actions["\"" + action + "\""] = returnedParams;
      return returnedParams;
    },

    /** store name */
    name: params.name
  };
}

/**
 * This method is responsible for creating a new store.
 * Takes as the first argument a string with the store name.
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {import('../../types/store').Store} initial initial object
 * @public
 */

function newStore(name, initial) {
  if (initial === void 0) {
    initial = {};
  }

  if (!name) {
    throw new CreateError(messages.noStoreName);
  }

  if (typeof name !== 'string') {
    throw new CreateError(messages.storageNameError('newStore'));
  }

  if (typeOf(initial) !== 'object') {
    throw new CreateError(messages.initialType, name);
  }

  if (settings.strictMode[name]) {
    checkStoreName(name);
  }

  repositories[name] = {
    content: initial,
    actions: {}
  };
  return {
    name: name,

    /** Subscribe by change @param {function} fn */
    subscribe: function subscribe(fn) {
      return subscribeToStore(name, fn);
    },

    /** get reposiory */
    get: function get() {
      return getStore(name);
    },

    /** add to reposiory @param {object} instance */
    add: function add(instance) {
      return addStore(name, instance);
    }
  };
}

function _createForOfIteratorHelperLoose$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a store.
 * @param {import('../../types/store').StoreSettings} options
 * an object containing the store settings
 * @return {import('../../types/store').StoreParams}
 * returns a set of actions
 * @public
 */

function createStore(options) {
  if (!options) {
    throw new CreateError(messages.noStoreParams);
  }
  /** DefaultParams */


  var params = _objectSpread$2({
    strictMode: false
  }, options);
  /** Create a new storage */


  var store = newStore(params.name, params.initial);
  var createAction = createActionTo(store);
  /** Set of storage parameters */

  var output = {
    store: _objectSpread$2({}, store),
    actions: {}
  };
  /** Combine actions */

  if (params.combineActions) {
    var data = combineActions(params.combineActions);
    params.actions = _objectSpread$2(_objectSpread$2({}, params.actions), data.actions);
    middleware(store).add(data.middleware[0]);
  }
  /** Adding States to the store */


  if (params.actions) {
    for (var key in params.actions) {
      var param = params.actions[key];
      var paramType = typeof param === 'string';
      output.actions[key] = createAction.bind(paramType ? param : param.name, paramType ? {} : {
        initial: param.initial,
        branch: param.branch
      });
    }
  }
  /** Adding middleware to the store */


  if (params.middleware && params.middleware.length > 0) {
    var middle = middleware(store);

    for (var _iterator = _createForOfIteratorHelperLoose$1(params.middleware), _step; !(_step = _iterator()).done;) {
      var fn = _step.value;
      middle.add(fn);
    }
  }
  /** Adding debuger to the store */


  if (params.debugger) {
    createDebuger(store, params.debugger);
  }
  /**
   * Runs a method that writes the object
   * to the store during initialization
   */


  if (params.initialCall) {
    callFromStore(store, params.initialCall);
  }
  /** Add to container */


  if (params.addToContainer) {
    container.include(output.actions);
  }
  /** Strict mod */


  settings.strictMode[params.name] = params.strictMode;
  return output;
}

/**
 * This helper method takes the first parameter "createactionsTo"
 * and adds actions to it from the string array of the second argument.
 * @param {import('../../types/state').ActionCreator} createActions
 * createactionsto(storage name) method
 * @param {array[string]} actions actions string array
 * @return {{import('../types/state').StateAction}[]} actions
 * @public
 */
function initialActions(createActions, actions) {
  return actions.map(function (item) {
    var args = typeof item === 'string' ? [item] : [item.name, item.options];
    return createActions.bind.apply(null, args);
  });
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * This helper method converts the actions received via the argument to an array
 * @return {import('../../types/state').StateCollection}
 * returns the "compile" method
 * @public
 */

function stateCollection() {
  var collection = {};
  return {
    /**
     * compile state collection
     * @return {import('../../types/state').StateCollectionRepo}
     * actions collection
     * @public
     */
    compile: function compile() {
      for (var _len = arguments.length, actions = new Array(_len), _key = 0; _key < _len; _key++) {
        actions[_key] = arguments[_key];
      }

      for (var _i = 0, _actions = actions; _i < _actions.length; _i++) {
        var action = _actions[_i];
        actionError(action);

        if (!collection[action.name]) {
          collection[action.name] = [_objectSpread$1({}, action)];
          continue;
        }

        collection[action.name].push(_objectSpread$1({}, action));
      }

      return _objectSpread$1({}, collection);
    },

    /**
     * Get the entire collection actions
     * @return {import('../../types/state').StateCollectionRepo}
     * collections instance
     * @public
     */
    all: function all() {
      return _objectSpread$1({}, collection);
    },

    /**
     * Get a collection by matching the storage name
     * @param {string} name storage name
     * @return {import('../../types/state').StateAction[]}
     * collections instance
     * @public
     */
    fromStore: function fromStore(name) {
      return [].concat(collection[name]);
    },

    /**
     * Get the result filtered by state name
     * @param {string} stateName state name
     * @return {import('../../types/state').StateAction[]} state list
     * @public
     */
    outOfState: function outOfState(actionName) {
      var out = [];

      for (var key in collection) {
        out = [].concat(out, collection[key].filter(function (_ref) {
          var type = _ref.type;
          return type === actionName;
        }));
      }

      return out;
    }
  };
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Simultaneous launch of several dispatchers
 * @param { import("../../../types/types").StateAction[] } actions state actions
 * @return {(...payload: {[prop: string]: any}) => void}
 * method that accepts the payload
*/
function pipeline() {
  for (var _len = arguments.length, actions = new Array(_len), _key = 0; _key < _len; _key++) {
    actions[_key] = arguments[_key];
  }

  return function _callee() {
    var i,
        _len2,
        payload,
        _key2,
        _iterator,
        _step,
        action,
        p,
        _args = arguments;

    return regenerator.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            i = 0;

            for (_len2 = _args.length, payload = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              payload[_key2] = _args[_key2];
            }

            _iterator = _createForOfIteratorHelperLoose(actions);

          case 3:
            if ((_step = _iterator()).done) {
              _context.next = 12;
              break;
            }

            action = _step.value;
            p = !payload[i] ? {} : payload[i];

            if (!('dispatch' in action)) {
              _context.next = 10;
              break;
            }

            _context.next = 9;
            return regenerator.awrap(action.dispatch(p));

          case 9:
            i += 1;

          case 10:
            _context.next = 3;
            break;

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, null, Promise);
  };
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * The State Manager allows you to manage the storage and its state.
 * Provides a set of methods for two-way merge, replace, copy,
 * and other actions between the selected storage and state.
 * @param {import('../../types/state').AnyAction} action
 * the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */

function createManager(action) {
  actionError(action);
  return {
    /**
     * This method will combine data
     * from the state with data from the storage.
     * @public
     */
    merge: function merge() {
      repositories[action.name].content = _objectSpread(_objectSpread({}, getStoreContent(action.name)), getStateLink(action).content);
    },

    /**
     * This method will merge data
     * from the storage with data from the state.
     * @public
     */
    pull: function pull() {
      getStateLink(action).content = _objectSpread(_objectSpread({}, getStateLink(action).content), getStoreContent(action.name));
    },

    /**
     * This method will replace the data from the storage with state data.
     * @public
     */
    replaceStore: function replaceStore() {
      repositories[action.name].content = _objectSpread({}, getStateLink(action).content);
    },

    /**
     * This method will replace the data
     * from the state with the storage data.
     * @public
     */
    replaceState: function replaceState() {
      getStateLink(action).content = _objectSpread({}, getStoreContent(action.name));
    },

    /**
     * This method will merge the data of the selected state
     * with the data of the state specified in the arguments.
     * @param {import('../../types/state').AnyAction} targetAction
     * the action that you want to merge
     * @public
     */
    mergeState: function mergeState(targetAction) {
      actionError(targetAction);
      getStateLink(action).content = _objectSpread(_objectSpread({}, getStateLink({
        type: targetAction.type,
        name: action.name
      }).content), getStateLink(action).content);
    },

    /**
     * This method compares two states
     * WARNING: states should not contain methods
     * @param {import('../../types/state').AnyAction} targetAction
     * the action that you want to compare
     * @return {bool}
     * @public
     */
    compareStates: function compareStates(targetAction) {
      actionError(targetAction);
      return compareObject(getStateLink(action).content, getStateLink(targetAction).content);
    },

    /**
     * Сompare state and store
     * WARNING: states should not contain methods
     * @return {bool}
     * @public
     */
    compareWithState: function compareWithState() {
      return compareObject(getStoreContent(action.name), getStateLink(action).content);
    },

    /**
     * compare state and instance object
     * WARNING: states should not contain methods
     * @param {object} instance object instance
     * @return {bool}
     * @public
     */
    compareStateWithInstance: function compareStateWithInstance(instance) {
      return compareObject(getStateLink(action).content, instance);
    },

    /**
     * \
     * WARNING: states should not contain methods
     * @param {object} instance object instance
     * @return {bool}
     * @public
     */
    compareStoreWithInstance: function compareStoreWithInstance(instance) {
      return compareObject(getStoreContent(action.name), instance);
    },

    /**
     * Updates the status of the store.
     * This method is equivalent to dispatch(...)
     * @public
     */
    update: function update() {
      dispatch(action, {});
    },

    /**
     * Returns parameters of the selected action
     * @public
     */
    props: action
  };
}

var utils = {
  createLog: createLog,
  CreateError: CreateError,
  Warning: Warning,
  emitter: emitter,
  throttle: throttle,
  debounce: debounce,
  sandbox: sandbox
};

export { addStore, callFromStore, combineActions, container, createActionTo, createDebuger, createManager, createStore, dispatch, getState, getStore, initialActions, middleware, newStore, pipeline, stateCollection, subscribeToState, subscribeToStore, utils };
