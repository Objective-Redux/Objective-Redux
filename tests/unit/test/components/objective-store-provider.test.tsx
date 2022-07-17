// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import * as React from 'react';
import { render, screen } from '../../utils';
import { ObjectiveStore, ObjectiveStoreProvider, useObjectiveStore } from '../../../../src';

const TestComponent = (): any => {
  const store = useObjectiveStore();
  expect(store).toBeInstanceOf(ObjectiveStore);

  return <p>TEST</p>;
};

describe('objective-store-provider', () => {
  describe('create provider', () => {
    it('should render a provider and children components', () => {
      const objectiveStore = new ObjectiveStore();
      render(
        <ObjectiveStoreProvider objectiveStore={objectiveStore}>
          <TestComponent />
        </ObjectiveStoreProvider>
      );
      screen.findByText('TEST');
    });
  });
});
