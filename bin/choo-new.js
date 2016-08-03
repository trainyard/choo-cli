#!/usr/bin/env node

const { resolve: resolvePath } = require('path')
const { kebabCase } = require('lodash')
const appGenerator = require('../generators/app')
const args = process.argv.slice(2)
const projectName = kebabCase(args[0])
const projectPath = resolvePath(process.cwd(), projectName)
process.env.PROJECT_PATH = projectPath

console.log('Create', projectPath)

appGenerator({projectName})
