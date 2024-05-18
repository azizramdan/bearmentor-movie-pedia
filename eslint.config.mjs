import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
  rules: {
    'curly': ['error', 'all'],
    'style/brace-style': ['error', '1tbs'],
  },
})
