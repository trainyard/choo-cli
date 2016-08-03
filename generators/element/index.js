'use strict'

const generate = require('../../lib/utils').generate
const resolvePath = require('path').resolve

module.exports = (props) => {
  const templatePath = resolvePath(__dirname, 'template')
  generate(templatePath, 'elements', props)
}
