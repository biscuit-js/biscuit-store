## Adapter
The **adapter** is a miniature module that provides a convenient tool for creating asynchronous managed states.

The CreateAdapter function contains methods:
- **adapter.actions** - This method accepts a action name string and a callback function. It is used to create a managed state that can work both synchronously and asynchronously.
- **adapter.connect** - It is used to connect the adapter to the store.
- **adapter.call** - Calls an asynchronous function and handler. **Available from version 0.9.97**
- **adapter.makeChannel** - Creates a channel for communication between actions. **Available from version 0.9.97**

Creating an adapter is extremely simple:
```javascript
import { createAdapter } from "@biscuit-store/adapter";
const { action, connect } = createAdapter();

action("counter/add", (payload, state, { getAction }) => {
  getAction("counter/prev").dispatch({prev: state.value});
  return { value: state.value + payload.value };
});

action("counter/clear", (payload, store, { send, getAction }) => {
  send({ value: 0 });
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
import { createAdapter } from '@ibscuit-store/adapter';
const { call, connect } = createAdapter();

const fetchFunc = async (payload) => {
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
import { createAdapter } from '../../../packages/adapter';
const { makeChannel, action, connect } = createAdapter();

const chan = makeChannel();

action('test/include', (payload) => {
    chan.include(payload);
    return {};
});

action('test/execute', async (payload) => {
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

I recommend using this storage structure when using the adapter:

```
store
|____counter
|________index.js
|________adapter.js
```

### Learn more
 - [React](/docs/react/REACT.md)