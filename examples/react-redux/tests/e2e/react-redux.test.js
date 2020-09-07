// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

/* eslint-disable max-nested-callbacks, max-params */

function clickAndAssert(id, times, previousTimes = 0) {
  for (let i = 1; i <= times; i++) {
    cy.get(id)
      .find('button')
      .click({ force: true });
    cy.get('.result').then(elements => {
      assertSwitchElements(elements, i + previousTimes);
    });
  }
}

function assertSwitchElements(resultElements, numTimes) {
  resultElements.toArray().forEach(
    elem => {
      expect(elem).html(`Switch is ${numTimes % 2 === 1 ? 'On' : 'Off'}<br>Turned on ${Math.ceil(numTimes / 2)} times`);
    }
  );
}

describe('React-Redux example', () => {
  it('The connected component lazy loads and renders', () => {
    cy.visit('/');
    clickAndAssert('#connected', 5);
    clickAndAssert('#hook', 5, 5);
    clickAndAssert('#react-redux', 5, 10);
  });

  it('The hook component lazy loads and renders', () => {
    cy.visit('/');
    clickAndAssert('#hook', 5);
    clickAndAssert('#react-redux', 5, 5);
    clickAndAssert('#connected', 5, 10);
  });

  it('The react-redux component lazy loads and renders', () => {
    cy.visit('/');
    clickAndAssert('#react-redux', 5);
    clickAndAssert('#connected', 5, 5);
    clickAndAssert('#hook', 5, 10);
  });
});
