#!/usr/bin/env node

const resolvePath = require('path').resolve
const kebabCase = require('lodash').kebabCase
const help = require('./help.js')
const R = require('ramda')
const inquirer = require('inquirer')
const appGenerator = require('../generators/app')
const args = process.argv.slice(2)

const helpOptions = R.intersection(['--help', '-h'])
const notEmpty = R.complement(R.isEmpty)
const hasHelp = R.pipe(
  helpOptions,
  notEmpty
)

const askForSheetify = {
  type: 'confirm',
  name: 'useSheetify',
  message: 'Use sheetify for styles?'
}

const askForProjectName = {
  type: 'input',
  name: 'projectName',
  message: 'What is your project name?'
}

if (hasHelp(args)) {
  console.log(help.newApp)
  process.exit(0)
}

if (!args[0]) {
  inquirer.prompt([
    askForProjectName,
    askForSheetify
  ]).then(props => {
    process.env.PROJECT_PATH = resolvePath(process.cwd(), props.projectName)
    appGenerator({projectName: props.projectName, sheetify: props.useSheetify})
  })
} else {
  if (args.length === 1) {
    inquirer.prompt(askForSheetify)
      .then(props => {
        var projectName = kebabCase(args[0])
        process.env.PROJECT_PATH = resolvePath(process.cwd(), projectName)
        appGenerator({ projectName, sheetify: props.useSheetify })
    })
  } else if (args[1] === 'from' && args[2]) {
    projectName = kebabCase(args[0])
    const templateRepo = args[2]
    process.env.PROJECT_PATH = resolvePath(process.cwd(), projectName)
    appGenerator({ projectName, templateRepo, sheetify: false })
  }

}
