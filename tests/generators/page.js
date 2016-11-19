'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const exec = require('../../lib/exec')
const spawn = require('cross-spawn')

test('Page Generator', t => {
  t.plan(2)
  exec('choo-generate.js', ['page', 'testPage'], {
    cwd: testUtils.tempDir
  }, () => {
    testUtils.filesExist([
      'pages/test-page.js'
    ]).forEach(file => {
      t.assert(file.exists, `${file.name} must be generated.`)
    })
  })
  const execShouldFail = spawn('choo-generate.js', ['element', 500], {
    env: process.env,
    stdio: 'inherit'
  })
  execShouldFail.on('error', (code) => {
    console.log(code)
  })

  execShouldFail.on('exit', (code) => {
    t.assert(code === 1, 'choo-new should fail when given invalid syntax')
  })
})
