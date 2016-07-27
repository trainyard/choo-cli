# @choo/cli

```
npm install @choo/cli -g
```

## Usage
  Usage: choo <command> [<args>]

  Available commands include:

      init, t  Scaffold a new app in the current working directory.
              Uses the demo template if no options are added.

## Templates
Scaffold a new app in the current working directory.

  Usage: choo-init [options]

  Available options include:

    --template, -t  [path-or-npm-module]
                    You can also provide a path to a supported template library

  Currently one template is available and is WIP

```
npm install @choo/template-lite -g
```

```
choo init --template @choo/template-lite
```

