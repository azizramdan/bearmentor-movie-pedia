import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'type'],
      'node/prefer-global/process': ['off'],
    },
  },
  rules: {
    'curly': ['error', 'all'],
    'style/brace-style': ['error', '1tbs'],
  },
  formatters: {
    markdown: 'prettier',
  },
})
