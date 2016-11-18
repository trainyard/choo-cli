#!/usr/bin/env node

const resolvePath = require('path').resolve
const kebabCase = require('lodash').kebabCase
const help = require('./help.js')
const R = require('ramda')
const inquirer = require('inquirer')
const appGenerator = require('../generators/app')
const { message } = require('../lib/utils')
const args = process.argv.slice(2)

const helpOptions = R.intersection(['--help', '-h'])
const notEmpty = R.complement(R.isEmpty)
const hasHelp = R.pipe(
  helpOptions,
  notEmpty
)

if (hasHelp(args)) {
  message(help.newApp)
  process.exit(0)
}

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
  if (args.length === 1) {
    var projectName = kebabCase(args[0])
    process.env.PROJECT_PATH = resolvePath(process.cwd(), projectName)
    appGenerator({projectName})
  } else if (args[1] === 'from' && args[2]) {
    projectName = kebabCase(args[0])
    const templateRepo = args[2]
    process.env.PROJECT_PATH = resolvePath(process.cwd(), projectName)
    appGenerator({projectName, templateRepo})
  }
}
