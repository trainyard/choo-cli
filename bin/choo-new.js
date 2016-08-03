#!/usr/bin/env node

const resolvePath = require('path').resolve
const kebabCase = require('lodash').kebabCase
const appGenerator = require('../generators/app')
const args = process.argv.slice(2)
const projectName = kebabCase(args[0])
const projectPath = resolvePath(process.cwd(), projectName)
process.env.PROJECT_PATH = projectPath

console.log('Create', projectPath)

appGenerator({projectName})
