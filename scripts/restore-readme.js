/* eslint-disable no-console */
const fs = require('fs');
const fse = require('fs-extra');
const copyFile = require('./copy-readme');

const package = './packages/biscuit-store/';

async function removeTarget(path) {
    return await new Promise((resolve, reject) => {
        fse.remove(path, (err) => {
            if (err) {
                reject(err);
                return console.error(err);
            };
            console.log(`Remove ${path}:`, 'done');
            resolve(true);
        });
    });
}

async function remove(target) {
    await removeTarget(package + target);
}

async function removeBackup(target) {
    await removeTarget(target);
}

async function restoreBackup(target, dir) {
    await copyFile(target, dir + '/', package);
}

async function functionLoop(...files) {
    const dir = './backup';

    if (fs.existsSync(dir)) {
        for (let file of files) {
            await file[0](file[1], dir);
        }
    } else {
        console.warn('The backup folder does not exist, and recovery is not possible...');
    }
};


(async function () {
    await functionLoop(
        // [createBackup, 'README.md'],
        // [createBackup, 'CHANGELOG.md'],
        [remove, 'README.md'],
        [remove, 'CHANGELOG.md'],
        [remove, 'CONTRIBUTING.md'],
        [remove, 'LICENSE.md'],
        [remove, 'docs'],
        [restoreBackup, 'README.md'],
        [restoreBackup, 'CHANGELOG.md'],
        [removeBackup, './backup']
    );
}());