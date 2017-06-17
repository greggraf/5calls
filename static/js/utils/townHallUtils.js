// maxTownHallDistance is the distance (in miles) to limit how far away an event
// can be and still show in the user's localEvents
// 50 was chosen based on a brief Slack conversation
const maxTownHallDistance = 50;

let stateAbbrs = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming",
};
// calculate the distance between two lat/long points
// This uses the Haversine formula
// Taken from http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
let calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 && lon1 && lat2 && lon2){
    let R = 3959; // Radius of the Earth in miles
    let dLat = deg2rad(lat2-lat1);
    let dLon = deg2rad(lon2-lon1);
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // distance in miles
  }else{
    return null;
  }
};
let deg2rad = (deg) => {
  return deg * (Math.PI/180);
};
let mapDistanceAndDistrict = (lat, lng) => {
  return (e) => {
    e.distance = calculateDistance(lat, lng, parseFloat(e.lat), parseFloat(e.lng));
    if (!e.stateAb){
      let abbrs = Object.keys(stateAbbrs).filter(s => { return e.State == stateAbbrs[s] });
      if (abbrs.length > 0) {
        e.stateAb = abbrs[0];
      } else {
        e.stateAb = '';
      }
    }
    // This is to clean up 'District' data.
    // All of these values ('VA-02', 'VA-2', '02', '2') should map to 'VA-02' (if e.stateAb == 'VA')
    if (e.District != 'Senate'){
      let districtParts = e.District.split('-');
      e.District = districtParts[districtParts.length - 1];
      e.District = e.stateAb + '-' + "0".substring(0, 2 - e.District.length) + e.District;
    }
    return e;
  };
};
let parseCivicData = (divisions) => {
  let ret = {
    'congressional_district': false,
    'country': false,
    'state': false,
    'stateAbbr': false,
  };
    
  for(let i in divisions){
    let parts = divisions[i].split('/');
    if (parts.length > 0){
      let key = parts[parts.length - 1].split(':')[0];
      let val = parts[parts.length - 1].split(':')[1];
      switch (key){
      case 'cd':
        ret.congressional_district = parts[parts.length - 2].split(':')[1].toUpperCase() + "-00".substring(0, 3 - val.length) + val;
        break;
      case 'country':
        ret.country = val.toUpperCase();
        break;
      case 'state':
        ret.stateAbbr = val.toUpperCase();
        ret.state = stateAbbrs[val.toUpperCase()];
        break;
      }
    }
  }
  return ret;
};
let filterEvents = (divisions) => {
  return (e) => {
    return e.dateObj > (new Date()).getTime() // The event is in the future
          && ((!!divisions.congressional_district 
              && divisions.congressional_district == e.District) // The event is for the user's District
            || (!!divisions.state 
              && divisions.state == e.State 
              && e.District == "Senate"
              && e.distance !== null
              && e.distance < maxTownHallDistance)); // The event is for a Senator in the user's state, less than maxTownHallDistance away
  };
};
let sortEvents = (a,b) => {
  if (a.distance === b.distance){
    return a.dateObj < b.dateObj ? -1 : 1;
  }else{
    return a.distance < b.distance ? -1 : 1;
  }
};
let filterForLocalEvents = (events, divisions, lat, lng) => {
  return events.map(mapDistanceAndDistrict(lat, lng))
    .filter(filterEvents(divisions))
    .sort(sortEvents);
};
module.exports = {
  calculateDistance: calculateDistance,
  parseCivicData: parseCivicData,
  mapDistanceAndDistrict: mapDistanceAndDistrict,
  filterEvents: filterEvents,
  sortEvents: sortEvents,
  filterForLocalEvents: filterForLocalEvents,
};
