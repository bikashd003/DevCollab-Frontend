module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'error', // This will cause ESLint to error on console.log
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
