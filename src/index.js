const fs = require('fs');
const path = require('path');

const program = require('commander');
const chalk = require('chalk');
const semver = require('semver');
const resolve = require('resolve');

const pkg = require('../package.json');

const updateNotifier = require('./update-notifier');
const argvs = process.argv;
const command = argvs[2];

// check nodejs version
if (!semver.satisfies(process.version, pkg.engines.node)) {
  console.log(chalk.red.bold('Require nodejs version ' + pkg.engines.node + ', current ' + process.version));
  console.log('Download the latest nodejs here ' + chalk.green('https://nodejs.org/en/download/'));
  process.exit();
}

// dirs to find plugins
var moduleDirs = [
  path.join(__dirname, '..', 'node_modules'),
  path.join(__dirname, '..', '..')
];
program._moduleDirs = moduleDirs;

// locate the plugin
const pluginPath = findPluginPath(command);

if (pluginPath) {
  // check update of current command
  updateNotifier(pkg.version, {
    [`ehdev-${command}`]: pluginPath,
  });

  // regist current plugin
  const pluginDef = require(pluginPath);
  const plugin = program.command(pluginDef.command || command);

  if (pluginDef.description) {
    plugin.description(pluginDef.description);
  }

  // set options
  if (pluginDef.options) {

    // default options in abc.json
    let defaultOpts = loadDefaultOpts(process.cwd(), 'abc.json');
    let optNameReg = /\-\-(\w+)/;
    pluginDef.options.forEach(optArgs => {
      if (optArgs) {
        plugin.option.apply(plugin, optArgs);

        // replace default value with options in abc.json
        const matches = optNameReg.exec(optArgs[0]);
        if (matches && matches[1] in defaultOpts) {
          plugin[matches[1]] = defaultOpts[matches[1]]
        }
      }
    });
  }

  // set action
  if (pluginDef.action) {
    plugin.action((cmd, opts) => {
      if (cmd instanceof program.Command) {
        opts = cmd;
        cmd = '';
      }
      opts = opts || {};

      // run plugin action
      if (cmd) {
        pluginDef.action.call(this, cmd, opts);
      } else {
        pluginDef.action.call(this, opts);
      }
    });
  }
} else if (!command) { // plugin not found

  let plugins;
  let pluginPool = {};

  moduleDirs.forEach(modulesDir => {

    // search plugins
    plugins = fs.readdirSync(modulesDir).filter(name => /^ehdev\-\w+$/.test(name));

    // regist all the plugins
    plugins.forEach(name => {

      // ensure local plugins not be overridden
      if (!pluginPool[name]) {
        pluginPool[name] = path.join(modulesDir, name, 'package.json');

        // regist a plugin for help
        const pluginPkg = require(pluginPool[name]);
        program
          .command(name.substring(6))
          .description(`${pluginPkg.description} ${chalk.green('(v' + pluginPkg.version + ')')}`);
      }
    });
  });

  // check update of all plugins
  updateNotifier(pkg.version, pluginPool);
}

// program definiation
program
  .version(pkg.version)
  .usage('<command> [options]');

// parse command line arguments
program.parse(argvs);

// output help if no argv specified
if (!argvs.slice(2).length) {
  program.outputHelp();
}

// locate the plugin by plugin name
function findPluginPath(command) {
  if (command && /^\w+$/.test(command)) {
    try {
      return resolve.sync('ehdev-' + command, {
        paths: moduleDirs,
      });
    } catch (e) {
      console.log(`
      ${chalk.green.bold(command)} command is not installed.
      You can try to install it by ${chalk.blue.bold('npm install ehdev-' + command + ' -g')}.
      `);
    }
  }
}

// load default options
function loadDefaultOpts(startDir, configFile) {
  try {
    return require(path.join(startDir, configFile)).options || {};
  } catch (e) {
    const dir = path.dirname(startDir);
    if (dir === startDir) {
      return {};
    }
    return loadDefaultOpts(dir, configFile);
  }
}


