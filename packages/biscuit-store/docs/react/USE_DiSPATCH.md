## useDispatch
The **useDispatch** is a simple hook that takes one or more actions and returns the associated dispatchers.

 ```javascript
import React from "react";
import { useDispatch } from "@biscuit-store/react";
import { addText } from "./store/test";

function Component() {
  const [setText] = useDispatch(addText);

  const handleChange = (e) => {
    setText({ text: e.target.value });
  };

  return (
    <div className={"App"}>
      <input onChange={handleChange} />
    </div>
  );
}
 ```
[![N|Solid](/docs/assets/exemple-button.png)](https://codesandbox.io/s/vigorous-kalam-fyhdc?file=/src/DispatchExample.tsx)

 ## Lern more
 - [useDispatchThrottle](/docs/react/USE_THROTTLE.md)