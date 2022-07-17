// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { render } from '@testing-library/react';

const customRender = (ui: any, options?: any): any => render(
  ui,
  {
    ...options,
  }
);

export * from '@testing-library/react';
export { customRender as render };
