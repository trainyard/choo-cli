'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const clinton = require('clinton')
const exec = require('../../lib/exec')
const spawn = require('cross-spawn')

test('App Generator', t => {
  t.plan(15)
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
      const execShouldFail = spawn('choo-new', [500], {
        env: process.env,
        stdio: 'inherit'
      })
      execShouldFail.on('error', (code) => {
        console.log('execShouldFail triggered error')
      })

      execShouldFail.on('stderr', (code) => {
        console.log('execShouldFail triggered stderr')
      })
      execShouldFail.on('exit', (code) => {
        t.assert(code === 1, 'choo-new should fail when given invalid syntax')
      })
    }).catch(errors => {
      t.notOk(errors)
    })
  })
})

