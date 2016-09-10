'use strict'

const utils = require('../../lib/utils')
const path = require('path')
const chalk = require('chalk')
const exec = require('../../lib/exec')
const pad = require('left-pad')
const fs = require('fs')
const yaml = require('yamljs')

const choochoo = fs.readFileSync(path.resolve(__dirname, '../../choo!')).toString()
function formatState (state) {
  switch (state) {
    case 'read':
      return chalk.grey.bold(pad('read', 7))
    case 'deleted':
      return chalk.magenta.bold(pad('move', 7))
    case 'modified':
      return chalk.green.bold(pad('stamp', 7))
    case undefined:
      return chalk.cyan.bold(pad('NEW', 7))
    default:
      return chalk.magenta.bold(pad(state, 7))
  }
}

function getTemplatePath(useSheetify) {
  if (useSheetify) {
    return 'template_sheetify'
  }

  return 'template'
}

module.exports = (props) => {
  const destinationPath = utils.newProjectPath(props.projectName)

  if (!props.templateRepo) {
    const templatePath = path.join(__dirname, getTemplatePath(props.sheetify))
    generateApp(templatePath, destinationPath, props)
  } else {
    const repo = `https://github.com/${props.templateRepo}.git`
    // clone the template repo in the current directory
    exec('git', ['clone', '-q', repo], {}, function () {
      // compile template
      const projectPath = path.join(process.cwd(), props.templateRepo.split('/').pop())
      // check if choo.yaml exist
      fs.stat(path.join(projectPath, '_choo.yaml'), (err, stats) => {
        if (err || !stats.isFile()) {
          exec('rm', ['-rf', projectPath])
          console.log(chalk.red.bold('_choo.yaml') + chalk.gray(' file missing in custom template.'))
          process.exit(1)
        }
        // check that the cloned repo has choo as a dependency
        const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, '_package.json')))
        if (!pkg.dependencies || !pkg.dependencies.choo) {
          exec('rm', ['-rf', projectPath])
          console.log(chalk.red.bold('choo') + chalk.gray(' was not found as a dependency of the custom template'))
          process.exit(1)
        }
        const defaults = {
          required: ['_choo.yaml']
        }
        const config = Object.assign(defaults, yaml.parse(fs.readFileSync(path.join(projectPath, '_choo.yaml'), 'utf8')))
        // now that choo.yml file is present, check which files are required
        if (config.required && config.required.length > 0) {
          config.required.forEach((req, index) => {
            fs.stat(projectPath + '/' + req, (err, stats) => {
              if (err || !stats.isFile()) {
                exec('rm', ['-rf', projectPath])
                console.log(chalk.red.bold(req) + chalk.gray(' file missing in custom template.'))
                process.exit(1)
              } else if (index === config.required.length - 1) {
                generateApp(projectPath, destinationPath, props, config.required)
                exec('rm', ['-rf', projectPath])
              }
            })
          })
        }
      })
    })
  }
}

function generateApp (source, destinationPath, props, required) {
  const mv = (a, b) => utils.xfs.move(destinationPath(a), destinationPath(b))
  const targetDirName = destinationPath().split('/').pop()
  utils.xfs.copyTpl(`${source}/**`, destinationPath(), props)
  if (!props.templateRepo || required.indexOf('_choo.yaml') > -1) mv('_choo.yaml', 'choo.yaml')
  if (!props.templateRepo || required.indexOf('_editorconfig') > -1) mv('_editorconfig', '.editorconfig')
  if (!props.templateRepo || required.indexOf('_gitignore') > -1) mv('_gitignore', '.gitignore')
  if (!props.templateRepo || required.indexOf('_package.json') > -1) mv('_package.json', 'package.json')

  utils.xfs.store.each((record, i) => {
    const file = record.history[record.history.length - 1]
    if (file.indexOf('template') > -1 || file.indexOf(props.templateRepo) > -1) {
      const state = formatState('read')
      const filePath = chalk.grey.bold('[$' + file.substring(file.indexOf('template'), file.length) + ']')
      console.log(`${state}  ${filePath}`)
    } else if (file.indexOf(targetDirName) > -1) {
      const state = formatState(record.state)
      const filePath = chalk.white.bold(file.substring(file.indexOf(targetDirName), file.length))
      console.log(`${state}  ${filePath}`)
    } else {
      const state = formatState(record.state)
      const filePath = chalk.white.bold(file.split('/').pop())
      console.log(`${state}  ${filePath}`)
    }
  })
  console.log('\n\n')
  console.log(chalk.white.yellow('HOORAY!'), '\tYour application scaffold is complete!')
  console.log(choochoo)
  console.log(`\t\tRunning ${chalk.yellow.bold('npm install')} for you...\n\n`)
  utils.xfs.commit(utils.npmInstall)
}
