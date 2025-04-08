module.exports = {
  extends: ['react-app'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Your custom rules here
  },
  // This will help resolve the path conflict
  ignorePatterns: ['node_modules/'],
}