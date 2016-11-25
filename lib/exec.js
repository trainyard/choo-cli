const spawn = require('cross-spawn')

module.exports = (command, args, opts, cb) => {
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
