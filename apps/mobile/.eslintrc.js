module.exports = {
  extends: [
    'expo',
    '@react-native',
  ],
  rules: {
    // Disable some rules for mobile development
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
  },
}