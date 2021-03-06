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

### Learn more
- [Middleware](/docs/core/MIDDLEWARE.md)