# [![N|Solid](https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/packages/biscuit-store/docs/assets/logo.png)](https://github.com/biscuit-js/biscuit-store)
Library for managing javascript application states.

[![Build Status](https://img.shields.io/badge/License-MIT-blue)](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/LICENSE.md) [![Typescript](https://badgen.net/npm/types/@biscuit-store/core)](https://www.typescriptlang.org/) [![npm version](https://badge.fury.io/js/%40biscuit-store%2Fcore.svg)](https://www.npmjs.com/package/@biscuit-store/core) [![release](https://badgen.net/github/release/biscuit-js/biscuit-store)](https://github.com/biscuit-js/biscuit-store/releases) [![Build Status](https://travis-ci.com/biscuit-js/biscuit-store.svg?branch=master)](https://travis-ci.com/biscuit-js/biscuit-store) [![download](https://badgen.net/npm/dt/@biscuit-store/core)](https://www.npmjs.com/package/@biscuit-store/core)




### Description

Biscuit allows you to create javascript applications with predictable state containers, and also provides an extensive set of tools for working with them. 
With this library, you can easily create applications with a convenient centralized state system, update components, and get a positive development experience.

The main goal of the biscuit-store is to provide the developer with the most flexible functionality, while promoting compliance with the basic architectural principles of programming.

**Advantages:**
- Flexible architecture
- Asynchronous out of the box
- React support
- Simple extension with middleware
- Easy debugging

**Developer of the biscuit-store:**
> Initially, I created this library for use in my projects. The idea was to create a states-machine that will combine a number of functions that I lack in other similar tools, as well as to simplify the process of creating repositories and their support. After receiving a number of positive feedback from colleagues, I decided to share this project with the general public.

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

- [Get started](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/GET_STARTED.md)
- [Store](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/STORE.md)
- [Subscribe](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/SUBSCRIBE.md)
- [State](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/STATE.md)
- [Manager](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/MANAGER.md)
- [Middleware](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/MIDDLEWARE.md)
- [Debugger](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/DEBUGGER.md)
- [Adapter](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/adapter/ADAPTER.md)
- [React](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/react/REACT.md)

### Help
- [Recommendations](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/RECOMMENDATIONS.md)
- [API Reference](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/API_REFERENCE.md)
- [Dictionary](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/DICTIONARY.md)

--------
### Basic exemple
The easiest way to create a new store is to use the [createStore](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/STORE.md) function. The function accepts a set of parameters that can consist of the fields repo, states, middleware and debug. Repo is a required field.

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
    counterAdd: "counter/add"
  }
});

// Exporting store and actions
export const { store } = counterStore;
export const { counterAdd } = counterStore.actions;
```
Next, we import the actions and store to the desired file. To subscribe to the store, we use the [subscribe](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/SUBSCRIBE.md#creating-a-subscription) method, and to send the status, we use the [dispatch](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/core/SUBSCRIBE.md#Dispatch) method.

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
[![N|Solid](https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/packages/biscuit-store/docs/assets/exemple-button.png)](https://codesandbox.io/s/test-biscuit-forked-4mp86?file=/src/index.js)


### Basic example with managed states
Well, what if we want to managed state logic? Biscuit promotes the flexibility of the architecture, and for this reason, we did not force the developer to mandatory use of managed state. If you need it just use the built-in middleware the **Adapter** or write your own function.

Installation of adapter:
``` javascript
npm install @biscuit-store/adapter
```

store/counter/adapter.js
``` javascript
import { createAdapter } from "@biscuit-store/adapter";

// Creating a new adapter
const adapter = createAdapter();

// Create action
adapter.action("counter/add", (payload, state) => {
  return { ...payload, value: state.value + 1 };
});

// You should also know that Biscuit out of the box is asynchronous.
// this means that you can use asynchronous capabilities in the adapter.
adapter.action("counter/clear", (payload, store, { send }) => {
  send({ value: 0 });
});

// Exporting our adapter
export default adapter;
```

Next, connect our adapter to the store via the middleware field.

store/counter/index.js
``` javascript
import { createStore } from "@biscuit-store/core";
import adapter from "./adapter";

const counterStore = createStore({
  repo: {
    name: "counter",
    initial: { value: 0 }
  },
  states: {
    counterAdd: "counter/add",
    counterClear: "counter/clear"
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
import { counterAdd, counterClear } from "./store/counter";

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
  const [add, clear] = useDispatch(counterAdd, counterClear);

  return (
    <div>
      <button onClick={add}>Add</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
};

// Initializing the application
ReactDOM.render(
  <React.Fragment>
    <Counter />
    <App />
  </React.Fragment>,
  document.getElementById("root")
);
```
[![N|Solid](https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/packages/biscuit-store/docs/assets/exemple-button.png)](https://codesandbox.io/s/pedantic-rosalind-r3neo?file=/src/index.js)

### Some more examples
- [Asynchronous data fetching](https://codesandbox.io/s/dazzling-jones-vce5e?file=/src/store/counter/adapter.js)
- [Todo list](https://codesandbox.io/s/divine-wave-eh2ld?file=/src/index.js)
- [Typescript example](https://codesandbox.io/s/vigorous-kalam-fyhdc?file=/src/index.tsx)


### Contributing
If you liked the library, you have many ways to help it develop. 
- You can write about the biscuit-store on various forums;
- Put a star on github;
- Write about the bugs found and suggest improvements;
- Participate in the development, offer your pull request;
- Or you can just help financially;
  
The rules of assistance can be found [here](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/CONTRIBUTING.md).

### Donate
Any financial help will help the biscuit to become better.

<a href="https://www.buymeacoffee.com/biscuitstore" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width=220px alt="Buy Me A Coffee" ></a>

### Inspiration
The idea of developing this library was inspired by the [Redux](https://redux.js.org/) project. During the introduction to the biscuit-store, you will see several patterns that are similar to the concepts of [Redux](https://redux.js.org/). *Nevertheless, biscuit is a separate library that uses completely different architectural principles.*

### Feedback
If you have any questions, suggestions, comments, suggestions for cooperation, or if you like the library and want to become a sponsor, please contact the developer by email: **biscuitstorejs@gmail.com.**

### Changelog
You can see the list of changes [here](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/CHANGELOG.md)

### What is planned
- Before version **1.0.0**, it is planned to get rid of critical bugs if there are any, configure the deployment, and make more coverage with auto-tests.
- In version **1.1.0**, it is planned to add a new middleware **slide**, which will be a more advanced version of the [adapter](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/docs/adapter/ADAPTER.md), and will partially resemble [redux-saga](https://redux-saga.js.org/).
### Adolescence
- The library is still young and is in beta testing, for this reason, you may stumble upon bugs and flaws. Please be constructive and help us make this tool better.
- The developer is not a full-fledged native speaker of English, for this reason, there may be errors and tautologies in the documentation, if you have the opportunity to make the documentation better, then I will be glad of any help.

### License
Copyright (c) 2021 Philipp Zhulev

MIT License ([MIT](https://github.com/biscuit-js/biscuit-store/blob/HEAD/packages/biscuit-store/LICENSE.md)).

