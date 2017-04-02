const html = require('choo/html');
const find = require('lodash/find');

module.exports = (state, emit) => {
  const issue = find(state.issues, ['id', state.params.issueid]);
  const currentIndex = state.contactIndices[issue.id];
  const currentContact = issue.contacts[currentIndex];

  const contactsLeft = issue.contacts.length - (currentIndex + 1);
  const callsPluralization = contactsLeft > 1 ? "people" : "person";

  const contactsLeftText = contactsLeft + " more " + callsPluralization +" to call for this issue.";

  function outcome(e, result) {
    e.target.blur()
    
    if (result == null) {
      emit('skipCall', { issueid: issue.id });
    } else {
      emit('callComplete', { result: result, contactid: currentContact.id, issueid: issue.id });
    }

    return true
  }

  if (currentContact != null) {
    return html`<div class="call__outcomes">
      <h3 class="call__outcomes__header">Enter your call result to get the next call:</h3>
      <div class="call__outcomes__items">
        <button onclick=${(e) => outcome(e, 'unavailable')}>Unavailable</button>
        <button onclick=${(e) => outcome(e, 'vm')}>Left Voicemail</button>
        <button onclick=${(e) => outcome(e, 'contacted')}>Made Contact</button>
        <button onclick=${(e) => outcome(e)}}>Skip</button>
      </div>

      ${contactsLeft > 0 ? html`<h3 aria-live="polite" class="call__contacts__left" >${contactsLeftText}</h3>` : null}
    </div>`
  } else {
    return html``
  }
}
