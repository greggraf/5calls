const html = require('choo/html');
const find = require('lodash/find');

const issuesListItem = require('./issuesListItem.js');

module.exports = (state, prev, send) => {
  if (state.issues.length == 0) {
    return html`
      <ul class="issues-list" role="navigation">
      </ul>
    `;
  }

  const issue = find(state.issues, ['id', state.location.params.issueid]);

  var categoryName = undefined;

  if (issue && issue.categories != null) {
    categoryName = issue.categories[0].name;
  }

  // show either the other issues in this category or all active issues in the sidebar
  if (categoryName != undefined) {
    return html`
      <ul class="issues-list" role="navigation">
        ${state.issues
          .filter(issue => {
            if (issue.categories != null) {
              return issue.categories[0].name === categoryName;
            }
            return false;
          })
          .map(issue => issuesListItem(issue, state, prev, send))
        }
      </ul>
    `;
  } else {
    return html`
      <ul class="issues-list" role="navigation">
        ${state.issues
          .filter(issue => issue.inactive === false)
          .map(issue => issuesListItem(issue, state, prev, send))
        }
      </ul>
    `;
  }
};
