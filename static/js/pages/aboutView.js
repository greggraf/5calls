const html = require('choo/html');

const sidebar = require('../components/sidebar.js');
const about = require('../components/about.js');

module.exports = (state, emit) => {
  return html`
    <div id="root" class="layout">
      ${sidebar(state, emit)} 
      ${about(state, emit)}
    </div>
  `;
}
