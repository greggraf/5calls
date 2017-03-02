const html = require('choo/html');
const store = require('../utils/localstorage.js');

const sidebar = require('../components/sidebar.js');
const content = require('../components/content.js');

module.exports = (state, prev, send) => {
  return html`
    <div id="root" class="layout">
      ${console.log(state)}
      ${sidebar(state, prev, send)} 
      ${content(state, prev, send)}
    </div>
  `;
}
