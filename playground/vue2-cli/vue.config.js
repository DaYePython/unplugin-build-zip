const UnpluginBuildZip = require('@tonywater/unplugin-build-zip/webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      UnpluginBuildZip({
        filename: 'vue2-cli-dist'
      })
    ]
  }
}
