const pkg = require('../package.json')

exports.main = `
${pkg.name} ${pkg.version} - ${pkg.description}

Usage: choo <command> [arguments]

Available commands include:

        new, n  Scaffold a new app relative to the current working directory

  generate , g  Adds template dependent components, models, views, etc.

Options:

  --help, -h  SHows this.

You can learn more about a specific command by running things like:

  choo generate --help
  choo new --help

`

exports.generate = `
Generate a new file for your choo app.

Usage: choo generate <generator> <name>

Argument Definitions:

  generator    valid types include page, model, or element.
  name         name of the item.
`

exports.newApp = `
Creates a new app directory and generates initial structure.

Usage: choo new <project_name>

Argument Definitions:

  project_name    Name of the project

Options:

  --help, -h  Shows this.

`
