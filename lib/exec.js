const spawn = require('cross-spawn')

module.exports = (command, args, opts) => {
  const exec = spawn(command, args || [], Object.assign({}, {
    env: process.env,
    stdio: 'inherit'
  }, opts))
  exec.on('exit', code => {
    if (code !== 0) {
      throw new Error('Error code: ' + code)
    }
  })
}
