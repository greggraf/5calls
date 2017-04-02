const html = require('choo/html');

const hypothesis = require('./hypothesis.js');
const about    = require('./about.js');
const call       = require('./call.js');

module.exports = (state, emit) => {
  const currentView = state.params.issueid != null && state.issues.length > 0 ? call : infoPages();

  function infoPages() {
    if (state.getInfo == true) {
      return about;
    }

    return hypothesis;
  }

  return html`
    <main id="content" role="main" aria-live="polite" class="layout__main" onload=${() => emit('startup')}>
      ${currentView(state, emit)}
    </main>
  `;
}
