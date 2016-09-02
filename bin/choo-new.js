#!/usr/bin/env node

const chalk = require('chalk')
const helpFile = require('./help')
const resolvePath = require('path').resolve
const kebabCase = require('lodash').kebabCase
const R = require('ramda')
const inquirer = require('inquirer')
const appGenerator = require('../generators/app')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const args = argv._
const hasHelpOption = argv.help || argv.h || false
const validOptions = ['_', 'help', 'h', 'from', 'f']
const invalidOptions = R.difference(R.keys(argv), validOptions)

// choo new --help
if (hasHelpOption) {
  console.log(helpFile.newApp)
  process.exit(0)
}

// choo new --stuff
if (invalidOptions && invalidOptions.length) {
  showWarning(`Invalid Option: ${invalidOptions}`)
  process.exit(0)
}

// choo new <enter> - prompted for an app name
if (hasNoArgs(args)) {
  inquirer.prompt({
    type: 'input',
    name: 'projectName',
    message: 'What is your project name?'
  }).then(props => {
    setEnvironment(props.projectName)
    appGenerator({projectName: props.projectName})
  })
}

// choo new --from [github] [appName]
if (hasValidFromOption(argv)) {
  const templateRepo = argv.from
  setEnvironment(kebabCase(args[0]))
  appGenerator({projectName: kebabCase(args[0]), templateRepo})
}

// choo new [appName]
if (args.length === 1) {
  setEnvironment(kebabCase(args[0]))
  appGenerator({projectName: kebabCase(args[0])})
}

function hasNoArgs (argList) {
  return argList.length === 0
}

function hasValidFromOption (argObj) {
  const hasFrom = argObj.from
  return typeof hasFrom === 'string'
}

function setEnvironment (projectName) {
  process.env.PROJECT_PATH = resolvePath(process.cwd(), projectName)
}

function showWarning (warning) {
  console.log(chalk.yellow.bold(warning))
}
