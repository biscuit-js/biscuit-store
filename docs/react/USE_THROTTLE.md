## useDispatchThrottle
The **useDispatchThrottle** is a simple hook that takes a delay value and one or more actions and returns the associated dispatchers that will be called once in the specified time interval.
```javascript
import React from "react";
import { useDispatchThrottle } from "@biscuit-store/react";
import { addThrottleText } from "./store/test";

function Input() {
  const [setText] = useDispatchThrottle(500, addThrottleText);

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

[![N|Solid](../assets/exemple-button.png)](https://codesandbox.io/s/vigorous-kalam-fyhdc?file=/src/DispatchThrottleExample.tsx)

### Lern more
- [useDispatchDebounce](./USE_DEBOUNCE.md)