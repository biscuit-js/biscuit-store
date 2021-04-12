## useSubscribe
The useSubscribe is a hook for the react functional component that allows you to subscribe to a store or action.

The first parameter of the hook is the action or store. In the second parameter, you can use a boolean value to tell the hook whether to update the component.
> Disabling the update can be useful in a situation where your useSubscribe is implemented inside the Observer component that already provides the update. This will help you avoid unnecessary redraws.

The hook returns the current data object of the store and the state dispatcher.

example:
```javascript
import { useSubscribe } from "@biscuit-store/react";
import { counter } from "./store/test";

export default function Component() {
  const [state, setState] = useSubscribe(counter);

  const handleClick = () => {
    setState((prev) => ({ value: prev.value + 1 }));
  };

  return (
    <div className="App">
      <p>Clicked: {state.value}</p>
      <button onClick={handleClick}>Click me!</button>
    </div>
  );
}
```
Example with disabled state:
```javascript
const [state, setState] = useSubscribe(counter, false);
```
[![Edit Biscuit-store/typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/biscuit-storetypescript-fyhdc?fontsize=14&hidenavigation=1&theme=dark)
### Learn more
- [useDispatch](/docs/react/USE_DiSPATCH.md)