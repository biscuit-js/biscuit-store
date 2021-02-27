## Manager
> For a better understanding of this section, you first need to read the [state](/docs/core/STATE.md) section.

The createManager is a method of the biscuit library API that accepts a branch state action as input and returns a number of methods for working with it.

Example of manager initialization:
```javascript
import { manager } from "@biscuit-store/core";
import { branchAction, customAction } from "./testStore";

const manager =  createManager(branchAction);
manager.mergeState(customAction);
manager.merge();
```
You can find out the manager's methods in the [API section](/docs/API_REFERENCE.md)

> Manager contains a couple of dangerous methods:
> - Clone method - creates a copy of the store. This method is dangerous because it creates a non-obvious copy of the store, which can cause difficulties in maintaining the code.
> - The remove method - removes the store and its copy from all states. I recommend using this method only in one situation, if you need to delete a store with a large amount of data that has become unnecessary for optimization purposes. Illiterate use of this method will lead to non-obvious errors.

### Learn more
- [Middleware](/docs/core/MIDDLEWARE.md)