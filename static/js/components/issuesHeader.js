const html = require('choo/html');

const issuesLocation = require('./issuesLocation.js');

module.exports = (state, emit) => {

  return html`
    <header class="${classString(state)}" role="banner">
      <h1 class="issues__title">
        <a href="/" onclick=${() => emit('home')}><img class="issues__logo" src="/img/5calls-logotype.png">5 Calls</a>
      </h1>
      ${issuesLocation(state, emit)}
      ${issueExplain(state)}
    </header>
  `;

  function issueExplain(state) {
    if (state.issues.length > 0) {
      return html`<h2>What’s important to you?</h2>`
    } else {
      return html``
    }
  }

  function classString(state) {
    const BASE_CLASS = 'issues__header';
    const ACTIVE_CLASS = 'is-active';

    let classes = [BASE_CLASS];

    state.params.issueid == null && classes.push(ACTIVE_CLASS);

    return classes.join(' ');
  }
}
