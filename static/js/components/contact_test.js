const contact = require('./contact');
const chai = require('chai');
const expect = chai.expect;

describe('contact component', () => {

  let state, contactData;

  beforeEach(() => {    
    contactData = {
      name: 'Big Whig',
      state: 'NZ',
      phone: '+1 202-123-1234',
      party: 'Dem',
      photoURL: '',
      reason: '',
      field_offices: []
    };

    state = {};  
  });
  
  it('should render contact name', () => {
    let result = contact(contactData, state);
    expect(result.querySelector('.call__contact__name').textContent).to.equal('Big Whig D-NZ');
  });

  it('should render party first initial and state abbrev', () => {
    contactData.party = 'Rep';
    let result = contact(contactData, state);
    expect(result.querySelector('.call__contact__name').textContent).to.equal('Big Whig R-NZ');
  });

  it('should not render state abbrev if party is missing', () => {
    contactData.party = '';
    let result = contact(contactData, state);
    expect(result.querySelector('.call__contact__name').textContent).to.equal('Big Whig');
  });

  it('should render contact phone link', () => {
    let result = contact(contactData, state);
    expect(result.querySelector('.call__contact__phone').textContent).to.equal('202-123-1234');
    expect(result.querySelector('.call__contact__phone a').getAttribute('href')).to.equal('tel:+12021231234');
  });

  it('should display field office data if present', () => {
    contactData.field_offices = [
      { phone: '+1 212-123-1234', city: 'Whigville' }
    ];
    state.showFieldOfficeNumbers = true;
    
    let result = contact(contactData, state);    
    let firstLi = result.querySelector('ul.call__contact__field-office-list li');
    
    expect(firstLi.textContent).to.equal('212-123-1234 - Whigville, NZ');
    expect(firstLi.querySelector('a').getAttribute('href')).to.equal('tel:+12121231234');
  });

  it('should display field office data without city if present', () => {
    contactData.field_offices = [{ phone: '+1 212-123-1234', city: '' }];
    state.showFieldOfficeNumbers = true;

    let result = contact(contactData, state);
    expect(result.querySelector('ul.call__contact__field-office-list li').textContent).to.equal('212-123-1234');
  });
});
