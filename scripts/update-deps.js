const fs = require('fs');

const currentVersion = require('../packages/biscuit-store/package.json')
	.version;
const packages = [
	{
		path: '../packages/react/package.json',
		deps: ['@biscuit-store/core', '@biscuit-store/types'],
	},
	{
		path: '../packages/adapter/package.json',
		deps: ['@biscuit-store/types'],
	},
];

async function getpackagesData() {
	for (let item of packages) {
		const current = require(item.path);
		await refactortDeps(current, item.deps, item.path);
	}
}

async function refactortDeps(current, deps, path) {
	for (let dep of deps) {
		current.peerDependencies[dep] = currentVersion;
		await fs.writeFileSync(
			path.substr(1),
			JSON.stringify(current, null, 2)
		);
	}
}

getpackagesData();