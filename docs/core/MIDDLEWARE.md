## Middleware
Middleware is a biscuit-store asynchronously layer capable of processing a function or set of functions in the interval between receiving the payload and sending the data to the store.

![N|Solid](/docs/assets/middleware.png)

### Adding middleware to the store
Adding middleware to the store is extremely simple:
```javascript
import { createStore } from "@biscuit-store/core";

function sayHelo(ctx, next) {
    if(ctx.payload.message === "Hi, biscuit!") {
        console.log("Helo developer!");
    }
    next();
}

const { actions } = createStore({
    repo: {
        name: "test",
        initial: { message: "" }
    },
    actions: { say: "SAY/ACTION" }, 
    middleware: [sayHello],
});

actions.say.dispatch({message: "Hi, biscuit!"});
```
Isn't it very simple?

The middleware callback function contains only two methods: The first is a context containing a set of storage and state parameters, the second is a method that tells the loop to run the next middleware function, or to terminate. Updated data is also transmitted through this method.

**Middleware context:**
| name      | description                    | type   |
|-----------|--------------------------------|--------|
| action    | Action name.                   | string |
| repo      | Repo/store name .              | string |
| payload   | Payload data.                  | object |
| state     | The data of the current state. | object |
| getAction | Returns the store action by name. | function |

This small set of parameters should be enough to implement various functions.

### Dynamic adding middleware
You can also dynamically add middleware functions to the store:
```javascript
import { middleware } from "@biscuit-store/core";
...
middleware(store).add((ctx, next) => {
    ...
});
```
This can be useful in certain situations. But it's better to keep your middleware functions in one place.

### Dispatch in middleware
There is nothing stopping you from doing asynchronous sending directly from the middleware function.
```javascript
import { createStore, dispatch } from "@biscuit-store/core";

function fetchFunc(ctx, next) {
  if (ctx.action === "FETCH/ACTION") {
    fetch("https://jsonplaceholder.typicode.com/todos/" + ctx.payload.id)
      .then((res) => res.json())
      .then((res) => {
        dispatch(ctx.getAction("SUCCESS/ACTION"), { data: res });
      })
      .catch((e) => {
        console.log(e);
        dispatch(ctx.getAction("ERROR/ACTION"), { error: e.message });
      })
      .finally(() => {
        next();
      });
  } else {
    next();
  }
}

const testStore = createStore({
  repo: {
    name: "test",
    initial: { id: 0, data: {}, error: null }
  },
  actions: {
    fetch: "FETCH/ACTION",
    success: "SUCCESS/ACTION",
    error: "ERROR/ACTION"
  },
  middleware: [fetchFunc]
});

const { fetch, success, error } = testStore.actions;
const { store } = testStore;


fetch.dispatch({ id: 1 });

success.subscribe((state) => {
  console.log(state.data);
  document.getElementById("root").innerHTML = state.data.title;
});

error.subscribe((state) => {
  console.log(state.error);
});

```
[![N|Solid](/docs/assets/exemple-button.png)](https://codesandbox.io/s/recursing-bird-vdbv2?file=/src/store/counter/service.js)

Congratulations! Now you have a better understanding of how middleware work in Biscuit.

### Learn more
 - [Debugger](/docs/core/DEBUGGER.md)