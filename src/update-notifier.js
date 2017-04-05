'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

const chalk = require('chalk');
const semver = require('semver');

module.exports = (version, plugins) => {
  // read latest versions
  const versionsFile = path.join(os.homedir(), '.ehdev', 'latest-versions.json');
  let store = {};
  try {
    store = JSON.parse(fs.readFileSync(versionsFile, 'utf-8'));
  } catch(e) {}
  const versions = store.versions || {};

  // compare versions and show tip
  let isTipShow = false;
  const pluginName = Object.keys(plugins);
  pluginName.concat([ 'ehdev' ]).forEach(plugin => {
    try {
      const pkg = require(
        plugins[plugin] ?
          plugins[plugin]:
          path.join(__dirname, '..', '..', plugin, 'package.json')
      )
      if (versions[plugin] && semver.lt(pkg.version, versions[plugin])) {
        if (plugin === 'ehdev') {

          // do not show ehdev update tip if any plugins need update
          if (!isTipShow) {
            console.log(
              chalk.yellow(
                '\n  Update available: ' +
                plugin + '@' + versions[plugin] + ' (Current: ' + pkg.version + ')' +
                '\n  Run  `npm i ehdev -g`  to update.')
              );
          }
        } else {
          console.log(
            chalk.yellow(
              '\n  Update available: ' +
              plugin + '@' + versions[plugin] + ' (Current: ' + pkg.version + ')' +
              '\n  Run  `npm install -g ' + plugin.substring(5) + '`  to update.')
            );
        }
        isTipShow = true;
      }
    } catch(e) {
    }
  });

  // fetch latest versions
  spawn(process.execPath, [
    path.join(__dirname, 'check')
  ].concat([version, ...pluginName]), {
    detached: true,
    stdio: 'ignore'
  }).unref();
};