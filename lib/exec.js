const { spawn } = require('child_process')

module.exports = (cmd) => (command, args) => {
  const exec = spawn(command, args, {
    cmd,
    env: process.env,
    stdio: 'inherit'
  })
  exec.on('exit', code => {
    if (code !== 0) {
      throw new Error('Error code: ' + code)
    }
  })
}
