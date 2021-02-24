## Adapter middleware
The **adapter** is a miniature module **(only 450 bytes)** that provides a convenient tool for creating asynchronous managed states.

The CreateAdapter function contains only two methods:
- **adapter.actions** - This method accepts a status name string and a callback function. It is used to create a managed state that can work both synchronously and asynchronously.
- **adapter.connect** - It is used to connect the adapter to the store.

Creating an adapter is extremely simple:
```javascript
import { createAdapter } from "@biscuit-store/adapter";

const adapter = createAdapter();

adapter.action("counter/add", (payload, state, { getAction }) => {
  getAction("counter/prev").dispatch({prev: state.value});
  return { value: state.value + payload.value };
});

adapter.action("counter/clear", (payload, store, { send, getAction }) => {
  send({ value: 0 });
});

export default adapter;
```
action callback returns:
- **payload** - the payload that we transmit from the dispatcher;
- **state** - the current status of the repository;
- **context** - Contains two methods:
- - **send** - It is used for asynchronous data sending and is used instead of synchronous return.;
- - **getAction** - Used to get an action by a string name.

Next, we just need to connect the adapter to our store:
```javascript
import { createStore } from "@biscuit-store/core";
import adapter from "./adapter";

const counterStore = createStore({
  repo: {
    name: "counter",
    initial: { value: 0, prev: 0 }
  },
  states: {
    counterAdd: "counter/add",
    counterClear: "counter/clear"
  },
  middleware: [adapter.connect]
});

export const { counterAdd, counterClear } = counterStore.actions;
```

I recommend using this storage structure when using the adapter:
```
...
store
|____counter
|________index.js
|________adapter.js
...
```

### Learn more
 - [React](/docs/react)