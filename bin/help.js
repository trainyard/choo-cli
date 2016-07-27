const { name, version, description } = require('../package.json')

exports.main = `
${name} ${version} - ${description}

Usage: choo <command> [<args>]

Available commands include:

    init, t  Scaffold a new app in the current working directory.
             Uses the demo template if no options are added.

     add, a  Add a view, element, component, or model template to
             the current choo app.

You can learn more about a specific command by running things like:

  choo init --help
  choo add  --help

`

exports.choo = `
Scaffold a new app in the current working directory.

Usage: choo-init [options]

Available options include:

  --template, -t  ['@choo/demo-template, @choo/minimal-template']
                  You can also provide a path to a template.js file
                  or even an npm repo name.

Additional options:

  --help, -h  Shows this.

`

exports.add = `
Usage: choo-add [options] [args]

Available scaffold options:

        --view, -v  [view-name]
                    Creates a new view and also adds it to the routes.js
                    file.  Adds the file to src/views/[view-name].js

       --model, -m  [model-name]
                    Create a choo.model, saved to src/models/[model-name].js

     --element, -e  [element-name]
                    Create a choo/html, saved to src/elements/[element-name].js

   --component, -c  [component-name]
                    Create a choo/html, saved to src/components/[component-name].js

Additional options:

  --path, -p  [path-name]
              Changes the path where the file will be saved.

  --help, -h  Shows this.
`
