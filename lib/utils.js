const store = require('mem-fs').create()
const xfs = require('mem-fs-editor').create(store)
const { spawn } = require('child_process')
const { resolve: resolvePath } = require('path')
const { once } = require('ramda')
const walkBack = require('walk-back')

const findConfig = once(() => walkBack(process.cwd(), 'choo.yml'))
const findRootPath = once(() => findConfig().split('/').slice(0, -1).join('/'))

const destinationPath = (dir = '') => resolvePath(findRootPath(), dir)

const npmInstall = process.env.NODE_ENV === 'test' ? () => { } : () => process.nextTick(() => {
  spawn('npm', ['install'], {
    env: process.env,
    stdio: 'inherit'
  }).on('exit', code => {
    if (code !== 0) {
      throw new Error('Error code: ' + code)
    }
  })
})

module.exports = {
  xfs,
  findConfig,
  findRootPath,
  destinationPath,
  npmInstall
}
