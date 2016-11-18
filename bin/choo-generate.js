#!/usr/bin/env node

const yaml = require('yamljs')
const fs = require('fs')
const help = require('./help')
const _ = require('lodash')
const args = process.argv.slice(2)
const resolvePath = require('path').resolve
const requestedGeneratorName = args[0]
const fileName = _.kebabCase(args[1])
const name = _.camelCase(args[1])
const { findConfig, findRootPath, generate, message } = require('../lib/utils')
const config = yaml.parse(fs.readFileSync(findConfig(), 'utf8'))
const chalk = require('chalk')

// message(config);
const availableGenerators = Object.keys(config.generators)

function createFromTemplate (options) {
  generate(options.templatePath, options.target, {
    name: options.name,
    fileName: options.fileName
  })
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

