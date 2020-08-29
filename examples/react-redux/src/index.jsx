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
import { Provider } from 'react-redux';
import {
  RegisterProvider, ReduxRegister, createAction, getActionNameForController,
} from 'objective-redux';
import ConnectedComponent from './connected-component';
import HookComponent from './hook-component';
import './store/lazy-loaded-state-controller';
import ReactReduxComponent from './react-redux-component';

export const register = new ReduxRegister({
  sagaContext: {
    test: 'Some Value',
  },
});
register.dispatch(createAction(getActionNameForController('lazy', 'test'))());

ReactDOM.render(
  <React.StrictMode>
    <RegisterProvider register={register}>
      <Provider store={register}>
        <ConnectedComponent />
        <HookComponent />
        <ReactReduxComponent />
        <div id="lazy">PROBLEM LAZY LOADING!!!</div>
      </Provider>
    </RegisterProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
