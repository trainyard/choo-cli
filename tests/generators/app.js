'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const clinton = require('clinton')
const exec = require('../../lib/exec')

test('App Generator', t => {
  t.plan(12)
  exec('choo-new.js', ['temp', '--yarn'], {
    cwd: testUtils.cwd
  }, () => {
    setTimeout(() => {
      testUtils.filesExist([
        'assets/README.md',
        'elements/README.md',
        'lib/README.md',
        'stores/home.js',
        'pages/home.js',
        'pages/README.md',
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
              check.ruleId !== 'pkg-property-order' &&
              check.ruleId !== 'pkg-engine' &&
              check.ruleId !== 'filename-case' &&
              check.ruleId !== 'keywords' &&
              check.ruleId !== 'license')) {
            t.notOk(check, check.message)
          }
        })
      }).catch(errors => {
        t.notOk(errors)
      })
    }, 1000)
  })
})
