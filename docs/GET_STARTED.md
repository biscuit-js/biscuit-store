## Get started with Вiscuit-store
Biscuit is a set of tools for working with the state of your javascript application. The Biscuit architecture allows you to create a repository and bind managed states to it with encapsulated logic. The library can also perform asynchronous state changes and merge states with the repository and with each other.

### When do I need to use the Biscuit-store?
You will find the answer to this question in the [FAQ](./FAQ.md) section

### Instalation

To install the biscuit-store in your project, you need to use the team of one of the package managers:
```
npm install @biscuit-store/core
```
or yarn
```
yarn add @biscuit-store/core
```
Thus, we installed the kernel and the main features of the library became available to us.

If you are using React then you also need to run the command to install the extension for react:
```
npm install @biscuit-store/react
```
or yarn
```
yarn add @biscuit-store/react
```
Done!!! Biscuit is installed in our project.

### Our first store

If you have previously used [Redux](https://redux.js.org/), then you are used to the fact that you have one store for the entire application. On the contrary, the Biscuit-store encourages the creation of multiple stores for different abstract segments of your application.

You can find out more about this in the [FAQ](./FAQ.md) section

Let's try to create our first store, for this we will need the createStore method, we can get it from the Biscuit core.

*helloWorldStore.js*
``` javascript
import { createStore } from "@biscuit-store/core";

const helloWorldStore = createStore({
    repo: {
        name: "helloWorld",
        initial: { value: 0 }
    }
});

export const { store } = helloWorldStore;
```

At the moment, we have created a store with the minimum required parameters. Namely, with the repo field, which should contain the name of the repository and the source data.

Now let's try to get the original repository data:
``` javascript
import { store } from "./helloWorldStore";

const data = store.get():
console.log(data); // { value: 0 }
```
Also, let's try to add something to the repository:
``` javascript
import { store } from "./helloWorldStore";

store.add({ id: 1 }):

const data = store.get():
console.log(data); // { value: 0, id: 1 }
```
Now we can use our store as a kind of virtual data storage, and this is already good. But we want more, namely, to use our store to aggregate states.

To do this, let's upgrade our store:
*helloWorldStore.js*
``` javascript
import { createStore } from "@biscuit-store/core";

const helloWorldStore = createStore({
    repo: {
        name: "helloWorld",
        initial: { value: 0 }
    },
    states: {
        addAction: "ADD/ACTION",
    }
});

export const { store } = helloWorldStore;
export const { addAction } = helloWorldStore.actions;
```

### First subscribe and dispatch
We just created our first state, and now we need to try out the mechanism for subscribing to it:

*script.js*
``` javascript
import { addAction } from "./helloWorldStore";

// state subscribtion
addAction.subscribe((state) => {
    console.log(state); // {value: 1}
});
// or
addAction.subscribe((state) => {
    addAction.getState(); // {value: 1}
});

// dispatching
addAction.dispatch({value: 1});
// or
addAction.dispatch(({ value }) => ({value: value + 1}));
```
It's also worth noting that in addition to subscribing to a specific state you can subscribe to a store change:

*script.js*
``` javascript
import { addAction, store } from "./helloWorldStore";

// store subscribtion
store.subscribe((state) => {
    console.log(state); // {value: 1}
});

// dispatching
addAction.dispatch({value: 1});
```
Read more in the section: [subscribe](./core/SUBSCRIBE.md).

Also you need to know that dispatch has several built in methods:

*script.js*
``` javascript
import { addAction } from "./helloWorldStore";

addAction.dispatch({value: 1}).before((prevState) => {
    // The before method is called before the update 
    // and will return an unchanged state.
    console.log(prevState); // {value: 0}
});

addAction.dispatch({value: 1}).after((state) => {
    // The after method is called after the update
    // and will return the new state.
    console.log(state);
});
```
Read more in the section: [dispatch](./core/DISPATCH.md).

### First middleware

Now we are able to create a state and subscribe to it and cause a change.
But this is not enough for us! We want to create fully managed states with encapsulated logic that will be stored in one place.

In the implementation of such functionality, middleware functions will help you. You can either take a ready-made adapter module or write your own function.

Read more in the section: [middleware](./core/MIDDLEWARE.md).

Let's start with the second option:

*actions.js*
``` javascript
export function helloActions({action payload, state}, send) {
    if(action === "INCREMENT/ACTION") {
        send({value: state.value + payload.value});
    }

    if(action === "DECREMENT/ACTION") {
        send({value: state.value - payload.value});
    }
}
```
As you probably understood, middleware functions out of the box support asynchrony, just for this reason, data is sent by the second argument method.

Now let's upgrade our store:

*helloWorldStore.js*
``` javascript
import { createStore } from "@biscuit-store/core";
import { helloActions } from "./actions.js";

const helloWorldStore = createStore({
    repo: {
        name: "helloWorld",
        initial: { value: 0 }
    },
    states: {
        increment: "INCREMENT/ACTION",
        decrement: "DECREMENT/ACTION",
    }, 
    middleware: [helloActions]
});

export const { store } = helloWorldStore;
export const { increment, decrement } = helloWorldStore.actions;
```

Let's try changing the state:

*script.js*
``` javascript
import { 
    increment, 
    decrement, 
    store 
} from "./helloWorldStore";

store.subscribe((state) => {
    console.log(state.value); 
    // 1
    // 2
    // 3
    // 0
});

increment.dispatch({value: 1});
increment.dispatch({value: 1});
increment.dispatch({value: 1});

decrement.dispatch({value: 3});
```
Now you know how to create a simple middleware. However, I recommend using the [Adapter](./adapter/ADAPTER.md) module to create encapsulated states.

### First Adapter
Adapter is a lightweight module for the biscuit-store middleware that allows you to create asynchronous, encapsulated, unified, states.

Install Adapter:
```
npm install @biscuit-store/adapter
```
or
```
yarn add @biscuit-store/adapter
```
Now let's write our adapter:

*adapter.js*
``` javascript
import { createAdapter } from "@biscuit-store/adapter";

const adapter = createAdapter();

adapter.action("INCREMENT/ACTION", (payload, state) => {
    return {value: state.value + payload.value};
});

adapter.action("DECREMENT/ACTION", (payload, state, send) => {
    send({ ...payload, value: state.value - value });
});

export default adapter;
```
As you probably noticed, the adapter can synchronously return updated data via return, or asynchronously via the third argument-method.

Now let's upgrade our store:

*helloWorldStore.js*
``` javascript
import { createStore } from "@biscuit-store/core";
import { adapter } from "./adapter.js";

const helloWorldStore = createStore({
    repo: {
        name: "helloWorld",
        initial: { value: 0 }
    },
    states: {
        increment: "INCREMENT/ACTION",
        decrement: "DECREMENT/ACTION",
    }, 
    middleware: [adapter.connect]
});
```

### Learn more
Congratulations! You have familiarized yourself with the basic features of the Biscuit-store. 

But this is not all... Biscuit has many great features such as:
 - [Integration with React](./react/REACT.md)
 - [The creation of a state-branches](./core/STATE.md)
 - [Management state-branch](./core/MANAGER.md)
 - [Dynamic creation of states](./core/STATE.md)
 - [Composite store](./core/CREATE_STORE_METHODS.md)
 - [Debugging](./core/DEBUGGER.md)
