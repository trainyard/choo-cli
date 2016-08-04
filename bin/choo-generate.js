#!/usr/bin/env node

const help = require('./help')
const _ = require('lodash')
const args = process.argv.slice(2)
const generators = {
  page: require('../generators/page'),
  model: require('../generators/model'),
  element: require('../generators/element')
}

if (!args[0]) {
  console.log(help.generate)
  console.log('Please use a valid category')
  process.exit()
}

if (!args[1]) {
  console.log(help.generate)
  console.log('Please add a name')
  process.exit()
}

const category = args[0]
const fileName = _.kebabCase(args[1])
const name = _.camelCase(args[1])

try {
  generators[category]({fileName: fileName, name: name})
} catch (e) {
  console.log(help.generate)
  throw e
}

