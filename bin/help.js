const { name, version, description } = require('../package.json')

exports.main = `
${name} ${version} - ${description}

Usage: choo <command> [<args>]

Available commands include:

    init, t  Scaffold a new app in the current working directory.
             Uses the demo template if no options are added.

     add, a  Adds template dependent components, models, views, etc.

You can learn more about a specific command by running things like:

  choo init --help
  choo add  --help (depends on the template)

`

exports.init = `
Scaffold a new app in the current working directory.

Usage: choo-init [options]

Available options include:

  --template, -t  [path-or-npm-module]
                  You can also provide a path to a supported template library

Additional options:

  --help, -h  Shows this.

`
