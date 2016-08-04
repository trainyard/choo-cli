#!/usr/bin/env node

const resolvePath = require('path').resolve
const kebabCase = require('lodash').kebabCase
const inquirer = require('inquirer')
const appGenerator = require('../generators/app')
const args = process.argv.slice(2)

if (!args[0]) {
  inquirer.prompt({
    type: 'input',
    name: 'projectName',
    message: 'What is your project name?'
  }).then(props => {
    process.env.PROJECT_PATH = resolvePath(process.cwd(), props.projectName)
    appGenerator({projectName: props.projectName})
  })
} else {
  const projectName = kebabCase(args[0])
  process.env.PROJECT_PATH = resolvePath(process.cwd(), projectName)
  appGenerator({projectName})
}
