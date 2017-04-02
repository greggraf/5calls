const html = require('choo/html');
const find = require('lodash/find');
const contact = require('./contact.js');
const noContact = require('./noContact.js');
const script = require('./script.js');
const outcomes = require('./outcomes.js');
const scriptLine = require('./scriptLine.js');
const promote = require('./promote.js');

module.exports = (state, emit) => {
  const issue = find(state.issues, ['id', state.params.issueid]);
  if (issue == null) {
    return html`<section class="call" onload=${() => {
      emit('fetchInactiveIssues')
      emit('oldcall')
    }}>
      <div class="call_complete">
        <h2 class="call__title">No calls to make</h2>
        <p class="call__text">
          This issue is no longer relevant, or the URL you used to get here was wrong. If you clicked a link on this site to get here, <a href="mailto:make5calls@gmail.com">please tell us</a> so we can fix it!
        </p>
        <p class="call__text">
          Next choose a different issue from the list to make calls about.
        </p>
      </div>
    </section>`;
  }
  const currentIndex = state.contactIndices[issue.id];
  const currentContact = issue.contacts[currentIndex];

  function contactArea() {
    if (currentContact != null) {
      return contact(currentContact, state, emit)
    } else {
      return noContact(state, emit)
    }
  }

  return html`
  <section class="call">
    <header class="call__header">
      <h2 class="call__title">${issue.name}</h2>
      <div class="call__reason">${issue.reason.split('\n').map((line) => scriptLine(line, state, emit))}</div>
    </header>

    ${contactArea()}

    ${script(state, emit)}

    ${outcomes(state, emit)}

    ${promote(state, emit)}

  </section>
  `;
}
