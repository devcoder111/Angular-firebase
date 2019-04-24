/// <reference types="cypress" />

describe('Login by existing user', function() {
  const EmailInputSelector = 'input[formcontrolname="email"]';
  const PasswordInputSelector = 'input[formcontrolname="password"]';
  const ConfirmButtonSelector = 'button[type="button"]';
  const NewLocationLinkSelector = 'h3>a';
  const LocationNameInputSelector = 'input[formcontrolname="name"]';
  const LocationCodeInputSelector = 'input[formcontrolname="code"]';
  const LocationDetailsInputSelector = 'input[formcontrolname="details"]';
  const LocationAddressInputSelector = 'input[formcontrolname="address"]';
  const LocationSaveButtonSelector = '.mat-button.mat-primary';

  it('Delete login info', () => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  it('Visit homepage', () => {
    cy.visit('/');
    cy.location().should(location => {
      expect(location.pathname).to.eq('/onboarding');
    });
  });

  it('Input demo data', () => {
    cy.get(EmailInputSelector).type(Cypress.env('demoEmail'));
    cy.get(PasswordInputSelector).type(Cypress.env('demoPassword'));
  });

  it('Press login button and verify password', () => {
    cy.server();
    cy.route('POST', '/identitytoolkit/v3/relyingparty/verifyPassword?key=*').as('authLogin');
    cy.get(ConfirmButtonSelector).click();
    cy.wait('@authLogin').should(xhr => {
      expect(xhr.status).to.eq(200);
    });
  });

  // Next test must be executed only at 1st login!
  // but we cant use it because firebase and cypress drop his friendship:
  // https://github.com/cypress-io/cypress/issues/1150
  // it('Create default location', () => {
  //   cy.location().should(location => {
  //     expect(location.pathname).to.eq('/onboarding/locations');
  //   });
  //
  //   cy.get(NewLocationLinkSelector).click();
  //   cy.get(LocationNameInputSelector).type('TestLocation');
  //   cy.get(LocationCodeInputSelector).type('LO1');
  //   cy.get(LocationDetailsInputSelector).type('Its new test location');
  //   cy.get(LocationAddressInputSelector).type('Developers town, testing street, 404 house, 503 room');
  //   cy.get(LocationSaveButtonSelector).click();
  //
  // });
});
