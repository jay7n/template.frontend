var path = require('path')

module.exports = {
    RootPath: path.resolve(__dirname, '..'),

    Dev: {
        Host: '127.0.0.1',
        Port:9526
    },

    Prod: {
        Port: 9527
    },

    AutoOpenBrowser: true,

    HMR: false,

    FtpDeploy: {
        Dist: {
            Local: path.join(__dirname, '..', 'dist'),
            Remote: '/htdocs/playcanvasplayground/demo/',
        },
        Host: 'example.ftp.com',
        WWW: 'http://example.com/'
    }
}
