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
Observer supports working with multiple stores, meaning you can add several actions related to different stores to the list of dependencies, and everything will work fine.

> Still, I recommend thinking through your architecture so that your observer components have as few dependencies as possible.

#### Sequence principle
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
We have the dependencies ```StoreA``` and ```StoreB```, they contain they contain fields with the identical key ```"name"```. The ```"name"``` field from the StoreB dependency will be included in the component parameters , since it was the second one according to the sequence principle and overwritten the ```"name"``` field from ```StoreA```.

The same behavior should be taken into account when working with branches.

[![N|Solid](/docs/assets/exemple-button.png)](https://codesandbox.io/s/pedantic-rosalind-r3neo?file=/src/index.js)
#### Dependencies are required
Dependencies are necessary for two reasons. First, without them, the component simply does not understand when it needs to be updated. Secondly, the obvious indication of dependencies makes the code more readable, you can always understand what storage or state the component is bound to, and determine what data it accepts.
### Learn more
- [Subscribe](/docs/SUBSCRIBE.md)
