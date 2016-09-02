'use strict'
const test = require('tape')
const testUtils = require('../../lib/test-utils')
const clinton = require('clinton')
const exec = require('../../lib/exec')

test('Custom generator', t => {
  t.test('Github generator', t => {
    t.plan(9)
    exec('choo-new.js', ['starter', 'from', 'YerkoPalma/choo-genesis'], {
      cwd: testUtils.cwd
    }, () => {
      testUtils.filesExist([
        'src/models/user.js',
        'src/views/main.js',
        'src/components/input.js',
        '.gitignore',
        'choo.yaml',
        'src/app.js',
        'package.json',
        'index.html',
        'README.md'
      ], 'starter').forEach(file => {
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
  t.test('Custom elements', t => {
    // custom generators
    // elements
    t.plan(1)
    exec('choo-generate.js', ['element', 'menu'], {
      cwd: testUtils.customDir
    }, () => {
      testUtils.filesExist([
        'src/components/menu.js'
      ], 'starter').forEach(file => {
        t.assert(file.exists, `${file.name} must be generated.`)
      })
    })
  })
  t.test('Custom models', t => {
    // custom generators
    // elements
    t.plan(1)
    exec('choo-generate.js', ['model', 'admin'], {
      cwd: testUtils.customDir
    }, () => {
      testUtils.filesExist([
        'src/models/admin.js'
      ], 'starter').forEach(file => {
        t.assert(file.exists, `${file.name} must be generated.`)
      })
    })
  })
  t.test('Custom pages', t => {
    // custom generators
    // elements
    t.plan(1)
    exec('choo-generate.js', ['page', 'about'], {
      cwd: testUtils.customDir
    }, () => {
      testUtils.filesExist([
        'src/views/about.js'
      ], 'starter').forEach(file => {
        t.assert(file.exists, `${file.name} must be generated.`)
      })
    })
  })
})
