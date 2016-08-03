/* Page: <%= name %> */

const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <main>
    <h1><%= name %></h1>
  </main>
`
