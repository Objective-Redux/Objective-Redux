// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import React from 'react';
import ReactDOM from 'react-dom';
import {
  ReduxRegister,
  RegisterProvider,
  createAction,
  getActionNameForController,
} from 'objective-redux';

const applicationRoot= document.createElement('div');
applicationRoot.id = 'appMain';
document.body.appendChild(applicationRoot);

const preDispatchHook = action => import(/* webpackChunkName: "lazy" */ './LazyLoadedStateController');

const register = new ReduxRegister({
  preDispatchHook,
});

const action = createAction(
  getActionNameForController('lazy', 'test')
);

const load = () => {
  register.dispatch(action());
};

ReactDOM.render(
  <RegisterProvider register={register}>
    <div id="lazyTarget" />
    <button onClick={load} id="load-bundle">Click Me</button>
  </RegisterProvider>,
  applicationRoot
);
