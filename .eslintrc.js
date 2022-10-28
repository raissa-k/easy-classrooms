module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'standard',
	],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	ignorePatterns: ['public/**/*', 'views/**/*', '.github/'],
	rules: {
		'comma-dangle': ['error', 'only-multiline'],
		'no-unused-vars': ['error', { args: 'none' }],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		indent: ['error', 'tab'],
		quotes: ['error', 'single', { allowTemplateLiterals: true }],
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		'no-useless-escape': 'off',
		eqeqeq: 'off',
		'no-return-assign': 'off',
		'no-trailing-spaces': ['error', { ignoreComments: true }]
	},
}
