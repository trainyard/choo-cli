// Element: <%= name %> 
//
// We can use bel instead of choo/html to keep elements modular
// and allow them to easily move outisde of the app.
const html = require('bel')

function <%= name %> () {
  return html`<div> <%= name %> </div>`
}

module.exports = <%= name %>
