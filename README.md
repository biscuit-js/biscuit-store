# [![N|Solid](./docs/assets/logo.png)](https://nodesource.com/products/nsolid)
Library for managing javascript application states.

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

### Description

Biscuit allows you to create javascript applications with predictable state containers, and also provides an extensive set of tools for working with them. With this library, you can easily create applications with a convenient centralized state system, easily update components, and get a positive development experience.

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
- [Subscribe](https://breakdance.github.io/breakdance/)
- [Dispatch](https://breakdance.github.io/breakdance/)
- [Middleware](https://breakdance.github.io/breakdance/)
- [Manager](https://breakdance.github.io/breakdance/)
- [Debuger](https://breakdance.github.io/breakdance/)

### Help
- [Recommendations](https://breakdance.github.io/breakdance/)
- [API Reference](https://breakdance.github.io/breakdance/)
- [FAQ](https://breakdance.github.io/breakdance/)

--------
### Basic exemple
The easiest way to create a new store is to use the createStore function. The function accepts a set of parameters that can consist of the fields repo, states, middleware and debug. Repo is a required field.

store/root.js
``` javascript
import { createStore } from "@biscuit-store/core";

// In this example, we created a store containing the repository with name "counter"
// with the standard parameter {value: 0}
// and bound two states to it, counterTimer and counterReady
const counterStore = createStore({
    repo: {
        name: "counter",
        initial: { value: 0 }
    },
    states: {
        counterAdd: "COUNTER/ADD",
        counterClear: "COUNTER/CLEAR"
    }
});

// Exporting store and actions
export const { store } = counterStore;
export const { counterTimer, counterReady } = counterStore.actions;

```
Next, we import the actions and store to the desired file. To subscribe to the store, we use the "store.subscribe" method, and to send the status, we use the "[actionName].dispatch" method.

counter.js
``` javascript
import { counterAdd, counterClear, store } from "./store/root.js";

// You can subscribe to the store change via the store.subscribe method. 
// You can also subscribe to a specific state change 
// via the [actionName].subscribe method.
store.subscribe((state) => {
    console.log(state.value);
});

// The dispatch can accept an instance of an object 
// or a callback functions that returns the previous state.
setInterval(() => {
    counterAdd.dispatch((prev) => ({ value: prev.value + 1 }));
}, 1000);

// Dispatch has several built-in methods. 
// - the before method work before the change and return the previous state, 
// - the after method work after the change and return the new state. 
// - There are also "merge" methods. and "pull" they are 
//   needed for states converted to branches.
setInterval(() => {
    counterClear.dispatch({ value: 0 }).after((state) => {
        console.log("A reset was made to:", state.value);
    });
}, 5000);
```
### Basic example with state encapsulation
Well, what if we want to encapsulate state logic? Biscuit promotes the flexibility of the architecture, and for this reason, we did not force the developer to mandatory use of encapsulation. If you need it just use the built-in middleware "Adapter"

Installation of adapter:
``` javascript
npm install @biscuit-store/adapter
```

store/adapter.js
``` javascript
import { createAdapter } from "@biscuit-store/adapter";

// Creating a new adapter
const adapter = createAdapter();

// As you can see the adapters are very easy to read. 
// Just call the action method from the variable with the adapter instance, 
// specify the name of the action as the first argument, 
// and pass the callback function as the second.
adapter.action("COUNTER/ADD", (payload, state) => {
    // Next, just return the new object configuration
    return { ...payload, value: state.value + 1 };
});

// You should also know that Biscuit out of the box is asynchronous. 
// this means that you can use asynchronous capabilities in the adapter.
// Just pass the data through calling the third argument instead of "return".
adapter.action("COUNTER/CLEAR", (payload, state, send) => {
    // The callback function provides you with three arguments:
    // - The first is the payload, 
    // - The second is the store data, 
    // - The third is the function returned to send changes.
    const value = state.value;
    setTimeout(() => {
        send({ ...payload, value: state.value - value });
    }, 100)
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

// Observer, allows you to update the component 
// and sends data from the store to the component. 
// for a component to work with specific states, 
// actions are specified as dependencies in the second argument.
const App = observer(
    ({ value }) => {
        return (
            <div className="counter">
                <p>output: {value}</p>
            </div>
        );
    },
    // The obvious indication of dependencies makes 
    // it easier to maintain the application.
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

    // Here we just hang up the dispatches on the buttons
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
