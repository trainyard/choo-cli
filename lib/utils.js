const store = require('mem-fs').create()
const xfs = require('mem-fs-editor').create(store)
const exec = require('../lib/exec')
const { resolve: resolvePath } = require('path')
const { once } = require('ramda')
const walkBack = require('walk-back')

const cwd = (function () { return process.cwd() }())

const newProjectPath = (projectName) => (dir = '') => resolvePath(cwd, projectName, dir)
const findConfig = once(() => walkBack(cwd, 'choo.yml'))

const findRootPath = once(() => {
  if (process.env.PROJECT_PATH) {
    return process.env.PROJECT_PATH
  } else {
    return findConfig().split('/').slice(0, -1).join('/')
  }
})

const destinationPath = (dir = '') => resolvePath(findRootPath(), dir)

const npmInstall = process.env.NODE_ENV === 'test' ? () => { } : () => process.nextTick(() => {
  exec('npm', ['install'], { cwd: destinationPath() })
})

module.exports = {
  xfs,
  cwd,
  npmInstall,
  findConfig,
  findRootPath,
  newProjectPath,
  destinationPath
}
