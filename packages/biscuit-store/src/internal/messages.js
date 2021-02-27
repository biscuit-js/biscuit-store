
/** debug messages */
export const messages = {
    noStore: (name) => `store <${name}> not found.`,
    noState: (name) => `state <${name}> not found.`,
    initialType: 'The initial must be an object.',
    noListener: 'The subscriber\'s listener must be a function.',
    noValidAction: 'An invalid dependencies was processed.',
    storageNameError: (fnName) =>
        `biscuit ${fnName} error: storage name is not a string.`,
    noStoreParams:
		'The createStore method must contain the storage parameters.',
    noStoreName: 'The store name is a required field.',
    middleNoFunc: 'Middleware should be provided as a feature.',
    debuggerNoFunc: 'Debugger should be provided as a feature.',
    actionString: 'The state name must be a string.',
    storeNotFind: 'store not found.',
    storeExists: 'A store with this name already exists.',
};