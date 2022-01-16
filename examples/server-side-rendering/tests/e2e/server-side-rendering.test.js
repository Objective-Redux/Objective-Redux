// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

describe('Server-side rendering example', () => {
  it('The page loads with a button', () => {
    cy.visit('/');
    cy.get('#toggle-btn').contains('Toggle switch on');
    cy.get('#toggle-btn').click();
    cy.get('#toggle-btn').contains('Toggle switch off');
  });
});
