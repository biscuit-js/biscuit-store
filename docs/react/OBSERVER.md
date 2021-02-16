## Observer

Observer is a decorator that serves to subscribe a component to stores and their actions. This function takes as the first parameter the react component, and as the second the list of dependencies, which can consist of one or more store or action.

This is what the standard implementation of the observer component looks like:

```javascript
import React from "react";
import { observer, } from "@biscuit-store/react";
import { counterAdd, counterClear } from "./store/counter";

export const App = observer(
  ({ value }) => {
    return (
      <div className="counter">
        <p>output: {value}</p>
      </div>
    );
  },
  [counterAdd, counterClear]
);
```
The observer collects data from the associated stores and returns it as props.

### Multistore dependencies
Observer supports working with several old ones, that is, you can add several actions related to different stories to the list of dependencies and everything will work fine.

> Still, I recommend thinking through your architecture so that your observer components have as few dependencies as possible.

One of the principles that you should keep in mind is that data from dependencies is collected in turn. Accordingly, if you have several repositories that have objects with the same keys, for example:

```javascript
// storeA {id: 1, name: "A"}
// storeB {data: {...}, name: "B"}

export const Component = observer(
  ({ name }) => {
      console.log(name); // B
      ...
  },
  [storeA, storeB]
);
```
We have a dependency **StoreA** and **StoreB** they contain the same key name. In the component parameters according to the sequence principle, the **name** field from the **StoreB** dependency will fall, since it was the second one.

The same behavior should be taken into account when working with branches.

### Lern more
- [Subscribe](./SUBSCRIBE.md)