const YAML = require('yamljs')
const assert = require('assert')
const { writeFile, readFileSync } = require('fs')
const { join, resolve: resolvePath } = require('path')
const { once } = require('ramda')
const walkBack = require('walk-back')

const findConfig = once(() => walkBack(process.cwd(), 'choo.yml'))
const findRootPath = once(() => findConfig().split('/').slice(0, -1).join('/'))

const writeConfig = (writePath, data, cb) => writeFile(writePath, YAML.stringify(data, 2), (err) => {
  if (err) {
    cb(err, null)
  }
  console.log('write', writePath)
  cb(null, 'success')
})

const readConfig = () => {
  const configPath = findConfig()
  const yamlData = readFileSync(configPath).toString()
  return YAML.parse(yamlData)
}

const createConfig = function (props, templateName) {
  return new Promise((resolve, reject) => {
    const writePath = join(process.cwd(), 'choo.yml')
    assert(props.projectName, 'props must have projectName')
    const data = {
      project: {
        name: props.projectName
      },
      template: {
        name: templateName
      },
      meta: props
    }
    writeConfig(writePath, data, (err, res) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(res)
      }
    })
  })
}

const config = {
  set: (key, value) => {
    const filePath = findConfig()
    const parsedData = readConfig()
    parsedData[key] = value
    writeConfig(filePath, parsedData)
  },
  get: (key) => {
    const parsedData = readConfig()
    return parsedData[key]
  }
}

const destinationPath = (dir = '') => resolvePath(findRootPath(), dir)

module.exports = {
  findConfig,
  writeConfig,
  readConfig,
  createConfig,
  config,
  destinationPath
}
