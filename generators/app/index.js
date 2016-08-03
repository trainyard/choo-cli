const { xfs, npmInstall, newProjectPath } = require('../../lib/utils')
const { join: joinPaths } = require('path')

module.exports = (props) => {
  const destinationPath = newProjectPath(props.projectName)
  const templatePath = joinPaths(__dirname, 'template')
  const mv = (a, b) => xfs.move(destinationPath(a), destinationPath(b))

  xfs.copyTpl(`${templatePath}/**`, destinationPath(), props)

  mv('_choo.yaml', 'choo.yaml')
  mv('_editorconfig', '.editorconfig')
  mv('_gitignore', '.gitignore')
  mv('_package.json', 'package.json')

  xfs.commit(npmInstall)
}
