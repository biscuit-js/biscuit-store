import { Store } from './store';

/**
 * This type defines the payload in the dispatch
 */
export type DispatchPayload = (<T>(prev: T) => object) | object;

/**
 * This type defines the subscription function
 */
export type SubscribeListner<T> = (state: T) => void;

/**
 * This type defines the dispatch function
 */
export type Dispatch<T = object> = (payload: T) => Dispatcher;

/** The interface defines the action parameters for the state */
export interface StateAction {
    repo: string;
    state: string;
    dispatch: Dispatch;
    subscribe: <T>(fn: SubscribeListner<T>) => Promise<T>;
    getState: <T>() => T;
}

/** This interface defines the initialization state parameter */
export interface StateObject {
    /** The action name string */
    name: string;
    /** Whether to make the state a separate branch */
    branch?: boolean;
    /** If the state is a branch you can set the initial parameters */
    initial?: object;
}

/**
 * This interface defines the optimal state parameters
 * for initialization via createStateTo
 */
export interface StateOptions<T> {
    branch: boolean;
    initial?: T;
}

/**
 * This interface defines
 * the state parameters initialization
 */
export interface StateItem {
    name: string;
    options?: StateOptions<object>;
}

/**
 * This interface defines a field parameter
 * for initializing states in createStore
 */
export interface StateCollectionRepo {
    [propName: string]: StateAction[];
}

/**
 * The interface defines a set of returned
 * methods from stateCollection
 */
export interface StateCollection {
    /**
     * compile state collection
     * @param actions actions args
     * @return actions collection
     */
    compile: (...actions: StateAction[]) => StateCollectionRepo;
    /**
     * Get the entire collection actions
     * @return collections instance
     */
    all: () => StateCollectionRepo;
    /**
     * Get a collection by matching the repository name
     * @param repo storage name
     * @return collections instance
     */
    fromRepo: (repo: string) => StateAction[];
    /**
     * Get the result filtered by state name
     * @param stateName state name
     * @return collections instance
     */
    outOfState: (stateName: string) => StateAction;
}

/**
 * This interface describes
 * the methods returned by dispatch
 */
export interface Dispatcher {
    /**
     * Call before state change
     * @param fn callback
     */
    before: <T>(fn: SubscribeListner<T>) => void;
    /**
     * Call after state change
     * @param fn callback
     * @async
     */
    after: <T>(fn: SubscribeListner<T>) => void;
    /**
     * Merge state into repository
     */
    merge: () => void;
};

/**
 * This interface describes the methods
 * that createActionTo returns
 */
export interface ActionCreator {
    /**
     * This method binds the state to the selected storagee
     * @param action state name
     * @param options state options
     * @return new action
     */
    bind: <T>(action: string, options?: StateOptions<T>) => StateAction;
    /** repository key */
    repo: string;
}

/**
 * This interface describes
 * the methods that manager returns
 */
export interface Manager {
    /**
     * This method will combine data
     * from the state with data from the repository.
     */
    merge: () => void;
    /**
     * This method will merge data
     * from the storage with data from the state.
     */
    pull: () => void;
    /**
     * This method will replace the data
     * from the storage with state data.
     */
    replaceRepo: () => void;
    /**
     * This method will replace the data
     * from the state with the storage data.
     */
    replaceState: () => void;
    /**
     * This method will merge the data of the selected state
     * with the data of the state specified in the arguments.
     * @param targetAction action for merge
     * the action that you want to merge
     */
    mergeState: (targetAction: StateAction) => void;
    /**
     * This method removes the storage and its copies from all states.
     * WARNING: This method can be useful for optimization,
     * but it can make the code non-obvious,
     * which will lead to difficulties in support.
     */
    remove: () => void;
    /**
     * This method compares two states for identity
     * WARNING: states should not contain methods
     * @param targetAction action for compare
     * the action that you want to compare
     * @return boolean
     */
    compareStates: (targetAction: StateAction) => boolean;
    /**
     * Сompare state and repository
     * WARNING: states should not contain methods
     * @return boolean
     */
    compareWithState: () => boolean;
    /**
     * compare state and instance object
     * WARNING: states should not contain methods
     * @param instance object for compare
     * @return boolean
     */
    compareStateWithInstance: <T>(instance: T) => boolean;
    /**
     * compare repository and instance object
     * WARNING: states should not contain methods
     * @param instance object for compare
     * @return boolean
     */
    compareRepoWithInstance: <T>(instance: T) => boolean;

    /**
     * Clones the selected storage and its state.
     * WARNING: It is best to avoid using this method,
     * as the best practice would be to do initialization of repositories in one place.
     * Copying the repository can lead to code support difficulties.
     * @param name name for the new storage
     */
    clone: <T = {}>(name: string) => Store<T>;
    /**
     * Updates the status of the repository.
     * This method is equivalent to dispatch(...)
     */
    update: () => void;
    /**
     * Returns parameters of the selected action
     */
    props: StateAction;
}

/** Static action params */
export interface StaticAction {
    repo: string;
    state: string;
}
