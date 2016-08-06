'use strict'

const utils = require('../../lib/utils')
const path = require('path')

module.exports = (props) => {
  const destinationPath = utils.newProjectPath(props.projectName)
  const templatePath = path.join(__dirname, 'template')
  const mv = (a, b) => utils.xfs.move(destinationPath(a), destinationPath(b))

  utils.xfs.copyTpl(`${templatePath}/**`, destinationPath(), props)

  mv('_choo.yaml', 'choo.yaml')
  mv('_editorconfig', '.editorconfig')
  mv('_gitignore', '.gitignore')
  mv('_package.json', 'package.json')

  utils.xfs.commit(utils.npmInstall)
}
