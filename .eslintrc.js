'use strict';

module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 2015,
    },
    rules: {
        'array-bracket-spacing': [ 'error', 'always' ],
        'comma-dangle': [ 'error', 'always-multiline' ],
        indent: [ 'error', 4 ],
        'linebreak-style': [ 'error', 'unix' ],
        'no-var': 'error',
        'object-curly-spacing': [ 'error', 'always' ],
        quotes: [ 'error', 'single' ],
        semi: [ 'error', 'always' ],
        strict: [ 'error', 'global' ],
        'template-curly-spacing': [ 'error', 'always' ],
    },
};
