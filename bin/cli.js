#!/usr/bin/env node

/* Environment Variables */
process.env.PATH += ':./node_modules/.bin'
process.env.CHOO_CLI = true
/* Dependencies */
const { resolve: resolvePath } = require('path')
const { head, tail, either, not, compose } = require('ramda')
const help = require('../lib/help')
const Exec = require('../lib/exec')
const { isInitCommand, isAddCommand } = require('../lib/predicates')

/* Execution */
function run (args) {
  const command = head(args)
  const exec = Exec(resolvePath(__dirname))
  const invalid = compose(not, either(isInitCommand, isAddCommand))

  if (invalid(command)) {
    return console.log(help.main)
  }
  if (isInitCommand(command)) {
    return exec('choo-init', tail(args))
  }
  if (isAddCommand(command)) {
    return exec('choo-add', tail(args))
  }
}

run(process.argv.slice(2))
