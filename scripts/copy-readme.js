/* eslint-disable no-console */
const fs = require('fs');
const fse = require('fs-extra');

const package = './packages/biscuit-store/';

async function copyFile(target, src, dist) {
    let source = fs.createReadStream(src + target);
    let dest = fs.createWriteStream(dist + target);

    return await new Promise((resolve, reject) => {
        source.pipe(dest);

        source.on('end', () => {
            console.log(`Copy from ${src + target} to ${dist + target}:`, 'done');
            resolve(true);
        });

        source.on('error', (err) => {
            console.log(err);
            reject(false);
        });
    });
};

async function createBackup(target, dir) {
    await copyFile(target, package, dir + '/');
};

async function fromRootToCore(target) {
    await copyFile(target, './', package);
};

async function copyFolder(target) {
    await fse.copy('./' + target, package + target, (err) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Copy from ${'./' + target} to ${package + target}:`, 'done');
    });
};

async function functionLoop(...files) {
    const dir = './backup';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log('Create backup folder: ', 'done');

        for (let file of files) {
            await file[0](file[1], dir);
        }
    } else {
        console.warn('The copy has already been made...');
    }
};


(async function () {
    await functionLoop(
        [createBackup, 'README.md'],
        [createBackup, 'CHANGELOG.md'],
        [fromRootToCore, 'README.md'],
        [fromRootToCore, 'CHANGELOG.md'],
        [fromRootToCore, 'CONTRIBUTING.md'],
        [fromRootToCore, 'LICENSE.md'],
        [copyFolder, 'docs']
    );
}());

module.exports = copyFile;