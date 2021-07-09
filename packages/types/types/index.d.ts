import {
	StoreSettings,
	StoreParams,
	Store,
	MiddlewareParams,
	DebuggerListener,
	Context,
	Container,
	CombineProto,
	CombineActions,
} from './store';
import {
	StateAction,
	SubscribeListner,
	Dispatcher,
	ActionCreator,
	StateItem,
	StateCollection,
	Manager,
	Dispatch,
	DispatchPayload,
	StaticAction,
	AnyAction,
} from './state';

/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a store.
 * @param options an object containing the store settings
 * @return returns a set of actions
 */
export function createStore<T = {[key: string]: any}>
(options: StoreSettings<T>): StoreParams<T>;


/**
 * This is one of the most important methods.
 * Allows you to subscribe to the state. and tracks its change.
 * The first argument takes the parameters of the action.
 * results can be obtained through the callback of the second
 * argument or through the return promise.
 * @param action the parameters of the action
 * @param fn callback
 * @return promise
 * @async
 */
export function subscribeToState<T>
(action: AnyAction, fn?: SubscribeListner<T>): Promise<T>;

/**
 * This is one of the most important methods.
 * Allows you to subscribe to the store. and tracks its change.
 * The first argument takes the name store.
 * results can be obtained through the callback of the
 * second argument or through the return promise.
 * @param repo store name
 * @param fn callback
 * @async
 */
export function subscribeToStore<T>
(target: string | Store, fn?: SubscribeListner<T>): Promise<T>;

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
 * @param action the parameters of the action
 * @param payload payload data or callback function
 * @return returns methods: before, after, merge
 * @async
 */
export function dispatch
<P extends DispatchPayload>(action: AnyAction, payload?: P): Dispatcher;

/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)"
 * method or with an implementation via "manager".
 * @param action the parameters of the action
 * @return state data
 */
export function getState<T>(action: AnyAction): T;

/**
 * This method is used to get data from the storage by its key.
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "addStore"
 * method or with state injection via "manager".
 * @param target store name or store
 * @return storage data
 */
export function getStore<T>(target: string | Store): T;

/**
 * This method allows you to add new values to the store.
 * Accepts the storage name and object.
 * @param target store name or store
 * @param instance object with added data
 */
export function addStore<T>(target: string | Store, instance: T): void;

/**
 * This method is responsible for creating a new store.
 * Takes as the first argument a string with the store name.
 * and the initial state of the storage as the second argument
 * @param name storage name
 * @param initial initial object
 */
export function newStore<T>(repo: string, initial: T): Store<T>;

/**
 * This method binds states to the storage via the "add" method.
 * Gets the storage name string as an argument.
 * @param params name of the linked storage
 * @return returns the "add" method
 */
export function createActionTo<T = {}>(params: Store<T>): ActionCreator;

/**
 * This helper method takes the first parameter "createactionsTo"
 * and adds actions to it from the string array of the second argument.
 * @param createActions
 * createactionsto(storage name) method
 * @param actions actions string array
 * @return actions
 */
export function initialActions(
	createActions: ActionCreator,
	actions: (string | StateItem)[]
): StateAction[];

/**
 * This helper method converts the actions
 * received via the argument to an array
 * @return returns the "compile" method
 */
export function stateCollection(): StateCollection;

/**
 * This method allows you to add middleware for the state handler.
 * @param store the store params
 * @return returns a set of methods
 */
export function middleware<T = {}>(store: Store<T>): MiddlewareParams;

/**
 * This method allows you to add your own debugger.
 * The debugger will accept and output logs instead of the standard debugger.
 * @param store store object
 * @param fn debugger callback function
 */
export function createDebuger<T = {}>
(store: Store<T>, fn: DebuggerListener): void;

/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a store.
 * @param options an object containing the store settings
 * @return returns a set of actions
 */
export function createManager(action: AnyAction): Manager;

/**
 * The method makes an asynchronous call
 * and pours the result into the storage.
 * @param store the parameters of the action
 * @param fn callback
 * @async
 * @public
 */
export function callFromStore<T>(store: Store<T>, fn: () => object): void;

/**
 * Allows you to store actions in an isolated container
 * and retrieve them if necessary. It can be useful
 * for eliminating cyclic dependencies.
 */
export const container: Container;

/**
 * This method allows you to add combined state
 * containers to the createStore structure
 * @param proto actions object
 * @return a set of parameters containing the actions and middleware fields
*/
export function combineActions<S = object>
(proto: CombineProto<S>): CombineActions;

export {
	StateAction,
	SubscribeListner,
	Dispatcher,
	ActionCreator,
	StateItem,
	StateCollection,
	Manager,
	DispatchPayload,
	StoreSettings,
	StoreParams,
	Store,
	MiddlewareParams,
	DebuggerListener,
	StaticAction,
	Dispatch,
	AnyAction,
	Context,
	Container,
	CombineProto,
	CombineActions,
};