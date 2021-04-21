## Subscribe decorator
Subscribe is a decorator that allows you to bind a set of parameters and dispatchers of your biscuit-store to a component.

**This function will seem extremely similar to [Connect](https://react-redux.js.org/api/connect) from [react-redux](https://react-redux.js.org/). And so it is.**

>Initially, I did not plan to add this feature to the biscuit arsenal, but after careful thought, I came to the conclusion that this functionality fits perfectly into the flexible architecture of biscuit. And also subscribe will allow you to implement biscuit in such an approach as [ARc](https://arc.js.org/).

And so what is a Subscribe?
```javascript
import { subscribe } from "@biscuit-store/react";
import { add } from "./store/hello";


const Component = ({ dispatchAdd, title }) => {
  return (
    <div className="App">
        <p>{title}</p>
    </div>
  );
};

const stateToProps = (state) => {
  const { title } = state.hello;
  return { title };
};

const dispatchToProps = {
  dispatchAdd: add
};

export default subscribe(stateToProps, dispatchToProps)(Component);
```
This is the method that takes:
- **stateToProps** - a function in which you get storage from related actions, extract data from them and pass it to the component in the desired format.
- **dispatchToProps** - this is the object in which you must specify the associated actions. This object has a dual purpose, firstly it is a list of dependencies that the component is subscribed to, and secondly it is a set of dispatchers that will be passed to the component.
- The third parameter is passed via currying to the react component.

This function is perfect for the case when you need to bind multiple repositories with the same parameters to a single component. In this situation, the [Observer](/docs/react/observer) does not behave so obviously.

> It is recommended to use **Subscribe** in specific cases, and if possible, give preference to [Observer](/docs/react/observer).

[![Edit Biscuit-store/typescript](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/biscuit-storetypescript-fyhdc?fontsize=14&hidenavigation=1&theme=dark)

## Learn more
- [Listen](/docs/react/listen))
