'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const exec = require('../../lib/exec')

test('Element Generator', t => {
  t.plan(1)
  exec('choo-generate.js', ['element', 'testElement'], {
    cwd: testUtils.tempDir
  }, () => {
    testUtils.filesExist([
      'elements/test-element.js'
    ]).forEach(file => {
      t.assert(file.exists, `${file.name} must be generated.`)
    })
  })
})
