## The principle of creating a duck

1. Create a duck;
2. Tell the duck that it is by definition a duck so it must swim, quack and fly;
3. Teach the duck to swim, quack and fly.
                                      
store.js
``` javascript
import { createStore } from "@biscuit-store/core";
import { adapter } from "./adapter";

// Create a duck
export const { store, actions } = createStore({
  name: "duck",
  initial: { value: "" },
  // Tell the duck that it is by definition a duck 
  // so it must swim, quack and fly
  actions: {
    duckSwim: 'duck/swim',
    duckFly: 'duck/fly',
    duckQuack: 'duck/quack',
  },
  middleware: [adapter]
});
```
adapter.js
``` javascript
import { createAdapter } from "@biscuit-store/adapter";
const { action, connect } = createAdapter();

// Teach the duck to swim, quack and fly.

action('duck/swim', () => {
    return { value: "The duck flew" };
});

action('duck/fly', () => {
    return { value: "the duck swam" };
});

action('duck/quack', ({ payload, state, send }) => {
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