// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '60',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [['@babel/plugin-proposal-class-properties']],
};
