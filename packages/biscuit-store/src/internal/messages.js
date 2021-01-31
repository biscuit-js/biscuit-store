
/** debug messages */
export const messages = {
    noRepo: (name) => `repository <${name}> not found.`,
    noState: (name) => `state <${name}> not found.`,
    initialType: 'The initial must be an object.',
    noListener: 'The subscriber\'s listener must be a function.',
    noValidAction: 'An invalid dependencies was processed.',
    storageNameError: (fnName) =>
        `biscuit ${fnName} error: storage name is not a string.`,
    noStoreParams:
		'The createStore method must contain the storage parameters.',
    noRepoName: 'The repository name is a required field.',
    middleNoFunc: 'Middleware should be provided as a feature.',
    debuggerNoFunc: 'Debugger should be provided as a feature.',
    actionString: 'The state name must be a string.',
    repoNotFind: 'Repository not found.',
    repoExists: 'A repository with this name already exists.',
};