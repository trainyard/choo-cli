#!/usr/bin/env node

/* Environment Variables */
process.env.PATH += ':./node_modules/.bin'
process.env.CHOO_CLI = true

/* Dependencies */
const { head, tail, either, not, compose } = require('ramda')
const help = require('./help')
const exec = require('../lib/exec')
const { isGenerateCommand, isNewCommand } = require('../lib/predicates')

/* Execution */
function run (args) {
  const command = head(args)
  const invalid = compose(not, either(isGenerateCommand, isNewCommand))

  if (invalid(command)) {
    return console.log(help.main)
  }
  if (isGenerateCommand(command)) {
    return exec('choo-generate', tail(args))
  }
  if (isNewCommand(command)) {
    return exec('choo-new', tail(args))
  }
}

run(process.argv.slice(2))
