'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const clinton = require('clinton')
const exec = require('../../lib/exec')

test('App Generator', t => {
  exec('choo-new.js', ['temp'], {
    cwd: testUtils.cwd
  }, () => {
    testUtils.filesExist([
      'assets/README.md',
      'elements/README.md',
      'lib/README.md',
      'models/app.js',
      'models/README.md',
      'pages/home.js',
      'pages/README.md',
      'scripts/README.md',
      '.editorconfig',
      '.gitignore',
      'choo.yaml',
      'client.js',
      'package.json',
      'README.md'
    ]).forEach(file => {
      t.assert(file.exists, `${file.name} must be generated.`)
    })
    clinton.lint(testUtils.tempDir, {
      'test-script': 'warn',
      'use-travis': 'warn',
      'travis': 'warn'
    })
    .then(validations => {
      validations.forEach(check => {
        if (check.severity === 'error' &&
          // ignore these errors, setting them to warn not working
          (check.ruleId !== 'ava' &&
            check.ruleId !== 'xo' &&
            check.ruleId !== 'pkg-files' &&
            check.ruleId !== 'filename-case' &&
            check.ruleId !== 'license')) {
          t.notOk(check, check.message)
        }
      })
      t.end()
    }).catch(errors => {
      t.notOk(errors)
      t.end()
    })
  })
})
