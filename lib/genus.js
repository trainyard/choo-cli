'use strict'

const { xfs, newProjectPath, npmInstall, message } = require('./utils')
const { Clone: gitClone } = require('nodegit')
const path = require('path')
const chalk = require('chalk')
const pad = require('left-pad')
const fs = require('fs')
const yaml = require('yamljs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const { parse } = require('espree')

const choochoo = fs.readFileSync(path.resolve(__dirname, '../choo!')).toString()
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

module.exports = (props) => {
  // try {
  //   parse(`function ${props.projectName} () {}`)
  // } catch (e) {
  //   message(chalk.red(props.projectName, 'is an invalid name'))
  //   process.exit(1)
  // }
  const destinationPath = newProjectPath(props.projectName)
  const templateRepo = (!props.templateRepo) ? 'trainyard/template-basic' : props.templateRepo
  const generatorRootPath = path.join(destinationPath(), '.generators', '.downloaded', templateRepo.split('/').pop())
  const repo = `https://github.com/${templateRepo}.git`
  const projectPath = path.join(generatorRootPath, '_app')

  fs.access(generatorRootPath, fs.F_OK, function (err) {
    if (!err) {
      rimraf(generatorRootPath, () => {
        message(chalk.white.bold('choo') + chalk.gray(' found custom template already exists and replace it.'))
        genesis()
      })
    } else {
      mkdirp(generatorRootPath, null, genesis)
    }
  })

  function genesis () {
    // clone the template repo in the current directory
    gitClone(repo, generatorRootPath).then(() => {
      // compile template

      // check if choo.yaml exist
      fs.stat(path.join(projectPath, '_choo.yaml'), (err, stats) => {
        if (err || !stats.isFile()) {
          message(chalk.red.bold('_choo.yaml') + chalk.gray(' file missing in custom template.'))
          process.exit(1)
        }
        // check that the cloned repo has choo as a dependency
        // TODO: May want to use better exception handling ot perhaps just require
        // could get error if file _package.json doesnt exist, or if the JSON.parse fails
        const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, '_package.json')))
        if (!pkg.dependencies || !pkg.dependencies.choo) {
          message(chalk.red.bold('choo') + chalk.gray(' was not found as a dependency of the custom template'))
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
                message(chalk.red.bold(req) + chalk.gray(' file missing in custom template.'))
                process.exit(1)
              } else if (index === config.required.length - 1) {
                generateApp(projectPath, destinationPath, props, config.required)
              }
            })
          })
        }
      })
    })
  }
}

function generateApp (source, destinationPath, props, required) {
  const mv = (a, b) => xfs.move(destinationPath(a), destinationPath(b))
  const targetDirName = destinationPath().split('/').pop()
  xfs.copy(path.resolve(`${source}`, '../_generators'), destinationPath('.generators'))
  xfs.copyTpl(`${source}/**/*`, destinationPath(), props)
  if (!props.templateRepo || required.indexOf('_choo.yaml') > -1) mv('_choo.yaml', 'choo.yaml')
  if (!props.templateRepo || required.indexOf('_editorconfig') > -1) mv('_editorconfig', '.editorconfig')
  if (!props.templateRepo || required.indexOf('_gitignore') > -1) mv('_gitignore', '.gitignore')
  if (!props.templateRepo || required.indexOf('_package.json') > -1) mv('_package.json', 'package.json')

  xfs.store.each((record, i) => {
    const file = record.history[record.history.length - 1]
    if (file.indexOf('template') > -1 || file.indexOf(props.templateRepo) > -1) {
      const state = formatState('read')
      const filePath = chalk.grey.bold('[$' + file.substring(file.indexOf('template'), file.length) + ']')
      message(`${state}  ${filePath}`)
    } else if (file.indexOf(targetDirName) > -1) {
      const state = formatState(record.state)
      const filePath = chalk.white.bold(file.substring(file.indexOf(targetDirName), file.length))
      message(`${state}  ${filePath}`)
    } else {
      const state = formatState(record.state)
      const filePath = chalk.white.bold(file.split('/').pop())
      message(`${state}  ${filePath}`)
    }
  })

  message(`

${chalk.yellow('HOORAY!')}  Your application scaffold is complete!
${choochoo}
Running ${chalk.yellow.bold('npm install')} for you...

    `)
  xfs.commit(npmInstall)
}
