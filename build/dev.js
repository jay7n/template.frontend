const path = require('path')
const webpack = require('webpack')
const chalk = require('chalk')
const opn = require('opn')

const Conf = require('../config/conf')
let devWebpackConfig = require(path.resolve(Conf.RootPath, 'config', 'webpack', 'dev.conf'))

function _log_start_listen() {
    const host = Conf.Dev.Host
    const port = Conf.Dev.Port

    const uri = `http://${host}:${port}`

    const _report = () => {
        console.log(chalk.green('> app listening at ' + uri + '  ... ͼ\n'))
    }

    return {host, port, uri, _report}
}

function main() {
    const isHMRMode = Conf.HMR
    let hotMiddleware = null

    const express = require('express')
    const webpackDevMiddleware = require('webpack-dev-middleware')

    if (isHMRMode) {
        Object.keys(devWebpackConfig.entry).forEach(function (name) {
            devWebpackConfig.entry[name] = ['webpack-hot-middleware/client'].concat(devWebpackConfig.entry[name])
        })
    }

    const compiler = webpack(devWebpackConfig)

    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: devWebpackConfig.output.publicPath,
        inline: true,
    })

    const app = express()
    app.use(devMiddleware)
    app.use('/assets', express.static(path.resolve(Conf.RootPath, 'assets')))

    if (isHMRMode) {
        console.log(chalk.cyan('HMR mode triggered.'))
        const webpackHotMiddleware = require('webpack-hot-middleware')
        hotMiddleware = webpackHotMiddleware(compiler, {
            log: () => {}
        })
        app.use(hotMiddleware)
    }

    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            if (isHMRMode) {
                hotMiddleware.publish({ action: 'reload' })
            }
            cb()
        })
    })

    const { host, port, uri, _report } = _log_start_listen()
    app.listen(port, host)

    devMiddleware.waitUntilValid(() => {
        _report()

        if (Conf.AutoOpenBrowser) {
            opn(uri)
        }
    })
}


if (require.main === module) {
    main()
} else {
    module.exports = main
}
