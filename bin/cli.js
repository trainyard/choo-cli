#!/usr/bin/env node

/* Environment Variables */
process.env.PATH += ':./node_modules/.bin'
process.env.CHOO_CLI = true

/* Dependencies */
const help = require('./help')
const exec = require('../lib/exec')
const { isGenerateCommand, isNewCommand, isVersionCommand } = require('../lib/predicates')
const { name, version, description } = require('../package.json')
const { message } = require('../lib/utils')

/* Execution */
function run (args) {
  const [head, ...tail] = args

  if (isVersionCommand(head)) {
    return message(`${name} ${version} - ${description}`)
  }
  if (isGenerateCommand(head)) {
    return exec('choo-generate', tail)
  }
  if (isNewCommand(head)) {
    return exec('choo-new', tail)
  }

  return message(help.main)
}

run(process.argv.slice(2))
