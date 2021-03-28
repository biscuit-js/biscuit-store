## Observer

Observer is a decorator that serves to subscribe a component to stores and their actions. This function takes as the first parameter the react component, and as the second the list of dependencies, which can consist of one or more store or action.

This is what the standard implementation of the observer component looks like:

```javascript
import React from "react";
import { observer, } from "@biscuit-store/react";
import { counterAdd, counterClear } from "./store/counter";

export const App = observer(
  ({ counter }) => {
    const { value } = counter;
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

[![N|Solid](/docs/assets/exemple-button.png)](https://codesandbox.io/s/pedantic-rosalind-r3neo?file=/src/index.js)
#### Dependencies are required
Dependencies are necessary for two reasons. First, without them, the component simply does not understand when it needs to be updated. Secondly, the obvious indication of dependencies makes the code more readable, you can always understand what storage or state the component is bound to, and determine what data it accepts.
### Learn more
- [Subscribe](/docs/react/subscribe)
