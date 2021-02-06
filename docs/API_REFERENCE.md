## API reference
This section contains all the current methods from all the biscuit-store packages.

### Content:
#### @biscuit-store/core

[Biscuit-store API:](#biscuit-store-api)
- [createStore](#createStore)
- [dispatch](#dispatch)
- [subscribeToState](#subscribeToState)
- [subscribeToStore](#subscribeToStore)
- [getState](getState)
- [newRepo](#newRepo)
- getRepo
- addRepo
- createStateTo
- middleware
- createDebuger
- createManager
- initialActions
- stateCollection
- combineStateCollections

Store api:
- store.subscribe
- store.get
- store.add
- store.repo

Action api:
- action.subscribe
- action.dispatch
- action.getState
- action.repo
- action.state

Store api:
- store.subscribe
- store.get
- store.add
- store.repo

Action api:
- action.subscribe
- action.dispatch
- action.getState
- action.repo
- action.state

#### @biscuit-store/react

Decorators:
- obscerver
- subscribe

Hooks:
- useSubscribe
- useDispatch
- useDispatchThrottle
- useDispatchDebounce

#### @biscuit-store/adapter

Adapter API:
- createAdapter

adapter:
- adapter.action
- adapter.connect


### Biscuit-store API
### createStore
Use this method to create a new repository. Receives an object with storage parameters as input.

params:
- **options**: *object* - storage settings;

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
        increment: "INCREMENT/ACTION",
        decrement: "DECREMENT/ACTION",
        save: {
            name: "SAVE/ACTION",
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
- **action**: *object* - store status action;
- **payload**: *[object | function(object) => object]* - Updated data for the state.

return: *object*

```javascript
dispatch(customAction, {value: value + 1});
```

The dispatch method can accept both an object directly and a callback function that will receive the current state and return the payload.
```javascript
dispatch(customAction, ({ value }) => ({value: value + 1}));
```
Dispatch also returns a number of useful methods:
  - **before**: Works out before the change and returns the current state;
  - **after**: Works out after the change and returns the new state;
  - **merge**: Used for states transformed into the branches. Merges the state data to the main repository.

```javascript
dispatch(customAction, {value: 1}).before((prevState) => {
    console.log(prevState.value); // 0
});
```
Typescript types:
```
param action:
    interface: StateAction
param payload:
    type: DispatchPayload
return: 
    interface: Dispatcher
```
### subscribeToState
This method allows you to subscribe to a specific state of the store.

params:
- **action**: *object* - store state action;
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
    interface: StateAction
param fn:
    type: SubscribeListner<T>
return: 
    interface: Promise<T>
```

### subscribeToStore
Almost the same as [subscribeToState](#subscribeToState), but subscribes to all changes to the store.

params:
- **repo**: *[string | object]* - store state action;
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
- **action**: *object* - store state action;

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
    interface: StateAction

return: T
```
### newRepo