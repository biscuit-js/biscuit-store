## State and store subscribe 
The subscription system is required to get the current state of the storage at the time of the update. Traditionally, the subscription pattern consists of the function of subscribing, unsubscribing and dispatcher, Biscuit adheres to this concept.

### Concept
Conceptually, the subscription system in biscuit is similar to the (vanilla) addEventListener, but there are still a few differences. 

For example, listeners are distributed among collections according to the repository name, this allows you to localize listeners and reduce the size of arrays.
Subscribers can also subscribe to the entire store and to the event separately, which makes the development process more flexible.
It is also worth noting that the subscriber is asynchronous and in addition to the callback can return a promise. 

The dispatcher function also has a number of interesting features, such as the ability to return the previous state and asynchronously process middleware.

![N|Solid](../../docs/assets/biscuit-subscribe.png)

