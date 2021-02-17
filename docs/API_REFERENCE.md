## API reference
This section contains all the current methods from all the biscuit-store packages.

### @biscuit-store/core

#### [Biscuit-store API:](#Biscuit-store-top-level-api)
- [createStore](#createStore)
- [dispatch](#dispatch)
- [subscribeToState](#subscribeToState)
- [subscribeToStore](#subscribeToStore)
- [getState](#getState)
- [newRepo](#newRepo)
- [getRepo](#getRepo)
- [addRepo](#addRepo)
- [createStateTo](#createStateTo)
- [middleware](#middleware)
- [createDebugger](#createDebugger)
- [createManager](#createManager)
- [initialActions](#initialActions)
- [stateCollection](#stateCollection)
- [combineStateCollections](#combineStateCollections)

#### [Store api:](#Biscuit-store-store-api)
- [store.subscribe](#store.subscribe)
- [store.get](#store.get)
- [store.add](#store.add)
- [store.repo](#store.repo)

#### [Action api:](#Biscuit-store-action-api)
- [action.subscribe](#action.subscribe)
- [action.dispatch](#action.dispatch)
- [action.getState](#action.getState)
- [action.repo](#action.repo)
- [action.state](#action.state)


### @biscuit-store/adapter

#### Adapter API:
- createAdapter

#### adapter:
- adapter.action
- adapter.connect


### @biscuit-store/react

#### Decorators:
- obscerver
- subscribe

#### Hooks:
- useSubscribe
- useDispatch
- useDispatchThrottle
- useDispatchDebounce
  
-----------

### Biscuit-store top level API
### createStore
Use this method to create a new repository. Receives an object with storage parameters as input.

params:
- **options***: *object* - storage settings;

return: *{store: object,  action: object}*

exemple:
```javascript
import { createStore } from "@biscuit-store/core";
import { middleFunc } from "./middleware.js";

const helloStore = createStore({
    repo: {
        name: "hello",
        initial: { value: 0 }
    },
    states: {
        increment: "increment/action",
        decrement: "decrement/action",
        save: {
            name: "save/action",
            branch: true,
            initial: { version : 0 }
        },
    }, 
    middleware: [middleFunc],
    debugger: (e) => {
        console.log(e);
    },
    strictMode: true,
});

export const { store } = helloStore;
export const { increment, decrement, save } = helloStore.actions;
```
let's take a closer look at the fields of this method in more detail:
| field      | description                                                                                                                                                                                            | type                                  | default   | require |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|-----------|---------|
| repo       | This field is required to create a repository.  Contains the name of the repository and the original data.                                                                                             | object{name: string, initial: object} | undefined | yes     |
| states     | This field must contain a set of states in the format key-value.  Key is the name of the variable that you want to get in the end,  and value is the status name string, usually written in uppercase. | object{[prop]: string \| object}      | undefined | no      |
| middleware | This is an array of middleware functions.  The callback of such a function returns two arguments:  the first is the context and the second is the sending function.                                    | array[function(callback)]             | undefined | no      |
| debugger   | This field must contain a function that will return the log.                                                                                                                                           | function(callback)                    | undefined | no      |
| strictMode | When StrictMode is enabled, you will receive warnings. For example when you have a dispatch but no subscribe                                                                                           | boolean                               | true      | no      |


Description for the states object:
| field   | description                                                      | type    | default   | require |
|---------|------------------------------------------------------------------|---------|-----------|---------|
| name    | State name, see the recommendations for the format above.        | string  | undefined | yes     |
| branch  | This field defines. whether this branch is isolated.             | boolean | false     | no      |
| initial | The source data of the branch, only needed for the state-branch. | object  | {}        | no      |

Typescript types:
```
param options:
    interface: StoreSettings
return: 
    interface: StoreParams
```
### dispatch
Dispatcher is a method that is used to send the updated state to the store and notify listeners of the received changes.

params:
- **action***: *object* - store status action;
- **payload**: *[object | function(object) => object]* - Updated data for the state.

return: *object*

```javascript
import { dispatch } from "@biscuit-store/core";

dispatch(customAction, {value: value + 1});
```

The dispatch method can accept both an object directly and a callback function that will receive the current state and return the payload.
```javascript
import { dispatch } from "@biscuit-store/core";

dispatch(customAction, ({ value }) => ({value: value + 1}));
```
Dispatch also returns a number of useful methods:
  - **before**: Works out before the change and returns the current state;
  - **after**: Works out after the change and returns the new state;
  - **merge**: Used for states transformed into the branches. Merges the state data to the main repository.

```javascript
import { dispatch } from "@biscuit-store/core";

dispatch(customAction, {value: 1}).before((prevState) => {
    console.log(prevState.value); // 0
});

dispatch(customAction, {value: 2}).after((currentState) => {
    console.log(prevState.value); // 0
});

dispatch(customAction, {value: 3}).merge();
```
Typescript types:
```
param action:
    type: AnyAction
param payload:
    type: DispatchPayload
return: 
    interface: Dispatcher
```
### subscribeToState
This method allows you to subscribe to a specific state of the store.

params:
- **action***: *object* - store state action;
- **fn**: *[function(object)]* - A callback function that returns the new state of the store.

return: *{Promse, unsubscribe()}*

```javascript
import { subscribeToState } from "@biscuit-store/core";
import { customAction } from "./store";

subscribeToState(customAction, (state) => {
    console.log(state);
);

// or

subscribeToState({repo: "name", action: "custom/ACTION"}, (state) => {
    console.log(state);
);
```

Now let's look at the situation when you need to unsubscribe from a particular store or state. For these purposes, the unsubscribe mechanism is implemented.

You can also unsubscribe from the state:
```javascript
import { subscribeToState } from "@biscuit-store/core";
import { customAction } from "./store";

const listner = subscribeToState(customAction, (store) => {
    console.log(store);
});
    
listner.unsubscribe();
```

This method is asynchronous and returns a promise:
```javascript
import { subscribeToState } from "@biscuit-store/core";
import { customAction } from "./store";

subscribeToState(customAction).then((state) => {
    consle.log(state);
});

```
Typescript types:
```
param action:
    type: AnyAction
param fn:
    type: SubscribeListner<T>
return: 
    interface: Promise<T>
```

### subscribeToStore
Almost the same as [subscribeToState](#subscribeToState), but subscribes to all changes to the store.

params:
- **repo***: *[string | object]* - store state action;
- **fn**: *[function(object)]* - A callback function that returns the new state of the store.

return: *{Promse, unsubscribe()}*

```javascript
import { subscribeToStore } from "@biscuit-store/core";
import { store } from "./store";

subscribeToStore(store, (state) => {
    console.log(state);
);

// or

subscribeToStore("repoName", (state) => {
    console.log(state);
);
```
Typescript types:
```
param repo: string | object 
param fn:
    type: SubscribeListner<T>
return: 
    interface: Promise<T>
```
### getState
This method is used to get the data of the state of the store.

params:
- **action***: *object* - store state action;

return: object

exemple:
```javascript
import { getState } from "@biscuit-store/core";
import { customAction } from "./store";

getState(customAction); // {value: 0}
```

Typescript types:
```
param action:
    type: AnyAction

return: T
```
### newRepo
This method will create a new repository and return a set of methods and return a set of methods to manage the repository.
> We recommend using the monolithic method createStore to create repositories.

params:
- **repo***: *string* - repository name;
- **initial**: *object* - initial object.

return: object

```javascript
import { newRepo } from "@biscuit-store/core";

const store = newRepo("custom", {value: 0});

store.get() // {value: 0}
```
See the set of returned parameters [here](#Store-api)

Typescript types:
```
param repo: string
return: Store<T>
```
### getRepo
This method is used to get data from the repository.

> If states are bound to the storage, we recommend using getState

params:
- **repo***: *[string | object]* - repository name, accepts a name string or a storage object;

return: object

```javascript
import { newRepo, getRepo } from "@biscuit-store/core";

const store = newRepo("custom", {value: 0});

getRepo(store); // {value: 0}

// or

getRepo("custom"); // {value: 0}
```
Typescript types:
```
param repo: 
    string | interface StoreParams
return: T
```
### addRepo
This method is used to write data directly to the repository.
> This method is recommended only if necessary. It is advisable to change the repository content via managed states.

params:
- **repo***: *[string | object]* - repository name, accepts a name string or a storage object;
- **instance***: object
  
```javascript
import { newRepo, addRepo } from "@biscuit-store/core";

const store = newRepo("custom", {value: 0});

addRepo(store, { text: "hello"});
// or
addRepo("custom", { text: "hello"});
```

Typescript types:
```
param repo: 
    string | interface StoreParams
param instance: T
```

### createStateTo
This method allows you to dynamically bind the managed state to the storage.
>Don't use dynamic state creation unless you really need to. For better code readability, all states should be declared in one place.

params:
- **store***: *object* - store, accepts a store object;
  
return: object
  
Returns the bind method, which takes an action name string and an optional object with  parameters.

```javascript
import { customStore, createStateTo } from "@biscuit-store/core";

const customStore = createStore({
    repo: {
        name: "hello",
        initial: { value: 0 }
    },
    states: {
        increment: "increment/action",
    }, 
});

export const decrement = 
    createStateTo(customStore.store).bind("decrement/action");

export const { store } = customStore;
export const { increment, decrement } = customStore.actions;
```

create branch example:
```javascript
export const branch = 
    createStateTo(customStore.store).bind("decrement/action", {
        branch: true,
        initial: {text: "hello"}
    });
```
returns the state [action](#Action-api).

Typescript types:
```
param params: 
    interface Store<T>
return: ActionCreator
-----
bind
    param action: string
    param options: StateOptions

return AnyAction
```

### middleware
This method is used to dynamically create middleware.

params:
- **store***: *object* - accepts a store object;

return: object

returns the add method that binds the function.

```javascript
import { middleware } from "@biscuit-store/core";
...
middleware(store).add((ctx, next) => {
    ...
});
```
The middleware callback function returns the context and method that indicates the completion of processing.

**Middleware context:**
| name      | description                    | type   |
|-----------|--------------------------------|--------|
| action    | Action name.                   | string |
| repo      | Repo/store name.               | string |
| payload   | Payload data.                  | object |
| state     | The data of the current state. | object |
| getAction | Returns the store action by name. | function |

You can read about the functions of the middleware [here](./core/MIDDLEWARE.md).

Typescript types:
```
param params: 
    interface Store<T>
return: MiddlewareParams
-----
add
    param fn: (Middleware)

return void
```
### createDebugger
You can add a debugger function to an existing store anywhere in the application using the composite method.

params:
- **store***: *object* - accepts a store object;
- **fn***: *function* - callback function;

return: void

 exemple:
 ```javascript
 import { createDebuger } from "@biscuit-store/core";

createDebuger(store, (e) => {
    if(e.type === "error) {
        throw new CunstomError(e.message);
    }
});
 ```

 Error context:
 | name    | description                                                            | type   |
|---------|------------------------------------------------------------------------|--------|
| message | Log message                                                            | string |
| file    | The file where the event that generated the log occurred. (test field) | string |
| level   | Log level [ local \| global ]                                          | string |
| type    | Log type [ log \| warning \| error ]                                   | object |

 Read more [here](./core/DEBUGGER.md)

Typescript types:
 ```
param stroe: 
    interface Store<T>
param fn: 
    type DebuggerListener

return: void
 ```

### createManager
The createManager is a method of the biscuit library API that accepts a branch state action as input and returns a number of methods for working with it.


params:
- **action***: *object* - store state action;

return: object

Example of manager initialization:
```javascript
import { manager } from "@biscuit-store/core";
import { branchAction, customAction } from "./testStore";

const manager =  createManager(branchAction);
manager.mergeState(customAction);
manager.merge();
```
Read more [here](./core/MANAGER.md)

Typescript types:
```
param action: 
    type AnyAction

return: Manager
```
### Manager methods

#### manager.merge
This method will combine data from the state with data from the storage.

#### manager.pull
This method will merge data from the storage with data from the state.
#### manager.replaceRepo
This method will replace the data from the storage with state data.

#### manager.replaceState
This method will replace the data from the state with the storage data.

#### manager.mergeState
This method will merge the data of the selected state with the data of the state specified in the arguments.

params:
- **targetAction***: *object* - store state action;

Typescript types:
 ```
param action: 
    type AnyAction
```

#### manager.remove
This method removes the storage and its copies from all states.

> This method can be useful for optimization,
but it can make the code non-obvious,
which will lead to difficulties in support.

#### manager.compareStates
This method compares two states.
> States should not contain methods

params:
- **targetAction***: *object* - store state action;

return: boolean

Typescript types:
 ```
param action: 
    type AnyAction

return: boolean
```

#### manager.compareWithState
Сompare state and repository.
> States should not contain methods

return: boolean

#### manager.compareStateWithInstance
Compare state and instance object.
> States should not contain methods

params:
- **instance***: *object*;

return: boolean

#### manager.compareRepoWithInstance
Compare repository and instance object.

params:
- **instance***: *object*;

return: boolean

#### manager.clone
Clones the selected storage and its state.

> It is best to avoid using this method, as the best practice would be to do initialization of repositories in one place. Copying the repository can lead to code support difficulties.

params:
- **name***: *string*;

return: object


Typescript types:
 ```
param name: string

return: Store<T>
```

#### manager.update
Updates the state of the repository.
This method is equivalent to dispatch(...).

#### manager.props
Returns parameters of the selected action.

### initialActions
This helper method takes the first parameter createactionsTo and adds actions to it from the string array of the second argument.

params:
- **createActions***: *function* - Accepts the createStateTo function;
- **array***: *string[]* - List of action names;


return: object[]

```javascript
import { initialActions } from "@biscuit-store/core";
...
const actionCreator = createStateTo(customStore.store);

const [addAction, removeAction] = initialActions(actionCreator, [
    "add/action", 
    "remove/action",
]);
```

Typescript types:
 ```
param createActions: 
    interface ActionCreator

param actions: string[]

return: StateAction[]
```

### stateCollection
This method allows you to create a collection of actions.

return: Object

Typescript types:
 ```
return: StateCollection
```

#### colection.compile
This method accepts multiple actions as arguments. And returns a collection of actions.

params:
- **actions***: *...actions* - Accepts multiple actions as arguments;

return: object

```javascript
import { stateCollection } from "@biscuit-store/core";
...
const collection stateCollection().compile(actionAdd, acrionRemove);
```

Typescript types:
```
param ...actions: 
    type AnyAction[]

return: StateCollectionRepo
```
#### colection.all
Get the entire list of collections

return: object

```javascript
import { stateCollection } from "@biscuit-store/core";
...
const collection stateCollection().compile(actionAdd, acrionRemove);

collection.all();
```
Typescript types:
```
return: StateCollectionRepo
```
#### colection.fromRepo
Get a list of collections by repository name.

params:
- **repoName***: *string* - The name of repository;

return: array


```javascript
import { stateCollection } from "@biscuit-store/core";
...
const collection stateCollection().compile(actionAdd, acrionRemove);

collection.fromRepo("repo");
```

Typescript types:
```
param repoName: string

return: StateAction[]
```

#### colection.outOfState
Returns an array of actions by their string name.

params:
- **stateName***: *string* - State string name

return: array

```javascript
import { stateCollection } from "@biscuit-store/core";
...
const collection stateCollection().compile(actionAdd, acrionRemove);

collection.outOfState("add/action");
```

Typescript types:
```
param statename: string

return: StateAction[]
```

### combineStateCollections
This method combines several collections of methods.

- **actions***: *...collections* - Multiple collections;
  
return: object

```javascript
import { stateCollection, combineStateCollections } from "@biscuit-store/core";
...
const collectA stateCollection().compile(actionAdd, acrionRemove);
const collectB stateCollection().compile(actionIncrement, actionDecrement);

const collection = combineStateCollections(collectA. collectB);
```

Typescript types:
```
param statename: 
    interface StateCollection[]

return: StateCollection
```

### Biscuit-store store API

### store.subscribe
Almost the same as [subscribeToStore](#subscribeToStore), but called from the store-api

params:
- **fn**: *[function(object)]* - A callback function that returns the new state 

```javascript
import { store } from "./store";

store.subscribe((state) => {
    console.log(state);
);
```

### state.get
Almost the same as [getRepo](#getRepo), but called from the store-api

```javascript
import { store } from "./store";

store.get(); // { value 1 }
```

### state.get
Almost the same as [getRepo](#getRepo), but called from the store-api

```javascript
import { store } from "./store";

store.get(); // { value 1 }
```
### state.add
Almost the same as [addRepo](#addRepo), but called from the store-api

- **instance***: *object* - updated data;

```javascript
import { store } from "./store";

store.add({value: 2}); // { value 2 }
```

### state.repo
Returns the name of the repository

### Biscuit-store action API

### action.subscribe
Almost the same as [subscribeToState](#subscribeToState), but called from the action-api

params:
- **fn**: *[function(object)]* - A callback function that returns the new state 

```javascript
import { addAction } from "./store";

addAction.subscribe((state) => {
    console.log(state);
);
```

### action.dispatch
Almost the same as [dispatch](#dispatch), but called from the action-api

params:
- **payload**: *[object | function(object)]* - payload data

```javascript
import { store } from "./store";

store.dispatch({value: 1});
// or
store.dispatch((prev) => {value: prev.value + 1});
```

### action.getState
Almost the same as [getSate](#getSate), but called from the action-api

```javascript
import { addAction } from "./store";

addAction.getState(); // {value: 1}
```
### action.repo
Returns the name of the repository

### action.state
Returns the name of the state