#!/usr/bin/env node

/* Environment Variables */
process.env.PATH += ':./node_modules/.bin'
process.env.CHOO_CLI = true

/* Dependencies */
const _ = require('ramda')
const help = require('./help')
const exec = require('../lib/exec')
const $ = require('../lib/predicates')
const { message } = require('../lib/utils')

/* Execution */
function run (args) {
  const command = _.head(args)
  const invalid = _.compose(_.not, _.either($.isGenerateCommand, $.isNewCommand))

  if (invalid(command)) {
    return message(help.main)
  }
  if ($.isGenerateCommand(command)) {
    return exec('choo-generate', _.tail(args))
  }
  if ($.isNewCommand(command)) {
    return exec('choo-new', _.tail(args))
  }
}

run(process.argv.slice(2))
