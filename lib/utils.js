const debug = require('debug')('choo-cli:utils')
const store = require('mem-fs').create()
const xfs = require('mem-fs-editor').create(store)
const { kebabCase, camelCase } = require('lodash')
const { parse } = require('espree')
const exec = require('./exec')
const path = require('path')
const once = require('ramda').once
const walkBack = require('walk-back')
const chalk = require('chalk')
const delim = (require('os').platform() === 'win32') ? '\\' : '/'
const message = msg => console.log(msg)
const cwd = process.cwd()
const resolvePath = path.resolve

const newProjectPath = (projectName) => (dir) => resolvePath(cwd, projectName, dir || '')
const findConfig = once(() => walkBack(process.cwd(), 'choo.yaml'))
const findRootPath = once(() => {
  if (process.env.PROJECT_PATH) {
    return process.env.PROJECT_PATH
  } else {
    if (findConfig()) {
      return findConfig().split(delim).slice(0, -1).join(delim)
    } else {
      throw new Error('cannot find choo.yaml from ' + cwd)
    }
  }
})

const destinationPath = (dir) => resolvePath(findRootPath(), dir || '')
const npmInstall = process.env.NODE_ENV === 'test' ? () => { } : () => process.nextTick(() => {
  exec('npm', ['install', '-s'], { cwd: destinationPath() })
})
const yarnInstall = process.env.NODE_ENV === 'test' ? () => { } : () => process.nextTick(() => {
  exec('yarn', ['install'], { cwd: destinationPath() })
})
const install = (method) => method === 'yarn' ? yarnInstall : npmInstall

const generate = (templatePath, category, props) => {
  const extName = path.extname(templatePath)
  const fileName = `${kebabCase(props.name)}${extName}`
  const targetPath = resolvePath(findRootPath(), props.path || category)
  const dest = destinationPath(`${targetPath}/${fileName}`)
  xfs.copyTpl(`${templatePath}`, dest, props)
  debug('generate', {templatePath, category, props})
  xfs.commit(() => {
    message(`${chalk.green.bold('generate')} ${chalk.white.bold(dest)}`)
  })
}

const isFuncNameValid = (name) => {
  try {
    parse(`function ${camelCase(name)} () {}`)
    return true
  } catch (e) {
    console.warn(e)
    return false
  }
}

module.exports = {
  xfs,
  cwd,
  message,
  generate,
  npmInstall,
  yarnInstall,
  install,
  findConfig,
  findRootPath,
  newProjectPath,
  isFuncNameValid,
  destinationPath
}
