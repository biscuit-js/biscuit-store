## useDispatchDebounce
The **useDispatchDebounce** is a simple hook that takes a delay value and one or more actions and returns the associated dispatchers that will be called with a delay in the specified time interval.

```javascript
import React from "react";
import { useDispatchDebounce } from "@biscuit-store/react";
import { addDebounceText } from "./store/test";

function Input() {
  const setText = useDispatchDebounce(addDebounceText, 500, true);

  const handleChange = (e) => {
    if (e.target) {
      setText({ debounceText: e.currentTarget.value });
    }
  };

  return (
    <div className={"App"}>
      <input onKeyUp={handleChange} />
    </div>
  );
}
```
Learn more about [debounce](https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086#:~:text=A%20debounce%20is%20a%20cousin,to%20fetch%20typeahead%20search%20results.)

[![Edit Biscuit-store/typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/biscuit-storetypescript-fyhdc?fontsize=14&hidenavigation=1&theme=dark)
