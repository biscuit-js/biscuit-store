## The principle of creating a duck

1. Create a duck;
2. Show the duck she it is a duck, because it can swim, fly and quack;
3. Teach the duck to swim, fly and quack.
                                      
store.js
``` javascript
import { createStore } from "@biscuit-store/core";
import { adapter } from "./adapter";

// Create a duck
const { store, actions } = createStore({
  name: "counter",
  initial: { value: "" },
  // Show the duck she it is a duck, because it can swim, fly and quack
  actions: {
    duckSwim: 'duck/swim',
    duckFly: 'duck/fly',
    duckQuack: 'duck/quack',
  },
  middleware: [adapter]
});

export store;
export actions;
```
adapter.js
``` javascript
import { createAdapter } from "@biscuit-store/adapter";
const { action, connect } = createAdapter();

// Teach the duck to swim, fly and quack.

action('duck/swim', () => {
    return { value: "The duck flew" };
});

action('duck/fly', () => {
    return { value: "the duck swam" };
});

action('duck/quack', (payload, state, { send }) => {
    return { value: "duck quacks" };
});

export const adapter = connect;
```
script.js
``` javascript
import { actions, store } from './store'
const { duckQuack } = actions;

store.subscribe((state) => {
    console.log(state.value); // "duck quacks"
})

duckQuack.dispatch();

```