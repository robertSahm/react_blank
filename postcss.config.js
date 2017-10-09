module.exports = {
  // parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      'features': {
        'autoprefixer': false
      }
    },
    'cssnano': {
      "preset": [
        "default",
        {'discardComments': {'removeAll': true}}
      ]
    },
    'lost': {},
    'postcss-simple-vars': {}
  }
}
