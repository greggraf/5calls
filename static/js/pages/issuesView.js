const html = require('choo/html');

const sidebar = require('../components/sidebar.js');
const issuesInactive = require('../components/issuesInactive.js');

module.exports = (state, emit) => {
  return html`
    <div id="root" class="layout">
      ${sidebar(state, emit)}
      ${issuesInactive(state, emit)}
    </div>
  `;
}
