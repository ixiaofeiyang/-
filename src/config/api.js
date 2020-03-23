const appid = 'wx355bbf95fc53877a'
const env = 'production'
const constant = {
    fileServer: "https://hjl2c.dawangtv.cn",
    production: "https://hjl2c.dawangtv.cn",
    development: "https://hjl2c.dawangtv.cn",
    uploadimgFile: "https://llg2c.yunxiaoxin.net",
    fileServer: "https://llg2c.yunxiaoxin.net",
    production: "https://llg2c.yunxiaoxin.net",
    development: "https://llg2c.yunxiaoxin.net",
}

// urls 小程序的递归模块有问题，暂时使用两层结构，urls>auth>
let urls = {
    auth: {
        authorize: {
            method: 'POST',
            url: '/auth/wxa/llg'
        },
        updateuserinfo: {
            method: 'POST',
            url: '/auth/wxa/llg/updateuserinfo'
        },
        refreshToken: {
            method: 'GET',
            url: '/auth/wxa/refreshToken'
        },
        userDetail: {
            method: 'GET',
            url: '/auth/user/detail'
        },
        currentTime: {
            method: 'GET',
            url: '/auth/currentTime'
        },
        verifyCode: {
            method: 'GET',
            url: '/auth/wxa/sendVerifyCode'
        },
        updateusermobile: {
            method: 'POST',
            url: '/auth/wxa/llg/updateusermobile'
        }
    },
    baseService: {
        qrcode: {
            method: 'GET',
            url: '/api/wxmainapi/createTmpQRCode2'
        },
        fileUpload: {
            method: 'POST',
            url: '/file/upload'
        }
    },
    config: {
        baseInit: {
            method: "GET",
            url: ""
        }
    }
}

let disposeUrl = function(obj, prefix) {
    Object.keys(obj).forEach(function(v) {
        let subV = obj[v];
        Object.keys(subV).forEach(function(sv) {
            if (subV[sv].url) {
                subV[sv].url = prefix + subV[sv].url
            }
        })
    })
    return obj;
}

module.exports = {
    appid: appid,
    server: constant[env],
    fileServer: constant['fileServer'],
    uploadimgFile: constant['uploadimgFile'],
    api: disposeUrl(urls, constant[env])
}