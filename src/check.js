'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');

const packageJson = require('package-json');

const configRoot = path.join(os.homedir(), '.ehdev');
const versionsPath = path.join(configRoot, 'latest-versions.json');

// tasks definiation
const majorVersion = process.argv[2].split('.')[0];
const tasks = process.argv.slice(3).map(command => packageJson(command, majorVersion));
tasks.push(packageJson('ehdev', 'latest'))
tasks.push(new Promise((resolve) => {
  fs.mkdir(configRoot, resolve);
}));

// run tasks
new Promise((resolve, reject) => {
  fs.readFile(versionsPath, 'utf-8', (err, data) => {
    if (data) {
      data = JSON.parse(data);

      // check interval by 1 day
      if (Date.now() - data.update > 3600000 * 24) {
        resolve(Promise.all(tasks));
      } else {
        reject();
      }
    } else {
      resolve(Promise.all(tasks));
    }
  });
}).then(pkgs => {

  // write to versions store
  var versions = {};
  pkgs.forEach(pkg => {
    versions[pkg.name] = pkg.version;
  });
  fs.writeFile(versionsPath, JSON.stringify({
    versions: versions,
    update: Date.now(),
  }));
});