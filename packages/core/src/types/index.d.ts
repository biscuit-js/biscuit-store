import {
    StoreSettings,
    StoreParams,
    Store,
    MiddlewareParams,
    DebuggerListener,
} from './store';
import {
    StateAction,
    SubscribeListner,
    Dispatcher,
    ActionCreator,
    StateItem,
    StateCollection,
    Manager,
    DispatchPayload,
} from './state';

/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a repository.
 * @param {StoreSettings} options an object containing the store settings
 * @return {StoreParams} returns a set of actions
 */
export function createStore
<T extends StoreSettings, A extends StateAction, I>(options: T): StoreParams<A, I>;

/**
 * This is one of the most important methods.
 * Allows you to subscribe to the state. and tracks its change.
 * The first argument takes the parameters of the action.
 * results can be obtained through the callback of the second
 * argument or through the return promise.
 * @param {StateAction} action the parameters of the action
 * @param {SubscribeListner} fn callback
 * @return {Promise<any>}
 * @async
 */
export function subscribeToState<T>(action: StateAction, fn: SubscribeListner<T>): Promise<T>;

/**
 * This is one of the most important methods.
 * Allows you to subscribe to the store. and tracks its change.
 * The first argument takes the name store.
 * results can be obtained through the callback of the
 * second argument or through the return promise.
 * @param {string} repo repository name
 * @param {SubscribeListner} fn callback
 * @async
 */
export function subscribeToStore<T>(repo: string, fn: SubscribeListner<T>): Promise<T>;

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
 * @param {StateAction} action the parameters of the action
 * @param {object | DispatchPayload} payload payload data or callback function
 * @return {Dispatcher} returns methods: before, after, merge
 * @async
 */
export function dispatch
<A extends StateAction, P extends DispatchPayload>(action: A, payload?: P): Dispatcher;

/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)"
 * method or with an implementation via "manager".
 * @param {StateAction} action the parameters of the action
 * @return {object} state data
 */
export function getState<T>(action: StateAction): T;

/**
 * This method is used to get data from the storage by its key.
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "addRepo"
 * method or with state injection via "manager".
 * @param {string} name storage name
 * @return {object} storage data
 */
export function getRepo<T>(repo: string): T;

/**
 * This method allows you to add new values to the repository.
 * Accepts the storage name and object.
 * @param {string} name repository name
 * @param {object} instance object with added data
 */
export function addRepo<T>(repo: string, instance: T): void;

/**
 * This method is responsible for creating a new repository.
 * Takes as the first argument a string with the repository name.
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {Store} initial initial object
 */
export function newRepo<T>(repo: string, initial: T): Store<T>;

/**
 * This method binds states to the storage via the "add" method.
 * Gets the storage name string as an argument.
 * @param {Store} params name of the linked storage
 * @return {ActionCreator} returns the "add" method
 */
export function createStateTo<T = {}>(params: Store<T>): ActionCreator;

/**
 * This helper method takes the first parameter "createactionsTo"
 * and adds actions to it from the string array of the second argument.
 * @param {ActionCreator} createActions
 * createactionsto(storage name) method
 * @param {array[string]} actions actions string array
 * @return {StateAction[]} actions
 */
export function initialActions(
    createActions: ActionCreator,
    actions: (string | StateItem)[]
): StateAction[];

/**
 * This helper method converts the actions
 * received via the argument to an array
 * @return {StateCollection} returns the "compile" method
 */
export function stateCollection(): StateCollection;

/**
 * This helper method can combine multiple collections of actions.
 * Accepts "stateCollection(...action)"
 * @param {StateCollection[]} collections array StateCollection
 */
export function combineStateCollections(...collections: StateCollection[]): StateCollection;

/**
 * This method allows you to add middleware for the state handler.
 * @param {Store} store the store params
 * @return {MiddlewareParams} returns a set of methods
 * @public
 */
export function middleware<T = {}>(store: Store<T>): MiddlewareParams;

/**
 * This method allows you to add your own debugger.
 * The debugger will accept and output logs instead of the standard debugger.
 * @param {Store} store store object
 * @param {DebuggerListener} fn debugger callback function
 * @public
 */
export function createDebuger<T = {}>(store: Store<T>, fn: DebuggerListener): void;

/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a repository.
 * @param {StoreSettings} options
 * an object containing the store settings
 * @return {StoreParams}
 * returns a set of actions
 * @public
 */
export function manager(action: StateAction): Manager;