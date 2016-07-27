# @choo/cli

```
npm install @choo/cli -g
```

## Why ?

choo-cli is meant to be lightweight with as few abstractions as possible along, and stay out of the developers way.
So we use a template system that executes code the developer uses.  The template can be a path to a file, a node_module, or
even from STDIN.

The template file can pretty much call any function it wants and access the file system however it wants, choo-cli
does not provide an API or abstraction, instead the cli executes code and persists it to the project.  You can read
more in the [manifesto](./manifesto.md)

```
choo init --template <template-name>
```


## Usage

```
  Usage: choo <command> [<args>]

  Available commands include:

      init, t  Scaffold a new app in the current working directory.
              Uses the demo template if no options are added.
```

## Flow
Flow of the API is currently as follows, but we're open to a better way if it makes things simpler and adheres to our goals of being as painless as possible.

> Anytime there is a binding contextual requirement you will see this symbol: :bomb:

### Phase 1 Initialization & Configuration

Two clear phases during this time, but it is only done once and at the start of the scaffolding operation. Let's say the user enters the following command:

```
choo init --template ./my-template
```

#### Initialization Step
We've just entered Phase 1, Step 1...

Given that `--template` was passed the value `./my-template`, we follow the same pattern that require does to reduce cognitive friction.  In fact if you were to provide `my-template` instead it would attempt to search your `node_modules` directory, and it will grab the `main` field of the `package.json` as well in the event it is a module.

But in this case it would attempt to find `./my-template.js` if it finds the file, it then will call export.init() from `my-template.js` *and* pass arguments to it.

** :bomb: The passed in template must have an init() function ** that returns *either* a `Promise` or a `POJO` which has at least
one key/value pair.

#### template.js -> Promise or POJO
```javascript
{
  projectName: 'power-9000' // the only key/value pair required.
}
```

You can add as many other key/value pairs as you would like at this point, they will then be stored for persistence in the next phase.

#### Configuration Step
Welcome to Phase 1, Step 2...

The context of our program is now back in the hands of `choo-cli.js` - any of the logic performed in the Initialization
step was handled already by the template file or module.  We are now expecting a `Promise` to resolve, or a `POJO` to
save to `choo.yaml`!

If we sent the JSON mentioned earlier, then the following YAML would be created:

```yaml
project:
  name: 'power-9000'
template: 'my-template'
meta:
  projectName: 'power-9000'
```

The `template` key is used to persist that any later exec calls to `choo add` will be handled by `my-template`
The `meta` is always automatically sent back to the template file so they can use whatever templating language
like `ejs` or `handlebars` to scaffold code.

### Write Step
Welcome to Phase 1, Step 3...

> Whoa how did we get here?

You got here because our choo-cli sucessfully created that choo.yaml file and now it is going to send a message
back to the template.

A promise or POJO is now sent back to the `template` but this time we are going to call exports.generate()
exports.generate() can now also freely update the `yaml` using `config.set/get`

** :bomb: The template must have a generate() function that is one huge side-effect and returns nothing.

#### cli -> template.js -> void

Here is an example:

```javascript
// called from the cli once the initial configuration has completed.
const store = require('mem-fs').create();
const xfs = require('mem-fs-editor').create(store);
exports.generate = (destinationPath, config) => {
  // destinationPath contains the path to our app that were adding the template to.
  // config.set and config.get can be used as well, here we are using it to get the meta object.
  const templatePath = path.join(__dirname, 'templates')
  const mv = (a, b) => xfs.move(destinationPath(a), destinationPath(b))
  // we grab the meta object and pass it through to ejs
  xfs.copyTpl(`${templatePath}/**`, destinationPath(), config.get('meta'))
  // we move files after they are scaffolded
  mv('gitignore', '.gitignore')
  mv('_package.json', 'package.json')
  // we run commit because if you dont it doesnt actually write to the file system (true story)
  xfs.commit(YouJustLeveledUp)
```

### Maintenance

This isnt implemented yet :(

Here we plan on running any of the functions we saw in the add export, consider:

```javascript
// only ran after a sucessful initalization phase
exports.add = () => {
  const arg = process.env.CHOO_CMD_ARGS[0]
  // Where command was:
  //    $ choo add {arg}
  switch (arg) {
    case 'element':
      return require('./element')
    case 'model':
      return require('./model')
    case 'view':
      return require('./view')
    default:
      // display help file
      return console.log(fs.readFileSync('./usage.txt').toString())
  }
}
```

## A full sample template
### require statments omitted for brevity
```javascript

/* app.js */
// create initial scaffold
//   from: $choo init --template @choo/template-lite
exports.init = (argv) => {
  return prompt([{
    name: 'projectName',
    message: 'What do you want to name your project?',
    default: kebab(projectPath)
  }, 
}

// called from the cli once the initial configuration has completed.
exports.generate = (destinationPath, config) => {
  const templatePath = path.join(__dirname, 'templates')
  const mv = (a, b) => xfs.move(destinationPath(a), destinationPath(b))
  xfs.copyTpl(`${templatePath}/**`, destinationPath(), config.get('meta'))
  mv('gitignore', '.gitignore')
  mv('_package.json', 'package.json')
  xfs.commit(npmInstall)
}

// add functions, used only after init is true
exports.add = () => {
  const arg = process.env.CHOO_CMD_ARGS[0]
  // Where command was:
  //    $ choo add {arg}
  switch (arg) {
    case 'element':
      return require('./element')
    case 'model':
      return require('./model')
    case 'view':
      return require('./view')
    default:
      // display help file
      return console.log(fs.readFileSync('./usage.txt').toString())
  }
}
```

## Templates


```
  Usage: choo-init [options]

  Available options include:

    --template, -t  [path-or-npm-module]
                    You can also provide a path to a supported template library


```

Currently one template is available and is WIP

Once the template is installed, the custom `choo add <args>` sends the `argv` data directly to it.  You can use any js file as a template providing it exports `init` and `generate`

## Try it out

```
npm install @choo/template-lite -g
```

```
choo init --template @choo/template-lite
```
