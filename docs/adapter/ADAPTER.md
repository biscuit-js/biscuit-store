## Adapter
The **adapter** is a miniature module that provides a convenient tool for creating asynchronous managed states.

The CreateAdapter function contains methods:
- **adapter.actions** - This method accepts a action name string and a callback function. It is used to create a managed state that can work both synchronously and asynchronously.
- **adapter.connect** - It is used to connect the adapter to the store.
- **adapter.call** - Calls an asynchronous function and handler. **Available from version 0.9.97**
- **adapter.makeChannel** - Creates a channel for communication between actions. **Available from version 0.9.97**
- **adapter.includeContext** - Allows you to include the dataset in the adapter context. **Available from version 1.1.0**
- **adapter.race** - This method implements the logic identical to promise.race. **Available from version 1.2.0**
- **adapter.all** - This method implements the logic identical to promise.all. **Available from version 1.2.0**
- **adapter.debounce** - This method allows you to call an action with the debounce effect. **Available from version 1.2.0**
- **adapter.throttle** - This method allows you to call an action with the throttle effect. **Available from version 1.2.0**
  
Creating an adapter is extremely simple:
```javascript
import { createAdapter } from "@biscuit-store/adapter";
const { action, connect } = createAdapter();

action("counter/increment", ({ payload, state }) => {
  return { value: state.value + payload.value };
});

action("counter/decrement", ({ payload, state }) => {
  send({ value: state.value - payload.value });
});

action("counter/clear", ({ state }) => {
  state.value = 0;
});

export const adapter = connect;
```
action callback returns:
- **payload** - the payload that we transmit from the dispatcher;
- **state** - the current status of the store;
- **context** - Contains two methods:
- - **send** - It is used for asynchronous data sending and is used instead of synchronous return.;
- - **getAction** - Used to get an action by a string name.

Next, we just need to connect the adapter to our store:
```javascript
import { createStore } from "@biscuit-store/core";
import adapter from "./adapter";

export const { store, actions } = createStore({
  name: "counter",
  initial: { value: 0, prev: 0 },
  actions: {
    counterAdd: "counter/add",
    counterClear: "counter/clear"
  },
  middleware: [adapter]
});
```
### Calling asynchronous functions
> available from version 0.9.97

The call method allows you to call an asynchronous function and send its response directly to the state.

example:
```javascript
import { createAdapter } from '@biscuit-store/adapter';
const { call, connect } = createAdapter();

const fetchFunc = async ({ payload }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(payload);
        }, 5000);
    });
};

// the third parameter is an optional 
// data processing function from the asynchronous method.
call('test/fetch', fetchFunc, (data) => {
  return data
});

export const adapter = connect;
```

### Using channels
> available from version 0.9.97

A channel is a means of communication between actions. You can put data from one action in the channel and pick it up in another. in this case, the action is blocked until the data appears in the channel.

the channel is created using the method **adapter.makeChannel**

The makeChannel function contains only two methods:
- **chan.include** - It is used to include data in the channel
- **chan.extract** - It is used to receive data from the channel, and can also accept a payload that will be merged with the received data. 

example:
```javascript
import { createAdapter } from '@biscuit-store/adapter';
const { makeChannel, action, connect } = createAdapter();

const chan = makeChannel();

action('test/include', ({ payload }) => {
    chan.include(payload);
    return {};
});

action('test/execute', async ({ payload }) => {
    return await chan.extract(payload);
});

export const adapter = connect;
```
Now when the 'test/execute' action is called, it will lock at the middleware level and wait until the 'test/include' action puts the data in the channel.
```javascript
testExecute.subscribe((state) => {
    console.log(state); // { data: 'box', title: 'delivered' }
});

setTimeout(() => {
    testInclude.dispatch({ data: 'box' });
}, 2000);

testExecute.dispatch({ title: 'delivered' });
```

### Context modification
> available from version 1.1.0
>
**IncludeContext** method allows you to include the dataset in the adapter. Context can get data from asynchronous asynchronous function.

example:
```javascript
import { createAdapter } from "@biscuit-store/adapter";
import { container } from '@biscuit-store/core';
const { action, connect, includeContext } = createAdapter();

includeContext(() => container.extract('counter'));

action("counter/add", ({ payload, state, info }) => {
  info.dispatch({info: "iteration"});
  return { value: state.value + payload.value };
});

action("counter/info", ({ payload, store }) => {
  console.log(payload.info);
  return {}
});

export const adapter = connect;
```
In this case, we write a set of actions received from the container to the adapter context.
```javascript
import { createStore, container } from "@biscuit-store/core";
import adapter from "./adapter";

export const { store, actions } = createStore({
  name: "counter",
  initial: { value: 0, info: "" },
  actions: {
    counterAdd: "counter/add",
    counterClear: "counter/clear",
    info: "counter/info"
  },
  middleware: [adapter]
});

container.include(actions);
```

### Debounce and throttle
Throttling and debouncing are widely used techniques to increase 
the performance of code that is executed repeatedly with some frequency.
```javascript
  const { debounce } = createAdapter();

	debounce(
		'add/action', ({ payload, state, send }) => {
			send({ value: state.value + payload.value });
  }, 200, false);
```

```javascript
  const { throttle } = createAdapter();

	throttle(
		'add/action', ({ payload, state, send }) => {
			send({ value: state.value + payload.value });
  }, 200);
```

### Debounce and throttle
Throttling and debouncing are widely used techniques to increase 
the performance of code that is executed repeatedly with some frequency.
```javascript
const { debounce } = createAdapter();

debounce('fetch/action', ({ payload, state, send }) => {
    send({ value: state.value + payload.value });
}, 200, false);
```
Time effects functions, do not know how to work with mutable fields and returns. the send method is used for transmitting data.
```javascript
const { throttle } = createAdapter();

throttle('fetch/action', ({ payload, state, send }) => {
    send({ value: state.value + payload.value });
}, 200);
```

### All and race
The atomic methods all and race are identical in functionality to the Promise.all and Promise.race methods.
```javascript
const { race, all } = createAdapter();

race('race/action', (result) => {
    return { value: result.data };
}, [promise1, promise2, promise3]);

all('all/action', (result) => {
    return { value: result.data };
}, [promise1, promise2, promise3]);
```
The methods take the action name, the handler function, and the promise array.

### Structure
I recommend using this storage structure when using the adapter:

```
store
|____counter
|________index.js
|________adapter.js
```

### Learn more
 - [React](/docs/react/REACT.md)