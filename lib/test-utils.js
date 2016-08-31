'use strict'

const fileExists = require('file-exists')
const resolvePath = require('path').resolve
const cwd = resolvePath(__dirname, '../')
const isFile = (filePath, dir) =>
  fileExists(resolvePath(cwd, `${dir || 'temp'}/${filePath}`))

process.env.PATH += `:${cwd}/bin`

exports.cwd = cwd
exports.tempDir = resolvePath(__dirname, '../temp')
exports.filesExist = (files, dir) =>
  files.map(fileName => ({name: fileName, exists: isFile(fileName, dir)}))
