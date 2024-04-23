import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    { files: [ '**/*.js' ], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    {
        plugins: {
            '@stylistic/js': stylisticJs,
        },
        rules: {
            'no-var': 'error',
            '@stylistic/js/array-bracket-spacing': [ 'error', 'always' ],
            '@stylistic/js/comma-dangle': [ 'error', 'always-multiline' ],
            '@stylistic/js/indent': [ 'error', 4 ],
            '@stylistic/js/linebreak-style': [ 'error', 'unix' ],
            '@stylistic/js/no-multiple-empty-lines': 'error',
            '@stylistic/js/object-curly-spacing': [ 'error', 'always' ],
            '@stylistic/js/quote-props': [ 'error', 'as-needed', {
                keywords: true,
                numbers: true,
            } ],
            '@stylistic/js/quotes': [ 'error', 'single', {
                allowTemplateLiterals: true,
            } ],
            '@stylistic/js/semi': [ 'error', 'always' ],
            '@stylistic/js/template-curly-spacing': [ 'error', 'always' ],
        },
    },
];
