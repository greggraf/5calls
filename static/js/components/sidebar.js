const html = require('choo/html');
const issues = require('./issues.js');

module.exports = (state, emit) => {
  return html`
    <aside id="nav" role="contentinfo" class="layout__side">
      ${issues(state, emit)}
    </aside>
  `;
}
