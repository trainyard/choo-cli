#!/usr/bin/env node

const yaml = require('yamljs')
const fs = require('fs')
const findConfig = require('../lib/utils').findConfig
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
const config = yaml.parse(fs.readFileSync(findConfig(), 'utf8'))[category] || {}

try {
  generators[category]({fileName: fileName, name: name, path: config.path})
} catch (e) {
  console.log(help.generate)
  throw e
}
