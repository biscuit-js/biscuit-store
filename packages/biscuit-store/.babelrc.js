const loose = true

module.exports = {
  presets: [
    '@babel/typescript',
    [
      '@babel/env',
      {
        targets: {
          browsers: ['ie >= 11']
        },
        exclude: ['transform-async-to-generator', 'transform-regenerator'],
        modules: false,
        loose: true
      }
    ]
  ],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread'],
    ['@babel/plugin-transform-runtime'],
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/plugin-transform-regenerator"]
  ].filter(Boolean)
}