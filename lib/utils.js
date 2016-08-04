const store = require('mem-fs').create()
const xfs = require('mem-fs-editor').create(store)
const kebabCase = require('lodash').kebabCase
const exec = require('../lib/exec')
const resolvePath = require('path').resolve
const once = require('ramda').once
const walkBack = require('walk-back')

const cwd = process.cwd()

const newProjectPath = (projectName) => (dir) => resolvePath(cwd, projectName, dir || '')
const findConfig = once(() => walkBack(process.cwd(), 'choo.yaml'))

const findRootPath = once(() => {
  if (process.env.PROJECT_PATH) {
    return process.env.PROJECT_PATH
  } else {
    if (findConfig()) {
      console.log(findConfig())
      return findConfig().split('/').slice(0, -1).join('/')
    } else {
      throw new Error('cannot find choo.yaml from ' + cwd)
    }
  }
})

const destinationPath = (dir) => resolvePath(findRootPath(), dir || '')
const npmInstall = process.env.NODE_ENV === 'test' ? () => { } : () => process.nextTick(() => {
  exec('npm', ['install'], { cwd: destinationPath() })
})

const generate = (templatePath, category, props) => {
  const fileName = `${kebabCase(props.name)}.js`
  const targetPath = resolvePath(findRootPath(), category)
  const mv = (a, b) => xfs.move(destinationPath(a), destinationPath(b))
  const templateFileName = templatePath.split('/').slice(-2)[0]
  console.log('create', fileName, 'in', targetPath)
  console.log(templatePath)
  xfs.copyTpl(`${templatePath}/**`, destinationPath(targetPath), props)
  mv(`${category}/${templateFileName}.js`, `${category}/${fileName}`)
  xfs.commit((a) => console.log('file(s) generated!'))
}

module.exports = {
  xfs,
  cwd,
  generate,
  npmInstall,
  findConfig,
  findRootPath,
  newProjectPath,
  destinationPath
}
