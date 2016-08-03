/* Element: <%= name %> */

const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <div> <%= name %> </div>
`
