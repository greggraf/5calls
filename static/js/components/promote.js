const html = require('choo/html');
const find = require('lodash/find');

module.exports = (state) => {
  // share widgets for both platforms don't play well with dom manipulation so we'll make our own

  // if no issue is selected, use these default parameters
  let url = encodeURIComponent("https://5calls.org")
  let additionalTwitterComps = "&via=make5calls"
  let tweet = encodeURIComponent("Spend 5 minutes. Make 5 calls. Make your voice heard.")
  let twitterTitle = "Share on Twitter"
  let facebookTitle = "Share on Facebook"

  const issue = find(state.issues, ['id', state.params.issueid]);

  // for selected issues, customize the share text a bit more
  if (issue) {
    url = encodeURIComponent('http://5calls.org/issue/' + issue.id)
    // the additional "via @make5calls" text that the via param introduces doesn't fit with issue titles, remove it
    additionalTwitterComps = ""
    tweet = encodeURIComponent('I just called my rep to ' + issue.name.substring(0, 72) +
    ' — you should too:')
    twitterTitle = "Tweet this issue"
    facebookTitle = "Share this issue"
  }

  // is this new window behavior the best? Nope, but it matches the default behavior in both share widgets
  function tweetShare(e) {
    e.preventDefault();
    window.open("https://twitter.com/share?url="+url+additionalTwitterComps+"&text="+tweet, 'sharewindow', 'width=500, height=350');
  }

  function fbShare(e) {
    e.preventDefault();
    window.open("https://www.facebook.com/sharer/sharer.php?u=http://bit.ly/2iJb5nH", 'sharewindow', 'width=500, height=350');
  }

  return html`
    <div class="promote">
      <p>
        <a target="_blank" onclick=${(e) => tweetShare(e)}><i class="fa fa-twitter" aria-hidden="true"></i> ${twitterTitle}</a>
        <a target="_blank" onclick=${(e) => fbShare(e)}><i class="fa fa-facebook" aria-hidden="true"></i> ${facebookTitle}</a>
      </p>
    </div>
  `;  
}
