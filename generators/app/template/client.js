const choo = require('choo')
const app = choo()

app.model(require('./models/app'))
app.router(require('./routes'))

const tree = app.start()

document.body.appendChild(tree)
