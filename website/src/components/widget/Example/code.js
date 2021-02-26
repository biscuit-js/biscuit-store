export const firstStep = `import { createStore } from "@biscuit-store/core";
import { adapter } from "./adapter"

const { store, actions } = createStore(
  repo: {
    name: "counter",
    initial: { value: 0 }
  },
  actions: {
    increpent: "increpent/action",
    decrement: "decrement/action",
  },
  middleware: [adapter.connect]
});

export const counterStore = store;
export const { increpent, decrement } = actions;`;

export const twoStep = `import { createAdapter } from "@biscuit-store/adapter";

const adapter = createAdapter();

adapter.action("increment/action", (payload, state) => {
    return { value: state.value + 1 };
});

adapter.action("decrement/action", (payload, state, { send }) => {
    send({ value: state.value - 1 });
});

export adapter;`;

export const last = `import React from "react";
import { observer, useDispatch } from "@biscuit-store/react";
import { increpent, decrement } from "./store/counter";

export const App = observer(
  ({ value }) => {
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
