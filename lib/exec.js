const spawn = require('cross-spawn')
const debug = require('debug')('choo-cli:exec')
module.exports = (command, args, opts, cb) => {
  debug({command, args})
  const exec = spawn(command, args || [], Object.assign({}, {
    env: process.env,
    stdio: 'inherit'
  }, opts))
  exec.on('stderr', err => {
    console.error(err)
  })
  exec.on('error', err => {
    console.error(err)
  })
  exec.on('exit', code => {
    if (code !== 0) {
      process.exit(code)
    }
    if (cb) {
      cb()
    }
  })
}
