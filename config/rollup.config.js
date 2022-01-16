// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const commonjs = require('@rollup/plugin-commonjs');
const pkgJson = require('../package.json');

const input = 'src/index.ts';
const testInput = 'src/test/index.ts';

const plugins = [
  typescript(),
  nodeResolve(),
  commonjs(),
  peerDepsExternal(),
];

export default [
  {
    input,
    output: {
      file: pkgJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    output: {
      file: pkgJson.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: testInput,
    output: {
      file: pkgJson.test,
      format: 'cjs',
      sourcemap: true,
    },
    plugins,
  },
];
