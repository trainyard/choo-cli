'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const exec = require('../../lib/exec')

test('Model Generator', t => {
  t.plan(1)
  exec('choo-generate.js', ['model', 'testModel'], {
    cwd: testUtils.tempDir
  }, () => {
    testUtils.filesExist([
      'models/test-model.js'
    ]).forEach(file => {
      t.assert(file.exists, `${file.name} must be generated.`)
    })
  })
})
