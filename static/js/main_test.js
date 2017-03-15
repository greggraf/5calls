const appModel = require('./main.js').model;
const chai = require('chai');
const expect = chai.expect;

describe.only('startup function', () => {

  describe('geolocation has been set, or there are no active issues', () => {
 
  const testCases = [
      { activeIssues: ["issue1"], allowBrowserGeo: true, locationFetchType: "browserGeolocation", address: '', geolocation:'foo'  },
      { activeIssues: ["issue1"], allowBrowserGeo: true, locationFetchType: "browserGeolocation", address: 'foo', geolocation:'foo'  },
      { activeIssues: ["issue1"], allowBrowserGeo: true, locationFetchType: "ipAddress", address: '', geolocation:'foo'  },
      { activeIssues: ["issue1"], allowBrowserGeo: true, locationFetchType: "ipAddress", address: 'foo', geolocation:'foo'  },
      { activeIssues: ["issue1"], allowBrowserGeo: false, locationFetchType: "browserGeolocation", address: '', geolocation:''  },
      { activeIssues: ["issue1"], allowBrowserGeo: false, locationFetchType: "browserGeolocation", address: '', geolocation:'foo'  },
      { activeIssues: ["issue1"], allowBrowserGeo: false, locationFetchType: "browserGeolocation", address: 'foo', geolocation:'foo'  },
      { activeIssues: ["issue1"], allowBrowserGeo: false, locationFetchType: "ipAddress", address: '', geolocation:'foo'  },
      { activeIssues: ["issue1"], allowBrowserGeo: false, locationFetchType: "ipAddress", address: 'foo', geolocation:'foo'  },
      { activeIssues: [], allowBrowserGeo: false, locationFetchType: "browserGeolocation", address: '', geolocation:''  },

    ];
    
    testCases.forEach((state) => {
    
      it('should not invoke send', () => {

        var sendCalled = []; 

        var spy = function( reducer, data ) {
          sendCalled.push(reducer)
        }
             
          appModel.effects.startup( state, {}, spy );
               expect(sendCalled).to.eql([]);  

         });
    });
  

  });  


  describe('allowBrowserGeo is true, locationFetchType is browserGeoLocation and geolocation is not set', () => {
 
  const testCases = [
      { activeIssues: ["issue1"], allowBrowserGeo: true, locationFetchType: "browserGeolocation", address: '', geolocation:''  },
      { activeIssues: ["issue1"], allowBrowserGeo: true, locationFetchType: "browserGeolocation", address: 'foo', geolocation:''  },
      { activeIssues: [], allowBrowserGeo: true, locationFetchType: "browserGeolocation", address: '', geolocation:''  },
      { activeIssues: [], allowBrowserGeo: true, locationFetchType: "browserGeolocation", address: 'foo', geolocation:''  }
    ];
    
    testCases.forEach((state) => {
    
      
      it('should invoke send with fetchLocationByBrowswer', () => {

        var sendCalled = []; 

        var spy = function( reducer, data ) {
          sendCalled.push(reducer)
        }
      appModel.effects.startup( state, {}, spy );
      expect(sendCalled).to.eql(["fetchLocationByBrowswer"]);  

      });
    });
  

  });  

  describe('no active issues, and geolocation is set', () => {
 
  const testCases = [
      { activeIssues: [], allowBrowserGeo: true, locationFetchType: "browserGeolocation", address: '', geolocation:'foo'  },
      { activeIssues: [], allowBrowserGeo: true, locationFetchType: "ipAddress", address: '', geolocation:'foo'  },
      { activeIssues: [], allowBrowserGeo: true, locationFetchType: "ipAddress", address: 'foo', geolocation:'foo'  },
      { activeIssues: [], allowBrowserGeo: true, locationFetchType: "browserGeolocation", address: 'foo', geolocation:'foo'  },
      { activeIssues: [], allowBrowserGeo: false, locationFetchType: "browserGeolocation", address: '', geolocation:'foo'  },
      { activeIssues: [], allowBrowserGeo: false, locationFetchType: "browserGeolocation", address: 'foo', geolocation:''  },
      { activeIssues: [], allowBrowserGeo: false, locationFetchType: "browserGeolocation", address: 'foo', geolocation:'foo'  },
      { activeIssues: [], allowBrowserGeo: false, locationFetchType: "ipAddress", address: '', geolocation:'foo'  },
      { activeIssues: [], allowBrowserGeo: false, locationFetchType: "ipAddress", address: 'foo', geolocation:'foo'  },
    ];
    
    testCases.forEach((state) => {
    
      it('should invoke send with fetchingLocation, then fetchActiveIssues', () => {

        var sendCalled = []; 

        var spy = function( reducer, data ) {
          sendCalled.push(reducer)
        }

        appModel.effects.startup( state, {}, spy );

        expect(sendCalled).to.eql(["fetchingLocation", "fetchActiveIssues"]);  
        
         });
    });
  

  });  

  describe('active issues, geolocation is not set, but address is set', () => {
 
  const testCases = [
      { activeIssues: ["issue1"], allowBrowserGeo: false, locationFetchType: "browserGeolocation", address: 'foo', geolocation:''  }
    ];
    
    testCases.forEach((state) => {
    
      it('should invoke send with fetchingLocation, then fetchActiveIssues', () => {

        var sendCalled = []; 

        var spy = function( reducer, data ) {
          sendCalled.push(reducer)
        }

        appModel.effects.startup( state, {}, spy );

        expect(sendCalled).to.eql(["fetchingLocation", "fetchActiveIssues"]);  
        
         });
    });
  

  });  
  
  describe('locationFetchType is ipAddress and geolocation is not set', () => {
 
  const testCases = [
      { activeIssues: ["issue1"], allowBrowserGeo: true, locationFetchType: "ipAddress", address: '', geolocation:''  },
      { activeIssues: ["issue1"], allowBrowserGeo: true, locationFetchType: "ipAddress", address: 'foo', geolocation:''  },
      { activeIssues: ["issue1"], allowBrowserGeo: false, locationFetchType: "ipAddress", address: '', geolocation:''  },
      { activeIssues: ["issue1"], allowBrowserGeo: false, locationFetchType: "ipAddress", address: 'foo', geolocation:''  },
      { activeIssues: [], allowBrowserGeo: true, locationFetchType: "ipAddress", address: '', geolocation:''  },
      { activeIssues: [], allowBrowserGeo: true, locationFetchType: "ipAddress", address: 'foo', geolocation:''  },
      { activeIssues: [], allowBrowserGeo: false, locationFetchType: "ipAddress", address: '', geolocation:''  },
      { activeIssues: [], allowBrowserGeo: false, locationFetchType: "ipAddress", address: 'foo', geolocation:''  },
    ];
    
    testCases.forEach((state) => {
    
      it('should invoke send with fetchLocationByIP', () => {

        var sendCalled = []; 

        var spy = function( reducer, data ) {
          sendCalled.push(reducer)
        }
        
        appModel.effects.startup( state, {}, spy );
        expect(sendCalled).to.eql(["fetchLocationByIP"]);  
          
             
         });
    });
  

  });  



});