const html = require('choo/html')
const { header, footer } = require('../elements')

const links = [{
  label: 'Choo CLI Docs',
  href: 'https://github.com/trainyard/choo-cli',
  info: 'How to use choo cli'
}, {
  label: 'Choo Documentation',
  href: 'https://github.com/yoshuawuyts/choo',
  info: 'The choo repo has some great documentation'
}, {
  label: 'Awesome Choo',
  href: 'https://github.com/YerkoPalma/awesome-choo',
  info: 'A list of awesome things for choo'
}]

module.exports = (state, prev, send) => html`
  <main>
    ${header()}
    <section class="container color-white well">
      <div class="center-text">
        <h2>Congrats!</h2>
        <p><em>You did it!! Now to make something <strong>amazing</strong></em></p>
        <p>🚂🚋🚋🚋</p>
      </div>
      <div style="padding: 2em">
        <h2>This template adds commands to your choo cli!</h2>
        <dl>
        <dt><code>choo page {name}</code></dt>
        <dd>Add a new <code>view</code> and automatically adds a <code>route</code> to your app.</dd>
        <dt><code>choo model {name}</code></dt>
        <dd>Add a new model to your app</dd>
        <dt><code>choo element {name}</code></dt>
        <dd>Add a new element to your app.</dd>
        </dl>
      </div>
    </section>
    <section class="content container">
      <div class="row">
        <div class="col-half">
          <div class="color-white well panel">
              <h3>Pro Tip:</h3>
              <p>
                <ol>
                <li>You can see how this demo works by viewing the <code>src</code> folder.</li>
                </ol>
              </p>
          </div>
        </div>
        <div class="col-half">
          <div class="color-white well panel">
              <h3>More Choo!</h3>
              <p>Check out these helpful links</p>
              <p>
              <ul>
                ${links.map(({label, href, info}) => html`
                <li>
                  <a href=${href}>
                    ${label}
                  </a> - <em>${info}</em>
                </li>`)}
              </ul>
              </p>
          </div>
        </div>
      </div>
    </section>
    ${footer()}
  </main>
`
