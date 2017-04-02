const html = require('choo/html');

const issuesListInactive = require('./issuesListInactive.js');

module.exports = (state, emit) => {

  return html`
    <main role="main" id="content" class="layout__main" onload=${() => {
      emit('startup')
      emit('fetchInactiveIssues')
    }}>
      <section class="call">
        <div class="call_complete">
          <h2 class="call__title">More Issues</h2>
          ${issuesListInactive(state, emit)}
        </div>
      </section>
    </main>
  `;
}
