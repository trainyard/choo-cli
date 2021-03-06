'use strict'

const fileExists = require('file-exists')
const resolvePath = require('path').resolve
const cwd = resolvePath(__dirname, '../')
const isFile = (filePath, dir) => {
  return fileExists.sync(resolvePath(cwd, `${dir || 'temp'}/${filePath}`))
}

process.env.PATH += `:${cwd}/bin`

exports.cwd = cwd
exports.tempDir = resolvePath(__dirname, '../temp')
exports.customDir = resolvePath(__dirname, '../starter')
exports.filesExist = (files, dir) =>
  files.map(fileName => ({name: fileName, exists: isFile(fileName, dir)}))
