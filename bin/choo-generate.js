#!/usr/bin/env node

const yaml = require('yamljs')
const fs = require('fs')
const help = require('./help')
const _ = require('lodash')

const chalk = require('chalk')
const args = process.argv.slice(2)
const resolvePath = require('path').resolve
const requestedGeneratorName = args[0]
const fileName = _.kebabCase(args[1])
const name = _.camelCase(args[1])
const { findConfig, findRootPath, generate, message, isFuncNameValid } = require('../lib/utils')
let config

try {
  config = yaml.parse(fs.readFileSync(findConfig(), 'utf8'))
} catch (e) {
  message(chalk.red('choo.yaml not found'))
  process.exit(1)
}
const availableGenerators = Object.keys(config.generators)

function createFromTemplate ({name, templatePath, target, fileName}) {
  if (isFuncNameValid(name)) {
    message(chalk.grey(`Generating ${name}`))
    generate(templatePath, target, {
      name,
      fileName
    })
  } else {
    message(chalk.red('invalid name:', name))
    process.exit(1)
  }
}

function showHelp () {
  message(help.generate)
  message('Available generators:\n')
  availableGenerators.forEach(generatorName => {
    message(chalk.green(' ', generatorName), '-', config.generators[generatorName].description || 'create a new', generatorName)
  })
}

if (!args[0]) {
  showHelp()
  message(chalk.yellow('Please use a valid generator'))
  process.exit()
}

if (!args[1]) {
  showHelp()
  message(chalk.yellow('Please add a name'))
  process.exit()
}

if (availableGenerators.indexOf(requestedGeneratorName) >= 0) {
  try {
    const template = config.generators[requestedGeneratorName]
    createFromTemplate({
      fileName: fileName,
      name: name,
      templatePath: resolvePath(findRootPath(), template.src),
      target: resolvePath(findRootPath(), template.target)
    })
  } catch (e) {
    throw e
  }
} else {
  showHelp()
  message(chalk.yellow('Generator not available'))
  process.exit()
}
