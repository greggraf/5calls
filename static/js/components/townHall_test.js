const townHall = require('./townHall.js');
const townHallUtils = require('../utils/townHallUtils.js');
const chai = require('chai');
const expect = chai.expect;
const testData = require('./townHall_test_data.js');
const localEvents = testData.localEvents;

describe('townHall component', () => {
  describe('eventList', () => {
    it('should display a list of events when found', () => {
      let state = {localEvents: localEvents};
      let result = townHall(state);
      let thirteenthLi = result.querySelector('.town-hall ul > li:nth-child(13)');
      expect(thirteenthLi).to.be.defined;
    });
    
    it('should display nothing when no events are found', () => {
      let state = {localEvents: []};
      let result = townHall(state);
      let ul = result.querySelector('.town-hall ul');
      expect(ul).not.to.exist;
    });
  });
});
describe('townHallUtils component', () => {
  describe('calculateDistance', () => {
    it('should accurately calculate the distance between two lat/long points', () => {
      let point1 = {
        "lat":38.4065494,
        "lng":-78.61709150000002,
      };
      let point2 = {
        "lat":37.498796,
        "lng":-79.877583,
      };
      let actualDistance = 93;
      let distance = townHallUtils.calculateDistance(point1.lat, point1.lng, point2.lat, point2.lng);
      expect(parseInt(distance)).to.equal(actualDistance);
    });
  });
  describe('parseCivicData', () => {
    it ('should accurately parse civic api data with a division', () => {
      let divisions = [
        "ocd-division/country:us/state:va/cd:6",
        "ocd-division/country:us",
        "ocd-division/country:us/state:va"
      ];
      let parsedData = townHallUtils.parseCivicData(divisions);
      expect(parsedData.congressional_district).to.equal('VA-06');
      expect(parsedData.country).to.equal('US');
      expect(parsedData.stateAbbr).to.equal('VA');
      expect(parsedData.state).to.equal('Virginia');
    });
    it ('should accurately parse civic api data without a division', () => {
      let divisions = [
        "ocd-division/country:us",
        "ocd-division/country:us/state:va"
      ];
      let parsedData = townHallUtils.parseCivicData(divisions);
      expect(parsedData.congressional_district).not.to.be.defined;
      expect(parsedData.country).to.equal('US');
      expect(parsedData.stateAbbr).to.equal('VA');
      expect(parsedData.state).to.equal('Virginia');
    });
  });
  describe('mapDistanceAndDistrict', () => {
    it ('should map distance and district to an event', () => {
      let userLocale = {
        "lat":37.498796,
        "lng":-79.877583,
      };
      let mappedEvents = localEvents.map(townHallUtils.mapDistanceAndDistrict(userLocale.lat, userLocale.lng));
      expect(mappedEvents[0].District).to.equal('VA-06');
      expect(mappedEvents[1].District).to.equal('VA-06');
      expect(mappedEvents[2].District).to.equal('VA-06');
      expect(mappedEvents[3].District).to.equal('VA-06');
      expect(mappedEvents[14].District).to.equal('Senate');
      expect(parseInt(mappedEvents[0].distance)).to.equal(93);
      expect(parseInt(mappedEvents[1].distance)).to.equal(0);
      expect(parseInt(mappedEvents[2].distance)).to.equal(41);
      expect(parseInt(mappedEvents[3].distance)).to.equal(11);
      expect(parseInt(mappedEvents[14].distance)).to.equal(5);
    });
    it ('should return a distance of null for events when lat/long are not present', () => {
      let userLocale = {
        "lat":37.498796,
        "lng":-79.877583,
      };
      let mappedEvents = localEvents.slice(0, 4);
      delete mappedEvents[2].lng;
      delete mappedEvents[2].lat;
      mappedEvents = mappedEvents.map(townHallUtils.mapDistanceAndDistrict(userLocale.lat, userLocale.lng));
      expect(mappedEvents[2].distance).to.be.null;
    });
  });
  describe('filterEvents', () => {
    it ('should filter events according to a given set of divisions', () => {
      let divisionsRaw = [
        "ocd-division/country:us/state:va/cd:6",
        "ocd-division/country:us",
        "ocd-division/country:us/state:va"
      ];
      let divisions = townHallUtils.parseCivicData(divisionsRaw);
      let events = localEvents.filter(townHallUtils.filterEvents(divisions));
      expect(events.length).to.equal(14);
    });
    it ('should apply division filters and distance filters', () => {
      let divisionsRaw = [
        "ocd-division/country:us/state:va/cd:6",
        "ocd-division/country:us",
        "ocd-division/country:us/state:va"
      ];
      let userLocale = {
        "lat":37.498796,
        "lng":-79.877583,
      };
      let divisions = townHallUtils.parseCivicData(divisionsRaw);
      expect(divisions.congressional_district).to.equal('VA-06');
      expect(divisions.country).to.equal('US');
      expect(divisions.stateAbbr).to.equal('VA');
      expect(divisions.state).to.equal('Virginia');
      let events = townHallUtils.filterForLocalEvents(localEvents, divisions, userLocale.lat, userLocale.lng);
      
      expect(events.length).to.equal(14);
      expect(events[0].eventId).to.equal('100097');
      expect(events[1].eventId).to.equal('100128');
      expect(events[2].eventId).to.equal('100099');
      expect(events[3].eventId).to.equal('100113');
      expect(events[4].eventId).to.equal('100111');
      expect(events[5].eventId).to.equal('100110');
      expect(events[6].eventId).to.equal('100107');
      expect(events[7].eventId).to.equal('100108');
      expect(events[8].eventId).to.equal('100105');
      expect(events[9].eventId).to.equal('100114');
      expect(events[10].eventId).to.equal('100096');
      expect(events[11].eventId).to.equal('100106');
      expect(events[12].eventId).to.equal('100112');
      expect(events[13].eventId).to.equal('100109');
    });
    it ('should disregard Senators\' events if lat/long are not present', () => {
      let divisionsRaw = [
        "ocd-division/country:us/state:va/cd:6",
        "ocd-division/country:us",
        "ocd-division/country:us/state:va"
      ];
      let userLocale = {
        "lat":37.498796,
        "lng":-79.877583,
      };
      
      let divisions = townHallUtils.parseCivicData(divisionsRaw);
      expect(divisions.congressional_district).to.equal('VA-06');
      expect(divisions.country).to.equal('US');
      expect(divisions.stateAbbr).to.equal('VA');
      expect(divisions.state).to.equal('Virginia');
      let events = localEvents;
      delete events[14].lat;
      delete events[14].lng;
      events = townHallUtils.filterForLocalEvents(events, divisions, userLocale.lat, userLocale.lng);
      // expect(events.length).to.equal(13);
      expect(events[0].eventId).to.equal('100097');
      expect(events[1].eventId).to.equal('100099');
      expect(events[2].eventId).to.equal('100113');
      expect(events[3].eventId).to.equal('100111');
      expect(events[4].eventId).to.equal('100110');
      expect(events[5].eventId).to.equal('100107');
      expect(events[6].eventId).to.equal('100108');
      expect(events[7].eventId).to.equal('100105');
      expect(events[8].eventId).to.equal('100114');
      expect(events[9].eventId).to.equal('100096');
      expect(events[10].eventId).to.equal('100106');
      expect(events[11].eventId).to.equal('100112');
      expect(events[12].eventId).to.equal('100109');
    });
  });
});
