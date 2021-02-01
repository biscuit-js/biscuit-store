## Store
In this section, we will look at how stores are created in biscuit.

### Concept
If you have previously used [Redux](https://redux.js.org/), then you are used to the fact that you have one store for the entire application. On the contrary, the Biscuit-store encourages the creation of multiple stores for different abstract segments of your application.

At the same time, you should understand that creating a store, for example, through the createStore method, is in fact an abstraction. In fact, all the stores are in the same object.

It will also be useful for you to know that the state entity is also stored in a separate object and refers to the object with the repository data.

![N|Solid](../../docs/assets/store.png)

It is also worth mentioning that in the biscuit-store there is such a thing as a state-branch. 

*"State-branch is a state branched from a repository with isolated data".*

If a state-branch is created, a copy of the repository data object is created in the state, not a reference to it.

### How do I create a store?

There are two ways to create a new store...

### Creating a store using the createStore method (Monolithic method)
The first method, (Recommended) you've already seen it in the get started section. This is a monolithic createStore method:

```javascript
import { createStore } from "@biscuit-store/core";
import { middleFunc } from "./middleware.js";

const helloStore = createStore({
    repo: {
        name: "hello",
        initial: { value: 0 }
    },
    states: {
        increment: "INCREMENT/ACTION",
        decrement: "DECREMENT/ACTION",
        save: {
            name: "SAVE/ACTION",
            branch: true,
            initial: { version : 0 }
        },
    }, 
    middleware: [middleFunc],
    debugger: (e) => {
        console.log(e);
    },
    strictMode: true,
});

export const { store } = helloStore;
export const { increment, decrement, save } = helloStore.actions;
```
let's take a closer look at the fields of this method in more detail:

| field      | description                                                                                                                                                                                            | type                                  | default   | require |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|-----------|---------|
| repo       | This field is required to create a repository.  Contains the name of the repository and the original data.                                                                                             | object{name: string, initial: object} | undefined | yes     |
| states     | This field must contain a set of states in the format key-value.  Key is the name of the variable that you want to get in the end,  and value is the status name string, usually written in uppercase. | object{[prop]: string \| object}      | undefined | no      |
| middleware | This is an array of middleware functions.  The callback of such a function returns two arguments:  the first is the context and the second is the sending function.                                    | array[function(callback)]             | undefined | no      |
| debugger   | This field must contain a function that will return the log.                                                                                                                                           | function(callback)                    | undefined | no      |
| strictMode | When StrictMode is enabled, you will receive warnings. For example when you have a dispatch but no subscribe                                                                                           | boolean                               | true      | no      |


Description for the status object:
| field   | description                                                      | type    | default   | require |
|---------|------------------------------------------------------------------|---------|-----------|---------|
| name    | State name, see the recommendations for the format above.        | string  | undefined | yes     |
| branch  | This field defines. whether this branch is isolated.             | boolean | false     | no      |
| initial | The source data of the branch, only needed for the state-branch. | object  | {}        | no      |

Now we know how to create a store using the createStore method.

### Composite way to create store
The composite method is the ability to create a store using multiple methods. The advantage of this approach is that you can distribute the storage segments to different files. the downside is the lack of a unified approach.

```javascript
import { 
    newRepo, 
    createStateTo, 
    middleware, 
    createDebuger 
} from "@biscuit-store/core";
import { middleFunc } from "./middleware.js";

export const store = newRepo("hello", { value: 0 });

const createAction = createStateTo(store)

export const increment = createAction.bind("INCREMENT/ACTION");
export const decriment = createAction.bind("DECREMENT/ACTION");
export const save = createAction.bind("SAVE/ACTION", {
    branch: true, 
    initial: {
        version: 0
    }
});

middleware(store).add(middleFunc);

createDebuger(store, (e) => {
    console.log(e);
});
```
You can get acquainted with composite methods [here](https://redux.js.org/).

### Dynamic capabilities

Composite methods have an interesting feature. You can use them to dynamically supplement the store.

For example, using the createStateTo method, you can dynamically create a state from anywhere in the application.

> *I do not recommend doing this without thinking in advance, Because I believe that the states should be stored in one place, otherwise it will lead to difficulties > in supporting the code.*

Nevertheless, we can imagine a situation when, for example, a set of data comes from the server and based on them we need to create a new state.

```javascript
const helloStore = createStore({
    repo: {
        name: "hello",
        initial: { value: 0 }
    },
    states: {
        increment: "INCREMENT/ACTION",
    }, 
});

export const decrement = 
    createStateTo(helloStore.store).bind("DECREMENT/ACTION");

export const { store } = helloStore;
export const { increment } = helloStore.actions;
```

Congratulations! Now you have a better understanding of how stores work in Biscuit. Keep learning...

### Learn more
 - [Dispatch](./core/DISPATCH.md)
 - [Subscribe](./core/SUBSCRIBE.md)
