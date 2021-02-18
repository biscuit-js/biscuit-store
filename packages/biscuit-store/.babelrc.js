const loose = true

module.exports = {
  presets: [['@babel/env', { loose, modules: false }]],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose }],
    ['@babel/transform-modules-commonjs', { loose }],
    ['@babel/transform-runtime'],
    ["@babel/plugin-proposal-class-properties"]
  ].filter(Boolean)
}