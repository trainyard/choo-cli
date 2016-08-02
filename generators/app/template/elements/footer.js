const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <footer class="site-footer">
    <div class="container">
      <div class="row">
        <div class="col-two-thirds">
        <div class="panel">
          <h5>Footer Content</h5>
          <p>You can use rows and columns here to organize your footer content.</p>
        </div>
        </div>
        <div class="col-one-third">
        <div class="panel">
          <h5>Links</h5>
          <ul>
            <li><a href="#!">Link 1</a></li>
            <li><a href="#!">Link 2</a></li>
            <li><a href="#!">Link 3</a></li>
            <li><a href="#!">Link 4</a></li>
          </ul>
        </div>
        </div>
      </div>
    </div>
    <div class="footer-meta">
      <div class="container">© 2016 Copyright Text
      <a class="pull-right" href="#!">More Links</a>
      </div>
    </div>
</footer>
`
