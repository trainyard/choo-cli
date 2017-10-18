'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const exec = require('../../lib/exec')

test('Store generator', t => {
  t.plan(1)
  exec('choo-generate.js', ['store', 'testStore'], {
    cwd: testUtils.tempDir
  }, () => {
    testUtils.filesExist([
      'stores/test-store.js'
    ]).forEach(file => {
      t.assert(file.exists, `${file.name} must be generated.`)
    })
  })
})
