const html = require('choo/html');
const t = require('../utils/translation');

let renderLink = (e) => {
  if (e.link){
    return html`<li><a href="${e.link}" target="_new">${t("townhall.moreInfo")}</a></li>`;
  }
};
let renderNotes = (e) => {
  if (e.Notes){
    let ret = html`<li></li>`;
    ret.innerHTML = e.Notes;
    return ret;
  }
};

module.exports = (state) => {
  if (state.localEvents && state.localEvents.length > 0) {
    return html`
      <div class="town-hall">
        <h2>${t("townhall.findNearYou")}</h2>
        <p>
          <ul class="list-group">
            ${state.localEvents.map(function(e){
              return html`<li class="event-row list-group-item">
                <span class="member">
                  <h4>
                    ${e.Member}
                    <small>(${e.Party})  ${e.State},   ${e.District}
                    </small>
                  </h4>
                  <span class="badge badge-default badge-pill pull-right">  ${e.meetingType}</span>
                </span>
                <ul class="list-inline list-inline-separated">
                  <li>${e.Date} - ${e.Time}, ${e.timeZone}</li>
                  <li><b>${e.eventName}</b></li>
                  <li>${e.Location}</li>
                  <li>${e.address}</li>
                  ${renderLink(e)}
                  ${renderNotes(e)}
                </ul>
              </li>`;
            })}
          </ul>
          <small>${t("townhall.thpCredit")}</small>
        </p>
      </div>`;
  }else{
    return html`<div></div>`;
  }
};
