export const firstStep = `import { createStore } from "@biscuit-store/core";
import { adapter } from "./adapter"

const { store, actions } = createStore({
  name: "counter",
  initial: { value: 0 },
  actions: {
    increment: "increment/action",
    decrement: "decrement/action",
    clear: "clear/action",
  },
  middleware: [adapter]
});

export const counterStore = store;
export const { increment, decrement, clear } = actions;`;

export const twoStep = `import { createAdapter } from "@biscuit-store/adapter";

const { action, connect } = createAdapter();

action("increment/action", ({ payload, state }) => {
  return { value: state.value + 1 };
});

action("decrement/action", ({ payload, state, send }) => {
  send({ value: state.value - 1 });
});

action("clear/action", ({ state }) => {
  state.value = 0;
});

export const adapter = connect;`;

export const combineActions =
`import { createStore } from "@biscuit-store/core";

export const { store, actions } = createStore({
  name: "counter",
  initial: { value: 0 },
  combineActions: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    clear: (state) => {
      state.value = 0;
    },
  },
  middleware: [adapter]
});

export const { increment, decrement, clear } = actions;`;

export const subscribe = `import React from "react";
import { increment, store } from "./store/counter";

store.subscribe(({ value }) => {
  console.log("count:", value);
});

increment.dispatch().after(() => {
  console.log("incremented")
});
`;

export const last = `import React from "react";
import { observer, useDispatch } from "@biscuit-store/react";
import { increment, decrement } from "./store/counter";

export const App = observer(
  ({ counter }) => {
    const { value } = counter;
    const [add, remove] = useDispatch(increpent, decrement);

    return (
      <div className="counter">
        <p>output: {value}</p>
        <div>
          <button onClick={add}>Add</button>
          <button onClick={remove}>Remove</button>
        </div>
      </div>
    );
  },
  [counterAdd, counterClear]
);`;
