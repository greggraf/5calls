const html = require('choo/html');
const t = require('../utils/translation');
const find = require('lodash/find');

const issuesLocation = require('./issuesLocation.js');

module.exports = (state, prev, send) => {
  const issue = find(state.issues, ['id', state.location.params.issueid]);

  return html`
    <header class="${classString(state)}" role="banner">
      <h1 class="issues__title">
        <a href="/" onclick=${() => send('home')}><img class="issues__logo" src="/img/5calls-logotype.png" alt="${t('common.AppName', null, true)}">${t("common.AppName")}</a>
      </h1>
      ${issuesLocation(state, prev, send)}
      ${issueExplain(state)}
    </header>
  `;

  function issueExplain(state) {
    if (issue && issue.categories != null) {
      var categoryName = categoryName = issue.categories[0].name;

      return html`<h2>${categoryName}</h2>`;
    } else if (state.issues.length > 0) {
      return html`<h2>${t("issues.whatsImportantToYou")}</h2>`;
    } else {
      return html``;
    }
  }

  function classString(state) {
    const BASE_CLASS = 'issues__header';
    const ACTIVE_CLASS = 'is-active';

    let classes = [BASE_CLASS];

    state.location.params.issueid == null && classes.push(ACTIVE_CLASS);

    return classes.join(' ');
  }
};
