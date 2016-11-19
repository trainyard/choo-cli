'use strict'
const test = require('tape')
const spawn = require('cross-spawn')

test('Errors for choo-generate', t => {
  t.plan(1)
  const execShouldFail = spawn('choo-generate', ['element', 500], {
    env: process.env,
    stdio: 'inherit'
  })
  execShouldFail.on('exit', (code) => {
    t.assert(code === 1, 'choo-generate should fail when given invalid syntax')
  })
  execShouldFail.on('error', (code) => {
    console.log('execShouldFail triggered error')
  })
  execShouldFail.on('stderr', (code) => {
    console.log('execShouldFail triggered stderr')
  })
})
