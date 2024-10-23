module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  rules: {
    // You can customize rules here
    '@typescript-eslint/no-unused-vars': 'warn', // or 'error' if you prefer
  },
};
