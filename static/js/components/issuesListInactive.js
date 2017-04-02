const html = require('choo/html');

const issuesListItem = require('./issuesListItem.js');

module.exports = (state, emit) => {
  return html`
    <ul class="issues-list" role="navigation">
      ${state.issues.filter((issue) => issue.inactive === true).map((issue) => issuesListItem(issue, state, emit))}
    </ul>
  `;
}
