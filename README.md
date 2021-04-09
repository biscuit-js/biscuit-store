# [![biscuit](https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/logo.png)](https://github.com/biscuit-js/biscuit-store)
JavaScript library for application state-management.

[![Build Status](https://img.shields.io/badge/License-MIT-blue)](https://github.com/biscuit-js/biscuit-store/blob/HEAD/LICENSE.md) [![Typescript](https://badgen.net/npm/types/@biscuit-store/core)](https://www.typescriptlang.org/) [![npm version](https://badge.fury.io/js/%40biscuit-store%2Fcore.svg)](https://www.npmjs.com/package/@biscuit-store/core) [![release](https://badgen.net/github/release/biscuit-js/biscuit-store)](https://github.com/biscuit-js/biscuit-store/releases) [![Build Status](https://travis-ci.com/biscuit-js/biscuit-store.svg?branch=master)](https://travis-ci.com/biscuit-js/biscuit-store) [![download](https://badgen.net/npm/dt/@biscuit-store/core)](https://www.npmjs.com/package/@biscuit-store/core)

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40BiscuitJs)](https://twitter.com/BiscuitJs)

[Official library website](https://biscuit-js.org/)

### Description

Biscuit is a modular tool for creating and editing configurable containers for managed states. The goal of the Biscuit-store is to simplify the process of working with states as much as possible, while at the same time providing a consistent architectural approach.

**Advantages:**
- Flexible architecture
- immutable
- Asynchronous out of the box
- React support
- Simple extension with middleware
- Easy debugging

The approach to creating containers in a biscuit is simple and can be described using the example of [creating a duck](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/DUCK_PRINCIPLE.md):
1. Create a duck;
2. Tell the duck that it is by definition a duck so it must swim, quack and fly;
3. Teach the duck to swim, fly and quack.

### Installation

Installation of core files
``` javascript
npm install @biscuit-store/core
```

installing the adapter extension
```javascript 
npm install @biscuit-store/adapter 
```
Installing an extension to share with react
```javascript 
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

### Basic exemple
This example describes the process of creating a repository using the [createStore](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/core/STORE.md) method.

``` javascript
import { createStore } from "@biscuit-store/core";
import { connect } from "./counterAdapter";

const { store, actions } = createStore({
  name: "counter",
  initial: { value: 0 },
  actions: {
    increment: "increment/action",
    decrement: "decrement/action"
  },
  middleware: [connect]
});

const { increment, decrement } = actions;

increment.subscribe(() => {
  console.log("incremented");
})

decrement.subscribe(() => {
  console.log("decremented");
})

store.subscribe(({ value }) => {
  console.log("count:", value);
})

increment.dispatch({value: 1});
```
The [adapter](https://github.com/biscuit-js/biscuit-store/blob/HEAD/docs/adapter/ADAPTER.md) module is used for encapsulated state management.
``` javascript
import { createAdapter } from "@biscuit-store/adapter";
const { action, connect } = createAdapter();

action("increment/action", ({ payload, state }) => {
  state.value += payload.value;
});

action("decrement/action", ({ payload, store }) => {
  state.value -= payload.value;
});

export { connect };
```
[![Edit Biscuit-store/example-javascript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/biscuit-storeexample-javascript-4mp86?fontsize=14&hidenavigation=1&theme=dark)

### Example with combined actions
Combined actions are a way to create a repository with built-in managed states. This approach is ideal for stores with a small logical load.
``` javascript
import { createStore } from "@biscuit-store/core";

const { actions } = createStore({
  name: "counter",
  initial: { value: 0 },
  combineActions: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  }
});

const { increment, decrement } = actions;

increment.dispatch().before(({ value }) => {
   console.log("count:", value);
});
```
[![Edit Biscuit-store/example-javascript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/biscuit-storeexample-javascript-4mp86?fontsize=14&hidenavigation=1&theme=dark)

### Some more examples
- [Asynchronous data fetching](https://codesandbox.io/s/biscuit-storeasynchronous-data-fetching-vce5e?file=/src/store/counter/adapter.js)
- [Application of dispatch methods](https://codesandbox.io/s/biscuit-storedispatch-after-example-lzceg)
- [Typescript example](https://codesandbox.io/s/biscuit-storetypescript-fyhdc)
- [Todo list](https://codesandbox.io/s/biscuit-storetodo-list-eh2ld)
- [Adapter functions](https://codesandbox.io/s/biscuit-store-9pipt)
- [Listen](https://codesandbox.io/s/biscuit-store-javascript-74pfo)

### Tested in browsers

| Platform | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/chrome.svg" width=25px alt="chrome" />  | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/explorer.svg" width=25px alt="ie" />  | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/opera.svg" width=25px alt="opera" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/mozilla.svg" width=25px alt="ff" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/safari.svg" width=25px alt="safari" /> |
|----------|:--------:|:-----:|:-------:|:---------:|:--------:|
| **Version**  | 48+    | 11+ | 25+   | 40+     | 9+     |
| **Checked**  | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> | <img src="https://raw.githubusercontent.com/biscuit-js/biscuit-store/HEAD/docs/assets/check.svg" style="margin-top: 6px" width=18px alt="chrome" /> |

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

