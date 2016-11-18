const store = require('mem-fs').create()
const xfs = require('mem-fs-editor').create(store)
const kebabCase = require('lodash').kebabCase
const exec = require('./exec')
const resolvePath = require('path').resolve
const once = require('ramda').once
const walkBack = require('walk-back')
const chalk = require('chalk')
const delim = (require('os').platform() === 'win32') ? '\\' : '/'
const message = msg => console.log(msg)
const cwd = process.cwd()

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

const generate = (templatePath, category, props) => {
  const fileName = `${kebabCase(props.name)}.js`
  const targetPath = resolvePath(findRootPath(), props.path || category)
  const dest = destinationPath(`${targetPath}/${fileName}`)
  xfs.copyTpl(`${templatePath}`, dest, props)
  xfs.commit(() => {
    message(`${chalk.green.bold('generate')}`, chalk.white.bold(dest))
  })
}

module.exports = {
  xfs,
  cwd,
  message,
  generate,
  npmInstall,
  findConfig,
  findRootPath,
  newProjectPath,
  destinationPath
}
