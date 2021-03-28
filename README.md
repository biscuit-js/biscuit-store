# [![biscuit](https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/logo.png)](https://github.com/biscuit-js/biscuit-store)
JavaScript library for application state-management.

[![Build Status](https://img.shields.io/badge/License-MIT-blue)](https://github.com/biscuit-js/biscuit-store/blob/HEAD/LICENSE.md) [![Typescript](https://badgen.net/npm/types/@biscuit-store/core)](https://www.typescriptlang.org/) [![npm version](https://badge.fury.io/js/%40biscuit-store%2Fcore.svg)](https://www.npmjs.com/package/@biscuit-store/core) [![release](https://badgen.net/github/release/biscuit-js/biscuit-store)](https://github.com/biscuit-js/biscuit-store/releases) [![Build Status](https://travis-ci.com/biscuit-js/biscuit-store.svg?branch=master)](https://travis-ci.com/biscuit-js/biscuit-store) [![download](https://badgen.net/npm/dt/@biscuit-store/core)](https://www.npmjs.com/package/@biscuit-store/core)

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40BiscuitJs)](https://twitter.com/BiscuitJs)

[**Official library website**](https://biscuit-js.org/)

### Description

Biscuit allows you to organize predictable state containers in your javascript applications and easily manage them with an extensive set of tools. Intuitive patterns of this library will allow you not to spend on the organization of complex logistics, and will focus on the business logic of your project.

The approach to creating containers in a biscuit is simple and can be described using the example of [creating a duck](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/DUCK_PRINCIPLE.md):
1. Create a duck;
2. Tell the duck that it is by definition a duck so it must swim, quack and fly;
3. Teach the duck to swim, fly and quack.

**Advantages:**
- Flexible architecture
- Asynchronous out of the box
- React support
- Simple extension with middleware
- Easy debugging

**Developer of the biscuit-store:**
> Initially, I created this library for use in my projects. The idea was to create a states-machine that will combine a number of functions that I lack in other similar tools, as well as to simplify the process of creating repositories and their support. After receiving a number of positive feedback from colleagues, I decided to share this project with the general public.
> 
**Tested in browsers**

| Platform | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/chrome.svg" width=25px alt="chrome" />  | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/explorer.svg" width=25px alt="ie" />  | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/opera.svg" width=25px alt="opera" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/mozilla.svg" width=25px alt="ff" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/safari.svg" width=25px alt="safari" /> |
|----------|:--------:|:-----:|:-------:|:---------:|:--------:|
| **Version**  | 48+    | 11+ | 25+   | 40+     | 9+     |
| **Checked**  | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> |

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

- [Get started](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/GET_STARTED.md)
- [Store](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/STORE.md)
- [Subscribe](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/SUBSCRIBE.md)
- [State](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/STATE.md)
- [Manager](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/MANAGER.md)
- [Middleware](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/MIDDLEWARE.md)
- [Debugger](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/DEBUGGER.md)
- [Adapter](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/adapter/ADAPTER.md)
- [React](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/react/REACT.md)

### Help
- [Recommendations](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/RECOMMENDATIONS.md)
- [API Reference](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/API_REFERENCE.md)
- [Dictionary](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/DICTIONARY.md)

--------

### What's new
**Update 1.1.0** introduced several major changes to the behavior of the adapter and react modules. New features have also been added:
- **Core**
- - [**container**](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/API_REFERENCE.md#container) - Allows you to store actions in an isolated container.
- - [**initialCall**](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/STORE.md#creating-a-store-using-the-createstore-method-monolithic) - A field in createStore that allows you to run an asynchronous method when initializing the storage and write the result to the storage.
- **Adapter**
- - [**includeContext**](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/adapter/ADAPTER.md#context-modification) - Allows you to write parameters to the adapter context
- **React**
- - [**listen**](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/react/LISTEN.md) - The listen method listens to a store or action. If the values of the storage object match the values of the mask object specified in the parameters, then the react component will be manipulated depending on the method called.

### Basic exemple
The easiest way to create a new store is to use the [createStore](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/STORE.md) function. The function accepts a set of parameters that can consist of the fields initial, name, actions, middleware and debug. name and initial is a required fields.

store/counter/index.js
``` javascript
import { createStore } from "@biscuit-store/core";

// Creating a new store
const { store, actions } = createStore({
  name: "counter",
  initial: { value: 0 },
  actions: {
    counterAdd: "counter/add"
  }
});

// Exporting store and actions
export const { counterAdd } = actions;
export { store };
```
Next, we import the actions and store to the desired file. To subscribe to the store, we use the [subscribe](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/SUBSCRIBE.md#creating-a-subscription) method, and to send the status, we use the [dispatch](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/SUBSCRIBE.md#Dispatch) method.

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
[![N|Solid](https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/exemple-button.png)](https://codesandbox.io/s/biscuit-storeexample-javascript-4mp86?file=/src/index.js)


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
const { action, connect } = createAdapter();

// Create action
action("counter/add", ({ payload, state }) => {
  return { ...payload, value: state.value + 1 };
});

// You should also know that Biscuit out of the box is asynchronous.
// this means that you can use asynchronous capabilities in the adapter.
action("counter/clear", ({ payload, store, send }) => {
  send({ value: 0 });
});

// Exporting our adapter
export const adapter = connect;
```

Next, connect our adapter to the store via the middleware field.

store/counter/index.js
``` javascript
import { createStore } from "@biscuit-store/core";
import { adapter } from "./adapter";

const { store, actions } = createStore({
  name: "counter",
  initial: { value: 0 },
  actions: {
    counterAdd: "counter/add",
    counterClear: "counter/clear"
  },
  // Here we can connect as many middleware functions
  // as we want by specifying them in the array
  middleware: [adapter]
});

export const { counterAdd, counterClear } = actions;
export const counterStore = store;
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
  ({ counter }) => {
    const { value } = counter;
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
[![N|Solid](https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/exemple-button.png)](https://codesandbox.io/s/biscuit-storeexample-react-r3neo?file=/src/index.js)

### Some more examples
- [Asynchronous data fetching](https://codesandbox.io/s/biscuit-storeasynchronous-data-fetching-vce5e?file=/src/store/counter/adapter.js)
- [Application of dispatch methods](https://codesandbox.io/s/biscuit-storedispatch-after-example-lzceg)
- [Typescript example](https://codesandbox.io/s/biscuit-storetypescript-fyhdc)
- [Todo list](https://codesandbox.io/s/biscuit-storetodo-list-eh2ld)
- [Adapter functions](https://codesandbox.io/s/biscuit-store-9pipt)

### Contributing
If you liked the library, you have many ways to help it develop. 
- You can write about the biscuit-store on various forums;
- Put a star on github;
- Write about the bugs found and suggest improvements;
- Participate in the development, offer your pull request;
- Or you can just help financially; 
  
The rules of assistance can be found [here](https://github.com/biscuit-js/biscuit-store/blob/HEAD/CONTRIBUTING.md).

### Donate
Any financial help will help the biscuit to become better.

<a href="https://www.buymeacoffee.com/biscuitstore" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width=220px alt="Buy Me A Coffee" ></a>

### Inspiration
The idea of developing this library was inspired by the [Redux](https://redux.js.org/) project. During the introduction to the biscuit-store, you will see several patterns that are similar to the concepts of [Redux](https://redux.js.org/). *Nevertheless, biscuit is a separate library that uses completely different architectural principles.*

### Feedback
If you have any questions, suggestions, comments, suggestions for cooperation, or if you like the library and want to become a sponsor, please contact the developer by email: **biscuitstorejs@gmail.com.**

### Changelog
You can see the list of changes [here](https://github.com/biscuit-js/biscuit-store/blob/HEAD/CHANGELOG.md)

### What is planned
- In version **1.1.0**, it is planned to add a new middleware **slide**, which will be a more advanced version of the [adapter](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/adapter/ADAPTER.md), and will partially resemble [redux-saga](https://redux-saga.js.org/).
### Adolescence
- The library is still young and is in beta testing, for this reason, you may stumble upon bugs and flaws. Please be constructive and help us make this tool better.
- The developer is not a full-fledged native speaker of English, for this reason, there may be errors and tautologies in the documentation, if you have the opportunity to make the documentation better, then I will be glad of any help.

### License
Copyright (c) 2021 Philipp Zhulev

MIT License ([MIT](https://github.com/biscuit-js/biscuit-store/blob/HEAD/LICENSE.md)).

