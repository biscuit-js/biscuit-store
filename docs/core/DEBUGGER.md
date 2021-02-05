## Debugger
The biscuit-store has a built-in function for multi-level, external log output.
```javascript
import { createStore } from "@biscuit-store/core";

export const { actions, store } = createStore({
    repo: {
        name: "myFirstStore",
        initial: { value: 0 }
    },
    states: {
        hello: "HELLO/ACTION",
    }, 
    debugger: (e) => {
        console.log(e.message); 
        // 'Biscuit log: dispatch -> store: myFirstStore, state: HELLO/ACTION'
    }
});

actions.hello.dispatch({value: 1});
```
There are two types of biscuit logs: local and global. Local logs are informational messages, errors and warnings that relate specifically to this store. Global, these are general messages, such as storage creation level errors.

### Debuger context
A debugger context is a set of fields returned by the debugger callback function.

| name    | description                                                            | type   |
|---------|------------------------------------------------------------------------|--------|
| message | Log message                                                            | string |
| file    | The file where the event that generated the log occurred. (test field) | string |
| level   | Log level [ local \| global ]                                          | string |
| type    | Log type [ log \| warning \| error ]                                   | object |

### Dynamic debugger
You can add a debugger function to an existing store anywhere in the application using the composite method.
```javascript
import { createDebuger } from "@biscuit-store/core";

createDebuger(store, (e) => {
    if(e.type === "error) {
        throw new CunstomError(e.message);
    }
});
```
Congratulations! Now you have a better understanding of how debugger work in Biscuit.

### Lern more
- [State](./core/STATE.md)