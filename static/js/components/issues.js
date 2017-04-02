const html = require('choo/html');
const scrollIntoView = require('../utils/scrollIntoView.js');

const issuesHeader = require('./issuesHeader.js');
const issuesList = require('./issuesList.js');

module.exports = (state, emit) => {
	function debugText(debug) {
    return debug ? html`<a href="#" onclick=${resetCompletedIssues}>reset</a>` : html``;
  }

  function resetCompletedIssues() {
    emit('resetCompletedIssues');
    emit('resetUserStats');
  }

  function scrollToTop () {
    scrollIntoView(document.querySelector('#content'))
  }

  return html`
    <div class="issues">
      ${issuesHeader(state, emit)}
      ${issuesList(state, emit)}
      <a href="/more" class="issues__footer-link" onclick=${scrollToTop}>view more issues</a>
      ${debugText(state.debug)}
    </div>
  `;
}
