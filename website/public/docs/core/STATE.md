## State

State is a behavioral design pattern that allows objects to change behavior depending on their state. From the outside, it seems that the object class has changed.

### Standard pattern of state
In the article [store](/docs/store), I have already described how the state looks under the hood. Let me remind you that this is a field of the states object that has a string name as a key (in the terminology of the biscuit, this is the name of the action), and contains a reference to the repository object. In the standard model of behavior, the state machine takes:
- The name of the action, for searching the state;
- The name of the repository by which the reference to the main repository content will be calculated. 
  
  
Payload is send via a link into the repository content object by concatenation.

> It will also be useful for you to know that if you create two stores that specify an event with the same action name, then two repositories will be written to the object of the same event. This logic is used for optimization.

Here's what it will look like:

```javascript

createStore({
    repo: {
        name: "test-1",
        initial: {}
    },
    actions: {
        add: "add/action"
    }
})

createStore({
    repo: {
        name: "test-2",
        initial: {}
    },
    actions: {
        add: "add/action"
    }
})
```
The state store at this point will look like this:
```
_states:
|____add/action:
|________test-1:
|____________link to object (test-1)
|________test-2:
|____________link to object (test-2)
```

### Branch pattern for the state
In the article about [store](/docs/store), the states converted to branches were already mentioned, and here I will tell you more about them.
In fact, the concept of a branch is very simple. If the normal state is a reference to the repository object. Then the branch is a copy of the repository object in an isolated state.

And if we want to merge a branch with the main repository or, for example, with another branch, then we need to use a special set of methods from the [manager](/docs/manager) constructor.

> This is actually very similar to the branching system in GIT

This is how we can create a branch:
```javascript
...
const testStore = createStore({
    repo: {
        name: "test",
        initial: {}
    },
    actions: {
        sandbox: {
            name: "sandbox/action",
            branch: true,
            initial: { value: 0 }
        },
    }
})

export { add, sandbox } = testStore.actions
export { store } = testStore
```
As you can see, the branch has its initial state, which will be concatenated with a copy of the repository object.

Now let's try to test it:
```javascript
import { sandbox, store } from "./testStore";

store.subscribe((repo) => {
    console.log(repo); // {}
});

sandbox.subscribe((state) => {
    console.log(state); // { value: 1 }
});

sandbox.dispatch({value: 1});
```
There is a quick way to send data from a branch to a repository without using a manager:

```javascript
sandbox.dispatch({value: 1}).merge();
```

Branches can be useful in many cases... For example, if you want to create some versioning, or you just need to store a few sample data.

> Branches are an interesting tool. But I urge you to be careful with it and not use it unnecessarily... Playing with bifurcated States, you can call the paradox of [Schrödinger cat](https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat). =)

Next, we will study manager.

### Learn more
- [Manager](/docs/manager)
