// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkgJson from './package.json';

const input = 'src/index.ts';
const plugins = [
  typescript(),
  nodeResolve(),
  commonjs(),
];

export default [
  {
    input,
    output: {
      file: pkgJson.main,
      format: 'cjs',
    },
    plugins,
  },
  {
    input,
    output: {
      file: pkgJson.module,
      format: 'esm',
    },
    plugins,
  },
];
