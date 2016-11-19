'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const exec = require('../../lib/exec')

test('Page Generator', t => {
  t.plan(1)
  exec('choo-generate.js', ['page', 'testPage'], {
    cwd: testUtils.tempDir
  }, () => {
    testUtils.filesExist([
      'pages/test-page.js'
    ]).forEach(file => {
      t.assert(file.exists, `${file.name} must be generated.`)
    })
  })
})
