// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

describe('Lazy-Loading example', () => {
  it('The page loads with a button', () => {
    cy.visit('/');
    cy.get('#load-bundle').click();
    cy.get('#lazyTarget').contains('Lazy loaded data worked');
  });
});
