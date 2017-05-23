const store = require('./localstorage');
const chai = require('chai');
const expect = chai.expect;

describe('localStorage utils', () => {

  var localStorage;
  
  beforeEach(function() {
    localStorage = {};
    store.setStorage(localStorage);
  });
  
  describe('getAll()', () => {
    it('should return an empty array on error ', () => {
      localStorage.foo = "Bad JSON";
      store.getAll("foo", function(result){
        expect(result).to.eql([]);    
      });      
    });
    it('should return an empty array if not defined ', () => {
      localStorage.foo = '["bar", "baz"]';
      store.getAll("not_a_key", function(result){
        expect(result).to.eql([]);    
      });      
    });
    it('should return the stored array if defined', () => {
      localStorage.foo = '["bar", "baz"]';
      store.getAll("foo", function(result){
        expect(result).to.eql(['bar', 'baz']);    
      });      
    });
  });
  describe('get()', () => {
    it('should return first item in the list ', () => {
      localStorage.foo = '["bar", "baz", "bat"]';
      expect(store.get("foo")).to.equal('bar');    
    });
    it('should return undefined if list is empty', () => {
      localStorage.foo = '[]';
      expect(store.get("foo")).to.equal(undefined);    
    });    
    it('should return undefined if key does not exist', () => {
      expect(store.get("baz")).to.equal(undefined);    
    });    
  });
  describe('set()', () => {
    it('should replace first item in the list ', () => {
      localStorage.foo = '["bar", "baz", "bat"]';
      store.set("foo", "boo");    
      expect(localStorage.foo ).to.equal('["boo","baz","bat"]');    
    });
  });
  describe('add()', () => {
    it('should add the new value to the end of the list', () => {
      localStorage.foo = '["bar", "baz", "bat"]';
      store.add("foo", "boo", function(){});      
      expect(localStorage.foo ).to.equal('["bar","baz","bat","boo"]');    
    });
  });
  describe('replace()', () => {
    it('should replace the item at the given index with the new value', () => {
      localStorage.foo = '["bar", "baz", "bat"]';
      store.replace("foo", 1, "boo", function(){});      
      expect(localStorage.foo ).to.equal('["bar","boo","bat"]');    
    });
  });
  describe('remove()', () => {
    it('should call localStorage.removeItem api with key to be removed', () => {
      localStorage.foo = '["bar", "baz"]';
      localStorage.foo2 = '["bar2", "baz2"]';
      
      localStorage.removeItem = function(key) {
        localStorage.removeItem.wasCalledWith = key
      }

      store.remove("foo2", function(result){
        expect(localStorage.removeItem.wasCalledWith).to.eql("foo2");
      });      

    });
  });
});