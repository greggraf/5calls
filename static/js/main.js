/* global ga */

const choo = require('choo');
const http = require('xhr');
const find = require('lodash/find');
const logger = require('loglevel');
const queryString = require('query-string');
const store = require('./utils/localstorage.js');
const scrollIntoView = require('./utils/scrollIntoView.js');

const app = choo();


app.use(function(state, emitter){
const appURL = 'https://5calls.org';
// const appURL = 'http://localhost:8090';

// use localStorage directly to set this value *before* bootstrapping the app.
const debug = (localStorage['org.5calls.debug'] === 'true');

if (debug) {
  // we don't need loglevel's built-in persistence; we do it ourselves above ^
  logger.setLevel(logger.levels.TRACE, false);
}

// get the stored zip location
let cachedAddress = '';
store.getAll('org.5calls.location', (location) => {
  if (location.length > 0) {
   cachedAddress = location[0]
  }
});

// get the stored geo location
let cachedGeo = '';
store.getAll('org.5calls.geolocation', (geo) => {
  if (geo.length > 0) {
    logger.debug("geo get", geo[0]);
    cachedGeo = geo[0]
  }
});

let cachedFetchingLocation = (cachedGeo === '') ? true : false;

// get the stored geo location
let cachedAllowBrowserGeo = true;
store.getAll('org.5calls.allow_geolocation', (allowGeo) => {
  if (allowGeo.length > 0) {
    logger.debug("allowGeo get", allowGeo[0]);
    cachedAllowBrowserGeo = allowGeo[0]
  }
});

let cachedLocationFetchType = (cachedAllowBrowserGeo) ? 'browserGeolocation' : 'ipAddress';

// get the time the geo was last fetched
let cachedGeoTime = '';
store.getAll('org.5calls.geolocation_time', (geo) => {
  if (geo.length > 0) {
    logger.debug("geo time get", geo[0]);
    cachedGeoTime = geo[0]
  }
});

let cachedCity = '';
store.getAll('org.5calls.geolocation_city', (city) => {
  if (city.length > 0) {
    logger.debug("city get", city[0]);
    cachedCity = city[0]
  }
});

cachedFetchingLocation  = (cachedCity !== '') ? true : cachedFetchingLocation;
cachedLocationFetchType = (cachedAddress !== '') ? 'address' : cachedLocationFetchType;

// get the stored completed issues
let completedIssues = [];
store.getAll('org.5calls.completed', (completed) => {
  completedIssues = completed == null ? [] : completed;
});

// get stored user stats
const defaultStats = {
  all: [],
  contacted: 0,
  vm: 0,
  unavailable: 0,
};
let localStats = defaultStats;
store.getAll('org.5calls.userStats', (stats) => {
  if (stats.length > 0) {
    localStats = stats[0];
  } else {
    let impactLink = document.querySelector('#impact__link');
    impactLink.classList.add('hidden');
  }
});

      // remote data
      state.issues = [];
      state.activeIssues = [];
      state.inactiveIssues = [];
      state.totalCalls = 0;
      state.splitDistrict = false;

      // manual input address
      state.address = cachedAddress;

      // automatically geolocating
      state.geolocation = cachedGeo;
      state.geoCacheTime = cachedGeoTime;
      state.allowBrowserGeo = cachedAllowBrowserGeo;
      state.cachedCity = cachedCity;

      // local user stats
      state.userStats = localStats;

      // view state
      // getInfo = false;
      // activeIssue = false;
      // completeIssue = false;
      state.askingLocation = false;
      state.fetchingLocation = cachedFetchingLocation;
      state.locationFetchType = cachedLocationFetchType;
      state.contactIndices = {};
      state.completedIssues = completedIssues;

      state.showFieldOfficeNumbers = false;

      state.debug = debug;


  var choo4 = {
    reducers: {
      receiveActiveIssues: (data) => {
        const response = JSON.parse(data)
        state.activeIssues = response.issues;
        state.splitDistrict = response.splitDistrict;
        state.invalidAddress = response.invalidAddress;
        emitter.emit("render")
      },
      receiveInactiveIssues: (data) => {
        const response = JSON.parse(data)
        state.inactiveIssues = response.issues;
        emitter.emit("render")
      },
      mergeIssues: () => {
        let issues = state.activeIssues.concat(state.inactiveIssues)
        let contactIndices = state.contactIndices
        issues.forEach(issue => {
          contactIndices[issue.id] = contactIndices[issue.id] || 0;
        })
        
        state.issues = issues;
        state.contactIndices = contactIndices;
        emitter.emit("render")
      },
      receiveTotals: (data) => {
        const totals = JSON.parse(data);
        state.totalCalls = totals.count;
        emitter.emit("render")
      },
      receiveIPInfoLoc: (data) => {
        const geo = data.loc
        const city = data.city
        const time = new Date().valueOf()
        store.replace("org.5calls.geolocation", 0, geo, () => {});
        store.replace("org.5calls.geolocation_city", 0, city, () => {});
        store.replace("org.5calls.geolocation_time", 0, time, () => {});
        state.geolocation = geo;
        state.cachedCity = city;
        state.geoCacheTime = time;
        state.fetchingLocation = false;
        state.askingLocation = false;
        emitter.emit("render")
      },
      setContactIndices: (data) => {
        let contactIndices = state.contactIndices;
        if (data.newIndex != 0) {
          contactIndices[data.issueid] = data.newIndex;
          state.contactIndices = contactIndices;
        } else {
          contactIndices[data.issueid] = 0;
          state.contactIndices = contactIndices;
          state.completedIssues = state.completedIssues.concat(data.issueid);
        }
        emitter.emit("render")
      },
      setUserStats: (data) => {
        let stats = state.userStats;
        stats['all'].push({
          contactid: data.contactid,
          issueid: data.issueid,
          result: data.result,
          time: new Date().valueOf()
        });
        stats[data.result] = stats[data.result] + 1;
        store.replace("org.5calls.userStats", 0, stats, () => {});
        state.userStats = stats;
        emitter.emit("render")
      },
      setAddress: (address) => {
        store.replace("org.5calls.location", 0, address, () => {});
        state.address = address;
        state.askingLocation = false;
        emitter.emit("render")
        
      },
      setGeolocation: (data) => {
        store.replace("org.5calls.geolocation", 0, data, () => {});
        state.geolocation = data;
        state.fetchingLocation = false;
        emitter.emit("render")        
      },
      setCachedCity: (data) => {
        const response = JSON.parse(data);
        if (response.normalizedLocation && state.cachedCity == '') {
          store.replace("org.5calls.geolocation_city", 0, response.normalizedLocation, () => {});
          state.cachedCity = response.normalizedLocation;
          emitter.emit("render")        
        }
      },
      fetchingLocation: (data) => {
        state.fetchingLocation = data;
        emitter.emit("render")
      },
      allowBrowserGeolocation: (data) => {
        store.replace("org.5calls.allow_geolocation", 0, data, () => {})
        state.allowBrowserGeo = data;
        emitter.emit("render")
      },
      enterLocation: () => {
        state.askingLocation = true;
        emitter.emit("render")
      },
      setLocationFetchType: (data) => {
        let askingLocation = (data === 'address');
        state.locationFetchType = data;
        state.askingLocation = askingLocation;
        state.fetchingLocation = !askingLocation;
        emitter.emit("render")  
      },
      resetLocation: () => {
        store.remove("org.5calls.location", () => {});
        store.remove("org.5calls.geolocation", () => {});
        store.remove("org.5calls.geolocation_city", () => {});
        store.remove("org.5calls.geolocation_time", () => {});
        state.address = '';
        state.geolocation = '';
        state.cachedCity = '';
        state.geoCacheTime = '';
        emitter.emit("render")        
      },
      resetCompletedIssues: () => {
        store.remove("org.5calls.completed", () => {});
        state.completedIssues = [];
        emitter.emit("render")
      },
      resetUserStats: () => {
        store.replace("org.5calls.userStats", 0, defaultStats, () => {});
        state.userStats = defaultStats;
        emitter.emit("render")
      },
      home: () => {
        state.activeIssue = false;
        state.getInfo = false;
        emitter.emit("render")    
      },
      toggleFieldOfficeNumbers: () => {
        state.showFieldOfficeNumbers = !state.showFieldOfficeNumbers;
        emitter.emit("render")
      },
      hideFieldOfficeNumbers: () => {
        state.showFieldOfficeNumbers = false; 
        emitter.emit("render")
      },
      setCacheDate: (data) => ({ [data]: Date.now() })
    },

    effects: {
      fetchActiveIssues: () => {
        let address = "?address="
        if (state.address !== '') {
          address += state.address
        } else if (state.geolocation !== "") {
          address += state.geolocation
        }
        const issueURL = appURL+'/issues/'+address
        logger.debug("fetching url", issueURL);
        http(issueURL, (err, res, body) => {
          emitter.emit('setCachedCity', body)
          emitter.emit('receiveActiveIssues', body)
          emitter.emit('mergeIssues', body)
        })
      },
      fetchInactiveIssues: () => {
        let address = "?inactive=true&address="
        if (state.address !== '') {
          address += state.address
        } else if (state.geolocation !== "") {
          address += state.geolocation
        }
        const issueURL = appURL+'/issues/'+address
        logger.debug("fetching url", issueURL);
        http(issueURL, (err, res, body) => {
          emitter.emit('receiveInactiveIssues', body)
          emitter.emit('mergeIssues', body)
        })
      },
      getTotals: () => {
        http(appURL+'/report/', (err, res, body) => {
          emitter.emit('receiveTotals', body)
        })
      },
      setLocation: (data) => {
        emitter.emit('setAddress', data);
        emitter.emit('fetchActiveIssues', {});
      },
      setBrowserGeolocation: (data) => {
        emitter.emit('setGeolocation', data);
        emitter.emit('fetchActiveIssues', {});
      },
      unsetLocation: (data) => {
        emitter.emit('resetLocation', data)
        emitter.emit('startup', data)
      },
      fetchLocationBy: (data) => {
        emitter.emit('setLocationFetchType', data)
        emitter.emit('startup', data)
      },
      fetchLocationByIP: () => {
        http('https://ipinfo.io/json', (err, res, body) => {
          if (res.statusCode == 200) {
            try {
              const response = JSON.parse(body)
              if (response.city != "") {
                emitter.emit('receiveIPInfoLoc', response);
                emitter.emit('fetchActiveIssues', {});
              } else {
                emitter.emit('fetchLocationBy', 'address');
              }
            } catch(e) {
              emitter.emit('fetchLocationBy', 'address');
            }

          } else {
            emitter.emit('fetchLocationBy', 'address');
          }
        })
      },
      handleBrowserLocationError: (data) => {
        // data = error from navigator.geolocation.getCurrentPosition
        if (data.code === 1) {
          emitter.emit('allowBrowserGeolocation', false);
        }
        if (state.geolocation == '') {
          emitter.emit('fetchLocationBy', 'ipAddress');
        }
      },
      fetchLocationByBrowswer: () => {
        let geoSuccess = function(position) {
          window.clearTimeout(slowResponseTimeout);
          if (typeof position.coords !== 'undefined') {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            if (lat && long) {
              let geo = Math.floor(lat*10000)/10000 + ',' + Math.floor(long*10000)/10000;
              emitter.emit('allowBrowserGeolocation', true);
              emitter.emit('setBrowserGeolocation', geo);
            } else {
              logger.warn("Error: bad browser location results");
              emitter.emit('fetchLocationBy', 'ipAddress');
            }
          } else {
            logger.warn("Error: bad browser location results");
            emitter.emit('fetchLocationBy', 'ipAddress');
          }
        }
        let geoError = function(error) {
          window.clearTimeout(slowResponseTimeout);

          // We need the most current state, so we need another effect call.
          emitter.emit('handleBrowserLocationError', error)
          logger.warn("Error with browser location (code: " + error.code + ")");
        }
        let handleSlowResponse = function() {
          emitter.emit('fetchLocationBy', 'ipAddress');
        }
        // If necessary, this prompts a permission dialog in the browser.
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

        // Sometimes, the user ignores the prompt or the browser does not
        // provide a response when they do not permit browser location.
        // After 5s, try IP-based location, but let browser-based continue.
        let slowResponseTimeout = window.setTimeout(handleSlowResponse, 5000);
      },
      // If appropriate, focus and select the text for the location input element
      // in the issuesLocation component.
      focusLocation: () => {
        let addressElement = document.querySelector('#address')
        scrollIntoView(addressElement);
        addressElement.focus();
        // Clear previous address to show placeholder text to
        // reinforce entering a new one.
        addressElement.value = "";
        //done();
      },
      startup: () => {

        // sometimes we trigger this again when reloading mainView, check for issues
        if (state.activeIssues.length == 0 || state.geolocation == '') {
          // Check for browser support of geolocation
          if ((state.allowBrowserGeo !== false && navigator.geolocation) &&
            state.locationFetchType === 'browserGeolocation' && state.geolocation == '') {
            emitter.emit('fetchLocationByBrowswer', {});
          }
          else if (state.locationFetchType === 'ipAddress' && state.geolocation == '') {
            emitter.emit('fetchLocationByIP', {});
          }
          else if (state.address !== '' || state.geolocation !== '') {
            emitter.emit('fetchingLocation', false);
            emitter.emit('fetchActiveIssues', {});
          }
        }
      },
      oldcall: () => {
        ga('emitter.emit', 'event', 'issue_flow', 'old', 'old');
        //done();
      },
      incrementContact: (data) => {
        const issue = find(state.issues, ['id', data.issueid]);

        const currentIndex = state.contactIndices[issue.id];
        if (currentIndex < issue.contacts.length - 1) {
          scrollIntoView(document.querySelector('#contact'));
          emitter.emit('setContactIndices', { newIndex: currentIndex + 1, issueid: issue.id });
        } else {
          scrollIntoView(document.querySelector('#content'));
          store.add("org.5calls.completed", issue.id, () => {})
          emitter.emit('location:set', "/done/" + issue.id)
          emitter.emit('setContactIndices', { newIndex: 0, issueid: issue.id });
        }
      },
      callComplete: (data) => {
        emitter.emit('hideFieldOfficeNumbers', data);

        if (data.result == 'unavailable') {
          ga('emitter.emit', 'event', 'call_result', 'unavailable', 'unavailable');
        } else {
          ga('emitter.emit', 'event', 'call_result', 'success', data.result);
        }

        emitter.emit('setUserStats', data);
      
        // This parameter will indicate to the backend api where this call report came from
        // A value of test indicates that it did not come from the production environment
        const viaParameter = window.location.host === '5calls.org' ? 'web' : 'test';
      
        const body = queryString.stringify({ location: state.zip, result: data.result, contactid: data.contactid, issueid: data.issueid, via: viaParameter })
        http.post(appURL+'/report', { body: body, headers: {"Content-Type": "application/x-www-form-urlencoded"} }, () => {
          // don’t really care about the result
        })
        emitter.emit('incrementContact', data);
      },
      skipCall: (data) => {
        emitter.emit('hideFieldOfficeNumbers', data);

        ga('emitter.emit', 'event', 'call_result', 'skip', 'skip');

        emitter.emit('incrementContact', data);
      },
      trackSwitchIssue: (data) => {
        emitter.emit('hideFieldOfficeNumbers', data);

        ga('emitter.emit', 'event', 'issue_flow', 'select', 'select');

        scrollIntoView(document.querySelector('#content'));
      }
    }
  }
      emitter.on("receiveActiveIssues", choo4.reducers.receiveActiveIssues)
      emitter.on("receiveInactiveIssues", choo4.reducers.receiveInactiveIssues)
      emitter.on("mergeIssues", choo4.reducers.mergeIssues)
      emitter.on("receiveTotals", choo4.reducers.receiveTotals)
      emitter.on("receiveIPInfoLoc", choo4.reducers.receiveIPInfoLoc)
      emitter.on("setContactIndices", choo4.reducers.setContactIndices)
      emitter.on("setUserStats", choo4.reducers.setUserStats)
      emitter.on("setAddress", choo4.reducers.setAddress)
      emitter.on("setGeolocation", choo4.reducers.setGeolocation)
      emitter.on("setCachedCity", choo4.reducers.setCachedCity)
      emitter.on("fetchingLocation", choo4.reducers.fetchingLocation)
      emitter.on("allowBrowserGeolocation", choo4.reducers.allowBrowserGeolocation)
      emitter.on("enterLocation", choo4.reducers.enterLocation)
      emitter.on("setLocationFetchType", choo4.reducers.setLocationFetchType)
      emitter.on("resetLocation", choo4.reducers.resetLocation)
      emitter.on("resetCompletedIssues", choo4.reducers.resetCompletedIssues)
      emitter.on("resetUserStats", choo4.reducers.resetUserStats)
      emitter.on("home", choo4.reducers.home)
      emitter.on("toggleFieldOfficeNumbers", choo4.reducers.toggleFieldOfficeNumbers)
      emitter.on("hideFieldOfficeNumbers", choo4.reducers.hideFieldOfficeNumbers)
      emitter.on("setCacheDate", choo4.reducers.setCacheDate)
      emitter.on("fetchActiveIssues", choo4.effects.fetchActiveIssues)
      emitter.on("fetchInactiveIssues", choo4.effects.fetchInactiveIssues)
      emitter.on("getTotals", choo4.effects.getTotals)
      emitter.on("setLocation", choo4.effects.setLocation)
      emitter.on("setBrowserGeolocation", choo4.effects.setBrowserGeolocation)
      emitter.on("unsetLocation", choo4.effects.unsetLocation)
      emitter.on("fetchLocationBy", choo4.effects.fetchLocationBy)
      emitter.on("fetchLocationByIP", choo4.effects.fetchLocationByIP)
      emitter.on("handleBrowserLocationError", choo4.effects.handleBrowserLocationError)
      emitter.on("fetchLocationByBrowswer", choo4.effects.fetchLocationByBrowswer)
      emitter.on("focusLocation", choo4.effects.focusLocation)
      emitter.on("startup", choo4.effects.startup)
      emitter.on("oldcall", choo4.effects.oldcall)
      emitter.on("incrementContact", choo4.effects.incrementContact)
      emitter.on("callComplete", choo4.effects.callComplete)
      emitter.on("skipCall", choo4.effects.skipCall)
      emitter.on("trackSwitchIssue", choo4.effects.trackSwitchIssue)

});

app.route('/', require('./pages/mainView.js'));
app.route('/issue', require('./pages/mainView.js'));
app.route('/issue/:issueid', require('./pages/mainView.js'));
app.route('/done', require('./pages/doneView.js'));
app.route('/done/:issueid', require('./pages/doneView.js'));
app.route('/about', require('./pages/aboutView.js'));
app.route('/impact', require('./pages/impactView.js'));
app.route('/more', require('./pages/issuesView.js'));

const tree = app.start();
const rootNode = document.getElementById('root');

if (rootNode != null) {
  document.body.replaceChild(tree, rootNode);
}