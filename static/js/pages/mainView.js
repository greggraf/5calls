const html = require('choo/html');

const sidebar = require('../components/sidebar.js');
const content = require('../components/content.js');

module.exports = (state, emit) => {
  return html`
    <div id="root" class="layout">
      ${sidebar(state, emit)} 
      ${content(state, emit)}
    </div>
  `;
}
