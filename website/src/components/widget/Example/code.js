export const firstStep = `import { createStore } from "@biscuit-store/core";
import { adapter } from "./adapter"

const { store, actions } = createStore({
  name: "counter",
  initial: { value: 0 },
  actions: {
    increment: "increment/action",
    decrement: "decrement/action",
  },
  middleware: [adapter]
});

export const counterStore = store;
export const { increment, decrement } = actions;`;

export const twoStep = `import { createAdapter } from "@biscuit-store/adapter";

const { action, connect } = createAdapter();

action("increment/action", ({ payload, state }) => {
    return { value: state.value + 1 };
});

action("decrement/action", ({ payload, state, send }) => {
    send({ value: state.value - 1 });
});

export const adapter = connect;`;

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
