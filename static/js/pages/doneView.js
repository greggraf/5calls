const html = require('choo/html');

const sidebar = require('../components/sidebar.js');
const done = require('../components/done.js');

module.exports = (state, emit) => {
  return html`
    <div id="root" class="layout">
      ${sidebar(state, emit)} 
      ${done(state, emit)}
    </div>
  `;
}
