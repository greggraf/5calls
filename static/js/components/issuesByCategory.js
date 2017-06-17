const html = require('choo/html');
const t = require('../utils/translation');

const issuesListItem = require('./issuesListItem.js');

module.exports = (state, prev, send) => {

  const listUncategorizedIssues = () => {
    const uncategorizedIssues = state.issues.filter((issue) => issue.categories === null);
    if (uncategorizedIssues.length == 0) return null;
    return html`
      <div>
        <h2>
          ${t("issues.uncategorizedIssues")}
        </h2>
        <ul class="issues-list" role="navigation">
          ${uncategorizedIssues.map((issue) => issuesListItem(issue, state, prev, send))}
        </ul>
      </div>
    `;
  };

  return html`
    <main role="main" id="content" class="layout__main" onload=${() => {
      send('startup');
      send('fetchInactiveIssues');
    }}>
      <section class="call">
        <div class="call_complete">
          <h2 class="call__title">
            ${t("issues.activeIssuesWithCount",{'count': state.issues.length})}
          </h2>
          ${state.issueCategories.map(categoryName => html`
            <div>
              <h2>${categoryName}</h2>
              <ul class="issues-list" role="navigation">
                ${state.issues
                  .filter(issue => {
                    if (issue.categories != null) {
                      return issue.categories[0].name === categoryName;
                    }
                    return false;  
                  })
                  .map((issue) => issuesListItem(issue, state, prev, send))
                }
              </ul>
            </div>
          `)}
          ${listUncategorizedIssues()}
        </div>
      </section>
    </main>
  `;
};
