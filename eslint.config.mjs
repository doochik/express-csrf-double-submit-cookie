import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    { languageOptions: { globals: globals.node } },
    {
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            'no-var': 'error',
            '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
            '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
            '@stylistic/indent': [ 'error', 4 ],
            '@stylistic/linebreak-style': [ 'error', 'unix' ],
            '@stylistic/no-multiple-empty-lines': 'error',
            '@stylistic/object-curly-spacing': [ 'error', 'always' ],
            '@stylistic/quote-props': [ 'error', 'as-needed', {
                keywords: true,
                numbers: true,
            } ],
            '@stylistic/quotes': [ 'error', 'single', {
                allowTemplateLiterals: true,
            } ],
            '@stylistic/semi': [ 'error', 'always' ],
            '@stylistic/template-curly-spacing': [ 'error', 'always' ],

            '@typescript-eslint/consistent-type-imports': [ 'error' ],
        },
    },
);
