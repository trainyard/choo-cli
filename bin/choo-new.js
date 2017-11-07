#!/usr/bin/env node
const debug = require('debug')('choo-cli:new')
const resolvePath = require('path').resolve
const kebabCase = require('lodash').kebabCase
const help = require('./help.js')
const R = require('ramda')
const { pipe } = require('pico-lambda').pcore
const inquirer = require('inquirer')
const genus = require('../lib/genus')
const { message } = require('../lib/utils')
const args = process.argv.slice(2)

const notEmpty = R.complement(R.isEmpty)
const helpOptions = R.intersection(['--help', '-h'])
const hasHelp = pipe(
  helpOptions,
  notEmpty
)
const yarnOptions = R.intersection(['--yarn', '-y'])
const hasYarn = pipe(
  yarnOptions,
  notEmpty
)
const fromOptions = R.intersection(['from'])
const hasFrom = pipe(
  fromOptions,
  notEmpty
)
const isUsingYarn = hasYarn(args)
const isUsingFrom = hasFrom(args)
debug({isUsingFrom, isUsingYarn})
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
    genus({projectName: props.projectName, isUsingYarn})
  })
} else {
  if (args[0] === '--yarn' || args[0] === '-y' || args[0] === 'from') {
    message(help.newApp)
    console.log('Whoops! make sure the first argument is the name of your app!')
  }
  const projectName = kebabCase(args[0])
  const templateRepo = isUsingFrom ? args[args.indexOf('from') + 1] : false

  if (isUsingFrom && !templateRepo) {
    message(help.newApp)
    console.log('make sure to follow argument "from" with the template name')
    process.exit(0)
  }

  process.env.PROJECT_PATH = resolvePath(process.cwd(), projectName)
  debug('generate new app', {projectName, templateRepo, isUsingYarn})
  genus({projectName, templateRepo, isUsingYarn})
}
