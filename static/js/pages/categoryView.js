const html = require('choo/html');

const sidebar = require('../components/sidebar.js');
const category = require('../components/category.js');
const footer = require('../components/footer.js');

module.exports = (state, prev, send) => {
  return html`
    <div id="root">
      <div class="layout">
        ${sidebar(state, prev, send)} 
        ${category(state, prev, send)}
      </div>
      ${footer(state, prev, send)}
    </div>
  `;
};
