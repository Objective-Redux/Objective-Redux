// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
const path = require('path');
const expectedHeader = require('./eslint-expected-header');

const universalRules = {
  'for-direction': ['error'],
  'getter-return': ['error'],
  'no-async-promise-executor': ['error'],
  'no-await-in-loop': ['error'],
  'no-compare-neg-zero': ['error'],
  'no-cond-assign': ['error', 'always'],
  'no-console': ['error'],
  'no-constant-condition': ['error'],
  'no-debugger': ['error'],
  'no-dupe-args': ['error'],
  'no-dupe-keys': ['error'],
  'no-duplicate-case': ['error'],
  'no-empty': ['error'],
  'no-empty-character-class': ['error'],
  'no-ex-assign': ['error'],
  'no-extra-boolean-cast': ['error'],
  'no-extra-semi': ['error'],
  'no-func-assign': ['error'],
  'no-import-assign': ['error'],
  'no-inner-declarations': ['error'],
  'no-invalid-regexp': ['error'],
  'no-obj-calls': ['error'],
  'no-prototype-builtins': ['error'],
  'no-regex-spaces': ['error'],
  'no-sparse-arrays': ['error'],
  'no-template-curly-in-string': ['error'],
  'no-unexpected-multiline': ['error'],
  'no-unreachable': ['error'],
  'no-unsafe-finally': ['error'],
  'no-unsafe-negation': ['error'],
  'require-atomic-updates': ['error'],
  'use-isnan': ['error'],
  'valid-typeof': ['error'],
  'array-callback-return': ['error'],
  'block-scoped-var': ['error'],
  curly: ['error'],
  // 'default-param-last': ['error'],
  'dot-location': ['error', 'property'],
  'dot-notation': ['error'],
  eqeqeq: ['error', 'smart'],
  'guard-for-in': ['error'],
  'no-alert': ['error'],
  'no-case-declarations': ['error'],
  'no-empty-pattern': ['error'],
  'no-eval': ['error'],
  'no-extend-native': ['error'],
  'no-extra-bind': ['error'],
  'no-extra-label': ['error'],
  'no-fallthrough': ['error'],
  'no-floating-decimal': ['error'],
  'no-global-assign': ['error'],
  'no-implicit-coercion': ['error'],
  'no-implied-eval': ['error'],
  'no-labels': ['error'],
  'no-lone-blocks': ['error'],
  'no-loop-func': ['error'],
  'no-multi-spaces': ['error'],
  'no-new': ['error'],
  'no-octal': ['error'],
  'no-octal-escape': ['error'],
  'no-param-reassign': ['error'],
  'no-proto': ['error'],
  'no-redeclare': ['error'],
  'no-return-assign': ['error', 'always'],
  'no-return-await': ['error'],
  'no-script-url': ['error'],
  'no-self-assign': ['error'],
  'no-self-compare': ['error'],
  'no-sequences': ['error'],
  'no-throw-literal': ['error'],
  'no-unmodified-loop-condition': ['error'],
  'no-unused-expressions': ['error'],
  'no-unused-labels': ['error'],
  'no-useless-concat': ['error'],
  'no-useless-escape': ['error'],
  'no-useless-return': ['error'],
  'no-void': ['error'],
  'no-with': ['error'],
  'prefer-named-capture-group': ['error'],
  'prefer-promise-reject-errors': ['error'],
  'prefer-regex-literals': ['error'],
  'require-await': ['error'],
  yoda: ['error'],
  'no-delete-var': ['error'],
  'no-label-var': ['error'],
  'no-shadow': ['error'],
  'no-shadow-restricted-names': ['error'],
  'no-undef': ['error'],
  'no-undef-init': ['error'],
  'no-undefined': ['error'],
  'no-use-before-define': [
    'error',
    {
      functions: false,
      classes: false,
      variables: true,
    },
  ],
  'callback-return': ['error'],
  'global-require': ['error'],
  'no-new-require': ['error'],
  'no-path-concat': ['error'],
  'no-process-exit': ['error'],
  'no-sync': ['error'],
  'array-bracket-newline': [
    'error',
    {
      multiline: true,
      minItems: 4,
    },
  ],
  'array-bracket-spacing': ['error', 'never'],
  'array-element-newline': [
    'error',
    'consistent',
  ],
  'block-spacing': ['error'],
  'brace-style': [
    'error',
    '1tbs',
    {
      allowSingleLine: true,
    },
  ],
  camelcase: ['error'],
  // 'capitalized-comments': ['error'],
  'comma-dangle': [
    'error',
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    },
  ],
  'comma-spacing': ['error'],
  'comma-style': ['error'],
  'computed-property-spacing': [
    'error',
    'never',
    {
      enforceForClassMembers: true,
    },
  ],
  'eol-last': ['error'],
  'func-call-spacing': ['error'],
  'function-call-argument-newline': ['error', 'consistent'],
  'function-paren-newline': ['error', 'multiline-arguments'],
  'id-blacklist': [
    'error',
    'data',
    'res',
    'ret',
    'value',
    'val',
    'v',
    'arg',
    'args',
    'result',
    'results',
    'response',
    'responses',
    'err',
    'error',
  ],
  'implicit-arrow-linebreak': ['error'],
  indent: [
    'error',
    2,
    {
      SwitchCase: 1,
    },
  ],
  'jsx-quotes': ['error', 'prefer-double'],
  'key-spacing': ['error'],
  'keyword-spacing': ['error'],
  'line-comment-position': ['error'],
  'linebreak-style': ['error', 'unix'],
  'lines-between-class-members': ['error'],
  'max-depth': [
    'error',
    {
      max: 2,
    },
  ],
  'max-len': [
    'error',
    {
      code: 120,
      tabWidth: 2,
    },
  ],
  'max-lines-per-function': [
    'error',
    {
      max: 80,
      skipBlankLines: true,
      skipComments: true,
    },
  ],
  'max-nested-callbacks': [
    'error',
    {
      max: 2,
    },
  ],
  'max-params': [
    'error',
    {
      max: 2,
    },
  ],
  'max-statements': [
    'error',
    {
      max: 12,
    },
  ],
  'max-statements-per-line': [
    'error',
    {
      max: 1,
    },
  ],
  // 'multiline-comment-style': ['error'],
  'multiline-ternary': ['error', 'always-multiline'],
  'new-cap': ['error'],
  'new-parens': ['error', 'always'],
  'newline-per-chained-call': ['error'],
  'no-array-constructor': ['error'],
  'no-lonely-if': ['error'],
  'no-mixed-operators': ['error'],
  'no-multi-assign': ['error'],
  'no-multiple-empty-lines': [
    'error',
    {
      max: 1,
      maxBOF: 1,
      maxEOF: 1,
    },
  ],
  'no-nested-ternary': ['error'],
  'no-new-object': ['error'],
  'no-trailing-spaces': ['error'],
  'no-underscore-dangle': [
    'error',
    {
      enforceInMethodNames: false,
    },
  ],
  'no-unneeded-ternary': ['error'],
  'no-whitespace-before-property': ['error'],
  'object-curly-newline': [
    'error',
    {
      multiline: true,
      minProperties: 4,
      consistent: true,
    },
  ],
  'object-curly-spacing': ['error', 'always'],
  'one-var': ['error', 'never'],
  'operator-assignment': ['error', 'always'],
  'operator-linebreak': ['error', 'before'],
  'quote-props': ['error', 'as-needed'],
  quotes: ['error', 'single'],
  semi: ['error', 'always'],
  'semi-spacing': [
    'error',
    {
      before: false,
      after: true,
    },
  ],
  'semi-style': ['error', 'last'],
  'space-before-blocks': ['error', 'always'],
  'space-before-function-paren': ['error', 'never'],
  'space-in-parens': ['error', 'never'],
  'space-unary-ops': [
    'error',
    {
      words: true,
      nonwords: false,
    },
  ],
  'spaced-comment': ['error', 'always'],
  'switch-colon-spacing': ['error'],
  'template-tag-spacing': ['error'],
  'arrow-body-style': ['error', 'as-needed'],
  'arrow-parens': ['error', 'as-needed'],
  'arrow-spacing': [
    'error',
    {
      before: true,
      after: true,
    },
  ],
  'constructor-super': ['error'],
  'generator-star-spacing': [
    'error',
    {
      before: false,
      after: true,
    },
  ],
  'no-class-assign': ['error'],
  'no-confusing-arrow': ['error'],
  'no-const-assign': ['error'],
  'no-dupe-class-members': ['error'],
  'no-duplicate-imports': ['error'],
  'no-new-symbol': ['error'],
  'no-this-before-super': ['error'],
  'no-useless-computed-key': ['error'],
  'no-useless-constructor': ['error'],
  'no-useless-rename': ['error'],
  'no-var': ['error'],
  'prefer-const': ['error'],
  'prefer-destructuring': ['error'],
  'prefer-template': ['error'],
  'rest-spread-spacing': ['error', 'never'],
  'template-curly-spacing': ['error', 'never'],
  'yield-star-spacing': ['error', 'after'],
  'header/header': [
    'error',
    'line',
    expectedHeader.header,
    {
      lineEndings: 'unix',
    },
  ],
  'react/boolean-prop-naming': ['error'],
  'react/destructuring-assignment': ['error'],
  'react/forbid-elements': [
    'error',
    {
      forbid: ['iframe'],
    },
  ],
  'react/no-access-state-in-setstate': ['error'],
  'react/no-array-index-key': ['error'],
  'react/no-children-prop': ['error'],
  'react/no-danger': ['error'],
  'react/no-danger-with-children': ['error'],
  'react/no-deprecated': ['error'],
  'react/no-did-mount-set-state': ['error'],
  'react/no-did-update-set-state': ['error'],
  'react/no-direct-mutation-state': ['error'],
  'react/no-find-dom-node': ['error'],
  'react/no-is-mounted': ['error'],
  'react/no-multi-comp': ['error'],
  'react/no-redundant-should-component-update': ['error'],
  'react/no-render-return-value': ['error'],
  'react/no-set-state': ['error'],
  'react/no-string-refs': ['error'],
  'react/no-this-in-sfc': ['error'],
  'react/no-unknown-property': ['error'],
  'react/no-unsafe': ['error'],
  'react/no-unused-prop-types': ['error'],
  'react/no-will-update-set-state': ['error'],
  'react/prefer-es6-class': ['error'],
  'react/require-default-props': ['error'],
  'react/require-render-return': ['error'],
  'react/self-closing-comp': ['error'],
  'react/style-prop-object': ['error'],
  'react/void-dom-elements-no-children': ['error'],
  'react/jsx-boolean-value': ['error', 'never'],
  'react/jsx-closing-bracket-location': ['error'],
  'react/jsx-closing-tag-location': ['error'],
  'react/jsx-curly-newline': [
    'error',
    'consistent',
  ],
  'react/jsx-curly-spacing': [
    'error',
    {
      when: 'never',
      children: true,
    },
  ],
  'react/jsx-equals-spacing': ['error'],
  'react/jsx-filename-extension': [
    'error',
    {
      extensions: ['.tsx', '.jsx'],
    },
  ],
  'react/jsx-first-prop-new-line': ['error'],
  'react/jsx-indent': [
    'error',
    2,
    {
      checkAttributes: true,
      indentLogicalExpressions: true,
    },
  ],
  'react/jsx-indent-props': ['error', 2],
  'react/jsx-key': ['error'],
  'react/jsx-max-depth': [
    'error',
    {
      max: 5,
    },
  ],
  'react/jsx-max-props-per-line': [
    'error',
    {
      maximum: 3,
    },
  ],
  'react/jsx-no-duplicate-props': ['error'],
  'react/jsx-no-target-blank': ['error'],
  'react/jsx-no-undef': ['error'],
  'react/jsx-no-useless-fragment': ['error'],
  'react/jsx-one-expression-per-line': [
    'error',
    {
      allow: 'single-child',
    },
  ],
  'react/jsx-fragments': ['error', 'syntax'],
  'react/jsx-pascal-case': ['error'],
  'react/jsx-props-no-multi-spaces': ['error'],
  'react/jsx-tag-spacing': ['error'],
  'react/jsx-uses-react': ['error'],
  'react/jsx-uses-vars': ['error'],
  'react/jsx-wrap-multilines': ['error'],
  'jsdoc/check-alignment': [
    'error',
    {
      require: {
        ArrowFunctionExpression: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
    },
  ],
  'jsdoc/check-indentation': ['error'],
  'jsdoc/check-param-names': ['error'],
  'jsdoc/check-types': ['error'],
  'jsdoc/implements-on-classes': [
    'error',
    {
      require: {
        ArrowFunctionExpression: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
    },
  ],
  'jsdoc/match-description': ['error'],
  'jsdoc/newline-after-description': ['error'],
  'jsdoc/no-types': [
    'error',
    {
      require: {
        ArrowFunctionExpression: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
    },
  ],
  'jsdoc/no-undefined-types': ['error'],
  'jsdoc/require-description': ['error'],
  'jsdoc/require-description-complete-sentence': ['error'],
  // 'jsdoc/require-jsdoc': [
  //   'error',
  //   {
  //     'require': {
  //       'ArrowFunctionExpression': true,
  //       'FunctionExpression': true,
  //       'MethodDefinition':true
  //     }
  //   }
  // ],
  'jsdoc/require-param': ['error'],
  'jsdoc/require-param-description': [
    'error',
    {
      require: {
        ArrowFunctionExpression: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
    },
  ],
  'jsdoc/require-param-name': [
    'error',
    {
      require: {
        ArrowFunctionExpression: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
    },
  ],
  'jsdoc/require-returns': ['error'],
  'jsdoc/require-returns-description': [
    'error',
    {
      require: {
        ArrowFunctionExpression: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
    },
  ],
  'jsdoc/valid-types': [
    'error',
    {
      require: {
        ArrowFunctionExpression: true,
        FunctionExpression: true,
        MethodDefinition: true,
      },
    },
  ],
};

const typescriptRules = {
  'filenames/match-regex': ['error', '^[a-z-]+(\\.test)?$', true],
  'filenames/match-exported': ['error', 'kebab'],
  // 'import/no-unused-modules': [
  //   'error',
  //   {
  //     unusedExports: true,
  //   },
  // ],
  'import/order': [
    'error',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'unknown',
        'parent',
        'sibling',
        'index',
      ],
    },
  ],
  'import/first': ['error'],
  'import/no-mutable-exports': ['error'],
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: [
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      optionalDependencies: true,
      peerDependencies: true,
      bundledDependencies: false,
    },
  ],
  'import/no-deprecated': ['error'],
  'import/no-cycle': ['error'],
  '@typescript-eslint/no-unused-vars': ['error'],
  '@typescript-eslint/adjacent-overload-signatures': ['error'],
  '@typescript-eslint/array-type': ['error'],
  '@typescript-eslint/await-thenable': ['error'],
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: false,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: false,
    },
  ],
  '@typescript-eslint/explicit-member-accessibility': ['error'],
  '@typescript-eslint/member-delimiter-style': ['error'],
  '@typescript-eslint/no-misused-new': ['error'],
  '@typescript-eslint/no-misused-promises': ['error'],
  '@typescript-eslint/no-parameter-properties': ['error'],
  '@typescript-eslint/no-require-imports': ['error'],
  '@typescript-eslint/prefer-readonly': ['error'],
  '@typescript-eslint/prefer-string-starts-ends-with': ['error'],
  '@typescript-eslint/type-annotation-spacing': ['error'],
  '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
};

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: ['plugin:cypress/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __RUNTIME__: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: path.resolve(__dirname, 'tsconfig.json'),
    tsconfigRootDir: `${__dirname}/../`,
  },
  plugins: [
    'react',
    'header',
    'jsdoc',
    'filenames',
    '@typescript-eslint',
    'import',
  ],
  rules: {
    ...universalRules,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.d.ts',
    ],
  },
  overrides: [
    {
      files: [
        '*.js',
        '*.jsx',
      ],
      rules: {
        ...universalRules,
      },
    },
    {
      files: [
        '*.ts',
        '*.tsx',
      ],
      rules: {
        ...universalRules,
        ...typescriptRules,
        'react/jsx-no-bind': ['error'],
      },
    },
    {
      files: [
        '*.test.jsx',
        '*.test.ts',
        '*.test.tsx',
      ],
      rules: {
        ...universalRules,
        ...typescriptRules,
        'max-lines-per-function': ['off'],
        'max-depth': ['off'],
        'max-nested-callbacks': ['off'],
        'max-statements': ['off'],
        'import/no-unused-modules': ['off'],
        'import/first': ['off'],
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'no-underscore-dangle': 'off',
        'filenames/match-regex': 'off',
      },
    },
  ],
};
