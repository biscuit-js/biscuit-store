# [![N|Solid](./docs/assets/logo.png)](https://nodesource.com/products/nsolid)
Library for managing javascript application states.

[![Build Status](./docs/assets/License-MIT-green.svg)](https://travis-ci.org/joemccann/dillinger) [![Build Status](./docs/assets/version.svg)](https://github.com/Biscuit-javascript/biscuit-store/releases)


### Description

Biscuit allows you to create javascript applications with predictable state containers, and also provides an extensive set of tools for working with them. 
With this library, you can easily create applications with a convenient centralized state system, easily update components, and get a positive development experience.

The main goal of the biscuit-store is to provide the developer with the most flexible functionality, while promoting compliance with the basic architectural principles of programming.

- Flexible architecture
- Asynchronous out of the box
- React support
- Simple extension with middleware
- Easy debugging

### Installation

Installation of core files
``` javascript
npm install @biscuit-store/core
```

Installing an extension to share with react
``` javascript
npm install @biscuit-store/react
```

### Documentation

- [Get started](./docs/GET_STARTED.md)
- [Store](./docs/core/STORE.md)
- [Subscribe](./docs/core/SUBSCRIBE.md)
- [State](./docs/core/STATE.md)
- [Manager](./docs/core/MANAGER.md)
- [Middleware](./docs/core/MIDDLEWARE.md)
- [Debugger](./docs/core/DEBUGGER.md)

### Help
- [Recommendations](./docs/RECOMMENDATIONS.md)
- [API Reference](./docs/API_REFERENCE.md)
- [FAQ](https://breakdance.github.io/breakdance/)

--------
### Basic exemple
The easiest way to create a new store is to use the createStore function. The function accepts a set of parameters that can consist of the fields repo, states, middleware and debug. Repo is a required field.

store/counter/index.js
``` javascript
import { createStore } from "@biscuit-store/core";

// Creating a new store
const counterStore = createStore({
  repo: {
    name: "counter",
    initial: { value: 0 }
  },
  states: {
    counterAdd: "COUNTER/ADD"
  }
});

// Exporting store and actions
export const { store } = counterStore;
export const { counterAdd } = counterStore.actions;
```
Next, we import the actions and store to the desired file. To subscribe to the store, we use the "store.subscribe" method, and to send the status, we use the [dispatch](./docs/core/SUBSCRIBE.md#Dispatch) method.

counter.js
``` javascript
import { counterAdd, store } from "./store/counter";

// You can subscribe to the store change via the store.subscribe method.
store.subscribe((state) => {
  console.log(state.value);
});

// The dispatch can accept an instance of an object
// or a callback functions that returns the previous state.
counterAdd.dispatch((prev) => ({ value: prev.value + 1 }));
```
[![N|Solid](./docs/assets/exemple-button.png)](https://codesandbox.io/s/test-biscuit-forked-4mp86?file=/src/index.js)


### Basic example with managed states
Well, what if we want to managed state logic? Biscuit promotes the flexibility of the architecture, and for this reason, we did not force the developer to mandatory use of managed state. If you need it just use the built-in middleware the **Adapter** or write your own function.

Installation of adapter:
``` javascript
npm install @biscuit-store/adapter
```

store/adapter.js
``` javascript
import { createAdapter } from "@biscuit-store/adapter";

// Creating a new adapter
const adapter = createAdapter();

adapter.action("COUNTER/ADD", (payload, state) => {
    return { ...payload, value: state.value + 1 };
});

// You should also know that Biscuit out of the box is asynchronous. 
// this means that you can use asynchronous capabilities in the adapter.
adapter.action("COUNTER/CLEAR", (_, _, send) => {
    send({ value: 0 });
});

// Exporting our adapter
export default adapter;
```
Next, connect our adapter to the store via the middleware field.
``` javascript
import { createStore } from "@biscuit-store/core";
import adapter from "./adapter";

const counterStore = createStore({
    repo: {
        name: "counter",
        initial: { value: 0 }
    },
    states: {
        counterAdd: "COUNTER/ADD",
        counterClear: "COUNTER/CLEAR"
    },
    // Here we can connect as many middleware functions
    // as we want by specifying them in the array
    middleware: [adapter.connect]
});

export const { counterAdd, counterClear } = counterStore.actions;

```
Next, we import the actions and store to the desired file. This time we will see how it will all look in React.

index.js
``` javascript
import React from "react";
import ReactDOM from "react-dom";
import { observer, useDispatch } from "@biscuit-store/react";
import { counterAdd, counterClear } from "./store/root.js";

// The observer allows you to update the component 
// and get data from the associated stores.
const App = observer(
    ({ value }) => {
        return (
            <div className="counter">
                <p>output: {value}</p>
            </div>
        );
    },
    [counterAdd, counterClear]
);

// The component with the logic for our counter
const Counter = () => {
    // The hook useDispatch, accepts an arbitrary number of actions 
    // as input and returns ready-made dispatching functions.
    const [add, clear] = useDispatch(
        counterAdd, 
        counterClear
    );

    return (
        <div>
            <button onClick={add}>Add</ button>
            <button onClick={clear}>Clear</ button>
        </ div>
    )
}

// Initializing the application
ReactDOM.render(
    <React.Fragment>
        <Counter />
        <App />
    </ React.Fragment>,
    document.getElementById("root")
);
```
### Contributing
If you liked the library, you have many ways to help it develop. 
- You can write about the biscuit-store on various forums;
- Put a star on github;
- Write about the bugs found and suggest improvements;
- Participate in the development, offer your pull request;
- Or you can just help financially;
  
The rules of assistance can be found [here](./CONTRIBUTING.md).

### Inspiration
The idea of developing this library was inspired by the [Redux](https://redux.js.org/) project. During the introduction to the biscuit-store, you will see several patterns that are similar to the concepts of [Redux](https://redux.js.org/). *Nevertheless, biscuit is a separate library that uses completely different architectural principles.*

### Feedback
If you have any questions, suggestions, comments, suggestions for cooperation, or if you like the library and want to become a sponsor, please contact the developer by email: **biscuitstorejs@gmail.com.**

### License
Copyright (c) 2021 Philipp Zhulev

MIT License ([MIT](./LICENSE.md)).

