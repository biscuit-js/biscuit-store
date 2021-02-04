## Recommendations
This section contains several recommendations that can help reduce the level of entropy when developing using the Biscuit-store library.

#### Biscuit provides for the use of many stores
If you have previously used [Redux](https://redux.js.org/), then you are used to the fact that you have one store for the entire application. On the contrary, the Biscuit-store encourages the creation of multiple stores for different abstract segments of your application.

For example, you have an abstract User application module. This module must be able to receive, create, modify, and delete users. And you also have an authentication module that can do login and logout. It would be more correct to divide these two modules into separate stores.

```
...
store
|____user
|________index.js
|________adapter.js
|____auth
|________index.js
|________adapter.js
...
```

./store/user/index.js
```javascript
import { createStore } from "@biscuit-store/core";
import { adapter } from "./adapter.js";

const userStore = createStore({
    repo: {
        name: "user",
        initial: { 
            user: {
                name: "",
                email: "",
                id: 0
            } 
        }
    },
    states: {
        getUser: "USER/GET",
        addUser: "USER/ADD",
        addChange: "USER/CHANGE",
        addRemove: "USER/REMOVE",
    }, 
    middleware: [adapter],
});

export const { store } = userStore;
export const { 
    getUser, 
    addUser, 
    addChange, 
    addRemove 
} = userStore.actions;
```
./store/user/adapter.js
``` javascript
import { createAdapter } from "@biscuit-store/adapter";

const adapter = createAdapter();

adapter.action("USER/GET",, (payload, state, send) => {
    ...
});

adapter.action("USER/ADD", (payload, state, send) => {
    ...
});

...

export adapter;
```
We do about the same thing for the authentication repository...

#### Store structure
You can define the storage architecture for your project yourself. However, I recommend using this approach:

```
...
components
service
store
|____user
|________index.js
|________adapter.js
|____auth
|________index.js
|________adapter.js
|____tasks
|________index.js
|________adapter.js
utils
...
```
With this approach, you will get a structured set of repositories that will be located in one place.

#### Action name
Biscuit supports any string the name of the action. Nevertheless, I recommend to maintain uniformity in the community to adhere to this format  **"MODULE/ACTION"** for example **"USER/GET"**

#### Encapsulate the state logic
Try to keep as little logic as possible in the components of your application. Keep the logic in manageable states. This will help to separate view and model as much as possible. This has a positive impact on the experience of developing and further supporting the application.

#### Use dynamic state creation only where you really need it.
If you have already studied the documentation, you know that biscuit supports dynamic state creation:
```javaScript
const actionName = createStateTo(store).bind("MODULE/ACTION");
```
Don't use dynamic state creation unless you really need to. For better code readability, all states should be declared in one place.

This method will be useful to use in a situation where, for example, you need to generate a state depending on the data received from the server.

#### Do not use branch without the need
If you have already studied the documentation, you know that biscuit can make states independent of the storage object (Conversions to a branch):
```javascript
createStore({
    repo: {
        name: "user",
        initial: {...}
    },
    states: {
        userBranch: {
            name: "USER/BRANCH",
            branch: true,
            initial: {...}
        },
    }
});
```
Do not convert states to branches unless there is a reason to do so. Branches are more complex to maintain and will require more code to be written.

#### Don't make nested subscriptions
You should not make subscribers nested in each other. This will most likely lead to memory leaks and errors.
```javascript
// don't do this
store.subscribe(() => {
    action.subscribe(() => {
        ...
    });
}));
```
#### The open/close principle
No need to try to change the state directly. You should only modify the states through the dispatch method.

#### To get the state, use getState or getRepo
To get the state, you have the getSate method, and you can also get the data via the getRepo or store.get method