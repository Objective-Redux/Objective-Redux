// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import * as React from 'react';
import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { ObjectiveStoreProvider } from '../../src';

configure({ adapter: new Adapter() });

describe('objective-store-provider', () => {
  describe('create provider', () => {
    it('should render a provider and children components', () => {
      const child = <div />;
      const objectiveStore: any = {};
      const wrapper = shallow(
        <ObjectiveStoreProvider objectiveStore={objectiveStore}>
          {child}
        </ObjectiveStoreProvider>
      );
      expect(wrapper.find('div')).toHaveLength(1);
      expect(wrapper.prop('value')).toBe(objectiveStore);
    });
  });
});
