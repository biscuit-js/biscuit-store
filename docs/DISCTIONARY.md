## Distionary
Here the basic terms biscuit are described.

#### Store
This is a virtual container for application states;

#### State
This is a trigger for changing the behavior of a data object in a certain period of time.

#### Repoitory
This is the main virtual storage where the object with the data is located.

#### Action
This is a set of parameters generated in the store that serves to work with a specific state.

#### Static action
This is an object from the repository name and the state name that serves as a trigger for working with the state in a number of functions.

#### Action name
This is the string name of the state that is set when it is created.

#### Middleware
This is a function that is embedded in the storage and is triggered at the time between the launch of the manager function and the change in the storage data.

#### Branch
This is a special independent state type isolated from the main repository.