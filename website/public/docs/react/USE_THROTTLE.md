## useDispatchThrottle
The **useDispatchThrottle** is a simple hook that takes a delay value and one or more actions and returns the associated dispatchers that will be called once in the specified time interval.
```javascript
import React from "react";
import { useDispatchThrottle } from "@biscuit-store/react";
import { addThrottleText } from "./store/test";

function Input() {
  const setText = useDispatchThrottle(addThrottleText, 500);

  const handleChange = (e) => {
   setText({ throttleText: e.currentTarget.value });
  };

  return (
    <div className={"App"}>
      <input onKeyUp={handleChange} />
    </div>
  );
}
```
Learn more about [throttle](https://javascript.info/task/throttle)

[![Edit Biscuit-store/typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/biscuit-storetypescript-fyhdc?fontsize=14&hidenavigation=1&theme=dark)

### Learn more
- [useDispatchDebounce](/docs/react/debounce)