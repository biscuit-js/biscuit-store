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
[![Edit Biscuit-store/typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/biscuit-storetypescript-fyhdc?fontsize=14&hidenavigation=1&theme=dark)

 ## Learn more
 - [useDispatchThrottle](/docs/react/USE_THROTTLE.md)