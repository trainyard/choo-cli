#!/usr/bin/env node

/* Dependencies */
const assert = require('assert')
const minimist = require('minimist')
const resolve = require('resolve')
const helpFile = require('./help')
const { createConfig, config, destinationPath } = require('../lib/utils')
const { prop, either, curry, defaultTo, compose } = require('ramda')

const argv = minimist(process.argv.slice(2))
if (argv.help) {
  console.log(helpFile.init)
  process.exit(0)
}

const defaultTpl = 'template-lite'

// (String, Object) -> String
const maybeTemplateOrDefault = curry(
  (s, o) => compose(
    defaultTo(s),
    either(prop('template'), prop('t'))
  )(o)
)
const template = maybeTemplateOrDefault(defaultTpl, argv)

const resolveTemplateFromDir = (basedir) => resolve(template, {basedir}, (err, res) => {
  if (err) {
    console.error('error', err)
    process.exit(0)
  }
  const runner = require(res)
  assert(runner.init, 'template must have init export')
  assert(runner.add, 'template must have add export')
  const appConfig = runner.init(argv)
  // Just in case we want to pass vanilla props or use
  // a promise object.
  if (appConfig.then) {
    appConfig.then(props => createConfig(props, template)).then(() => runner.generate(destinationPath, config)).catch(console.log)
  } else {
    createConfig(appConfig).then(() => runner.generate(destinationPath, config)).catch(console.log)
  }
})

resolveTemplateFromDir(template === defaultTpl ? __dirname : process.cwd())
