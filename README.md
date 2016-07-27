# @choo/cli

```
npm install @choo/cli -g
```

## Why ? ##

choo-cli is meant to be lightweight with as few abstractions as possible along, with a *strong emphasis* on **functional programming.**

The cli is used in conjunction with templates, where the templates themselves govern how the scaffolding works. This should allow high customizability along with a clear and concise pattern to follow without abstractions around manipulating the filesytem. It is desingned to use *node_modules* or a *direct path* to load your templates.

```
choo init <my-app-name> --template <template-name>
```


## Usage

```
  Usage: choo <command> [<args>]

  Available commands include:

      init, t  Scaffold a new app in the current working directory.
              Uses the demo template if no options are added.
```
## Templates


```
  Usage: choo-init [options]

  Available options include:

    --template, -t  [path-or-npm-module]
                    You can also provide a path to a supported template library

  
```

Currently one template is available and is WIP

Once the template is installed, the custom `choo add <args>` sends the `argv` data directly to any node_module or js file of your choosing.

## Try it out

```
npm install @choo/template-lite -g
```

```
choo init --template @choo/template-lite
```

