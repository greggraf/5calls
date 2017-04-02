const html = require('choo/html');

const sidebar = require('../components/sidebar.js');
const impact = require('../components/impact.js');

module.exports = (state, emit) => {
  return html`
    <div id="root" class="layout">
      ${sidebar(state, emit)} 
      ${impact(state, emit)}
    </div>
  `;
}
