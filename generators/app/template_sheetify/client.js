const choo = require('choo')
const sf = require('sheetify')
const app = choo()

sf('./assets/styles/main.css', { global: true })

app.model(require('./models/app'))

app.router((route) => [
  route('/', require('./pages/home'))
])

const tree = app.start()

document.body.appendChild(tree)
