const html = require('choo/html');
const impactTotal = require('./impactTotal.js');
const impactResult= require('./impactResult.js');
const callcount = require('./callcount.js');
const scrollIntoView = require('../utils/scrollIntoView.js');

module.exports = (state, emit) => {

  function load() {
    scrollIntoView(document.querySelector('#content'));
    emit('startup');
  }

  return html`
    <main id="content" role="main" aria-live="polite" class="layout__main" onload=${load}>
    <section class="impact">
      <h2 class="impact__title">My Impact</h2>

      ${impactTotal(state, emit)}
      <p class="impact__text">
        That's awesome and you should feel awesome. <br>
        Every call counts!
      </p>
      ${impactResult(state, emit)}
      ${callcount(state, emit)}

    </section>
    </main>
  `;
}
