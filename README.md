# @choo/cli

```
npm install @choo/cli -g
```

## Why ? ##

choo-cli is meant to be lightweight with as few abstractions as possible along, with a *strong emphasis* on **functional programming.**

The cli is used in conjunction with templates, where the templates themselves govern how the scaffolding works. This should allow high customizability along with a clear and concise pattern to follow without abstractions around manipulating the filesytem. It is desingned to use *node_modules* or a *direct path* to load your templates.

choo init <my-app-name> --template <template-name>

## How it works ##

[ choo-cli ] ---> [choo-template] ---> [generated code]

Once the template is installed, the custom choo add <args> sends the argv data to your template Directly so that you can control how the files are generated.

key abstractions

choo.yaml is added to persist settings for the scaffolding tool
choo-cli The cli tool.

You can check it out here: 
https://github.com/trainyard/choo-cli

Warning though
This is still a prototype, pretty much hacked together in the last 24 hours.. There's a lot left to do, and zero unit tests yet :(

The template also is not added by default, and it is not finished yet (still refactoring the old yeoman generator to work with this one)

Thanks, please provide feedback and if you want to hack together on this or get involved you are more than welcome.

## Usage

```
  Usage: choo <command> [<args>]

  Available commands include:

      init, t  Scaffold a new app in the current working directory.
              Uses the demo template if no options are added.
```
## Templates

Scaffold a new app in the current working directory.

```
  Usage: choo-init [options]

  Available options include:

    --template, -t  [path-or-npm-module]
                    You can also provide a path to a supported template library

  Currently one template is available and is WIP
```

## Try it out

```
npm install @choo/template-lite -g
```

```
choo init --template @choo/template-lite
```

