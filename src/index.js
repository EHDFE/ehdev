const fs = require('fs');
const path = require('path');

const program = require('commander');
const chalk = require('chalk');
const semver = require('semver');

const pkg = require('../package.json');

const pluginDir = '../plugins/'
const argvs = process.argv;
const command = argvs[2];

// check nodejs version
if (!semver.satisfies(process.version, pkg.engines.node)) {
  console.log(chalk.red.bold('Require nodejs version ' + pkg.engines.node + ', current ' + process.version));
  console.log('Download the latest nodejs here ' + chalk.green('https://nodejs.org/en/download/'));
  process.exit();
}

// program definiation
program
  .version(pkg.version)
  .usage('<command> [options]');

program
  .command('init')
  .description('initialize the dev env')
  .action(() => {
    require(pluginDir + 'init/');
  });

program
  .command('server')
  .description('start the dev server')
  .action(() => {
    require(pluginDir + 'server/');
  });

// enhanced future
// program
//   .command('build')
//   .description('build')
//   .action(() => {
//     console.log('build');
//   });

// parse command line arguments
program.parse(argvs);

// output help if no argv specified
if (!argvs.slice(2).length) {
  program.outputHelp();
}


