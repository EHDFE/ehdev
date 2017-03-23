const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

const projectRoot = process.cwd();
const configPath = path.join(projectRoot, 'abc.json');

// create a new abc.json
const createConfigJson = (exist) => {
  let method;
  if (exist) {
    method = 'writeFile';
  } else {
    method = 'appendFile';
  }
  return new Promise((resolve, reject) => {
    fs[method](configPath, require('./template'), (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
};

async function setup() {
  if (fs.existsSync(configPath)) {
    inquirer.prompt([
      {
        type: 'list',
        name: 'override',
        message: 'The project already has the config file (abc.json). Would you like to override the file ?',
        default: 'Yes',
        choices: ['Yes', 'No'],
      }
    ]).then((res) => {
      if (res.override === 'Yes') {
        createConfigJson(true);
      }
    })
  } else {
    createConfigJson(false);
  }
}

setup();