## Listen
The listen method listens to a store or action. If the values of the storage object match the values of the mask object specified in the parameters, then the react component will be manipulated depending on the method called.

```javascript
import { listen } from '@biscuit-store/react';
import { personStore, added } from './store/person';

const Element = ({ name, person }) => {
    return (
        <div>
            {name}_{person.lastName}
        </div>
    );
};

const ListenElement = listen(personStore, { state: true }).render(Element);

export default () => (
    <div className='App'>
        <ListenElement name={'John'} />
        <button
            onClick={() =>
                added.dispatch((prev) => ({
                    state: !prev.state,
                    lastName: 'White',
                }))
            }>
            Create
        </button>
    </div>
);
```
Also, listen returns the associated storage data to the component properties.

> Listen is not able to work with nested objects. It is possible to compare only top-level primitive fields.

#### listen.render
  The render method mounts the component if the mask and storage parameters match, and unmounts it if it does not match.

  ```javascript
  const ListenElement = listen(personStore, { state: true }).render(Element);
  ```

#### listen.replace
The method replaces the component with the specified one if the mask and storage parameters are the same.

```javascript
const ListenElement = listen(personStore, { state: true }).replace(Element, NewElement);
```


#### listen.update
Updating a component when the mask and storage values match.

```javascript
const ListenElement = listen(personStore, { state: true }).update(Element);
```

### Component
The Listen methods always return a higher-order component that has the same set of properties as the original component.

### Learn more
- [useSubscribe](/docs/react/USE_SUBSCRIBE.md)