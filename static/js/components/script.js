const html = require('choo/html');
const find = require('lodash/find');
const scriptLine = require('./scriptLine.js');

module.exports = (state, emit) => {
    const issue = find(state.issues, ['id', state.params.issueid]);
    const currentIndex = state.contactIndices[issue.id];
    const currentContact = issue.contacts[currentIndex];
    
    if (currentContact != null) {
      return html`
      <div class="call__script">
        <h3 class="call__script__header">Your script:</h3>
        <div class="call__script__body">${issue.script.split('\n').map((line) => scriptLine(line, state, emit))}</div>
      </div>`      
    } else {
      return html``
    }
}