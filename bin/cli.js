#!/usr/bin/env node

/* Environment Variables */
process.env.PATH += ':./node_modules/.bin'
process.env.CHOO_CLI = true

/* Dependencies */
const help = require('./help')
const exec = require('../lib/exec')
const { head, tail } = require('ramda')
const { isGenerateCommand, isNewCommand, isVersionCommand } = require('../lib/predicates')
const { name, version, description }  = require('../package.json')
const { message } = require('../lib/utils')

/* Execution */
function run (args) {
  const command = head(args)

  if (isVersionCommand(command)) {
    return message(`${name} ${version} - ${description}`)
  }
  if (isGenerateCommand(command)) {
    return exec('choo-generate', tail(args))
  }
  if (isNewCommand(command)) {
    return exec('choo-new', tail(args))
  }

  return message(help.main)
}

run(process.argv.slice(2))
