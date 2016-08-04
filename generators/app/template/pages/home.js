const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <main>
    <h1>Hello, World!</h1>
    <p>If you are seeing this, then the generator works!</p>
    <h2>Demo</h2>
    <h3>${state.title}</h3>
    <input
      type="text"
      oninput=${(e) => send('update', { value: e.target.value })} />
  </main>
`
