if (!Object.values) Object.values = o => Object.keys(o).map(k => o[k]);
var windowWidth, windowHeight;

function fit2(_cb) {
    console.log("into fit2");
    _cb()
}

function sleep(s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('promise resolved')
        }, s)
    })
}

function fitImageScreen(e, _callback) {
    //获取屏幕宽高 
    var imageSize = {};
    var originalWidth = e.detail.width; //图片原始宽 
    var originalHeight = e.detail.height; //图片原始高 
    var originalScale = originalHeight / originalWidth; //图片高宽比 
    //console.log('originalWidth: ' + originalWidth)
    //console.log('originalHeight: ' + originalHeight)
    //console.log("typeof _callback is " , typeof _callback)
    if (!!windowWidth) {
        //console.log("into second util")
        var windowscale = windowHeight / windowWidth; //屏幕高宽比 
        //console.log('windowWidth: ' + windowWidth)
        //console.log('windowHeight: ' + windowHeight)
        if (originalWidth < windowWidth) {
            imageSize.imageWidth = originalWidth;
            imageSize.imageHeight = originalHeight;
            //console.log("imageSize 1", imageSize)
            _callback(imageSize);
            return;
        }
        if (originalScale < windowscale) { //图片高宽比小于屏幕高宽比 
            //图片缩放后的宽为屏幕宽 
            imageSize.imageWidth = windowWidth;
            imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
        } else { //图片高宽比大于屏幕高宽比 
            //图片缩放后的高为屏幕高 
            imageSize.imageHeight = windowHeight;
            imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
        }
        //console.log("imageSize 2", imageSize)
        _callback(imageSize);
    } else {
        //console.log("into first time")
        wx.getSystemInfo({
            success: function(res) {
                //console.log("typeof _callback is " , typeof _callback)
                windowWidth = res.windowWidth;
                windowHeight = res.windowHeight;
                //console.log("windowWidth is ",windowWidth, " windowHeight is ", windowHeight)
                var windowscale = windowHeight / windowWidth; //屏幕高宽比 
                //console.log('windowWidth: ' + windowWidth)
                //console.log('windowHeight: ' + windowHeight)
                if (originalWidth < windowWidth) {
                    imageSize.imageWidth = originalWidth;
                    imageSize.imageHeight = originalHeight;
                    //console.log("imageSize 1", imageSize)
                    _callback(imageSize);
                    return;
                }
                if (originalScale < windowscale) { //图片高宽比小于屏幕高宽比 
                    //图片缩放后的宽为屏幕宽 
                    imageSize.imageWidth = windowWidth;
                    imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
                } else { //图片高宽比大于屏幕高宽比 
                    //图片缩放后的高为屏幕高 
                    imageSize.imageHeight = windowHeight;
                    imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
                }
                //console.log("imageSize 2", imageSize)
                _callback(imageSize);
            }
        })
    }



    //console.log('缩放后的宽: ' + imageSize.imageWidth)
    //console.log('缩放后的高: ' + imageSize.imageHeight)

}

function DateFormat(d) {
    var mm = d.getMonth() + 1;
    var dd = d.getDate();
    return [d.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
};

const richTextAdapter = {
    "s": "del",
    "u": "p"
}

function buildRichTextObj(node) {
    // let that = this;
    let rtobj = {};
    let rtattrs = {};
    if (node) {
        let tag = node.tag;
        //let tagType = node.tagType;
        if (node.node == 'element') {
            // rtobj.type = 'node';
            if (richTextAdapter[tag]) {
                rtobj.name = richTextAdapter[tag];
            } else {
                rtobj.name = tag;
            }
            if (node.attr) {
                rtattrs = {...node.attr };
                for (let attr in rtattrs) {
                    let _v = rtattrs[attr];
                    if (typeof _v == "object") {
                        if (_v instanceof Array) {
                            rtattrs[attr] = _v.join("")
                        }
                    }
                }
                if (tag == 'img') {
                    rtattrs.class = 'rt-wxa-image'
                        // rtattrs.style = `${rtattrs.style};width:80%;display:block;margin:auto;`;	
                }
                rtobj.attrs = rtattrs;
            }

            if (node.nodes && node.nodes.length > 0) {
                let children = [];
                node.nodes.forEach(function(n) {
                    let sub_rtobj = buildRichTextObj(n)
                    children.push(sub_rtobj)
                })
                rtobj.children = children;
            }
        } else if (node.node == 'text') {
            rtobj.type = 'text';
            rtobj.text = node.text;
        }
    }
    return rtobj;
}

/**
 * 存储用户在某部门（昵称）下的昵称
 * @param userId
 * @param deparmentNo
 * @param nickName
 */
function saveUserDept2Buffer(userId, departmentNo, nickName) {
    console.log("save info", userId, departmentNo, nickName)
    let key = `${userId}_${departmentNo}`;
    let userDeptInfo = wx.getStorageSync("user:deptinfo");
    if (!userDeptInfo) { userDeptInfo = {}; }
    if (!userDeptInfo[key]) { userDeptInfo[key] = {}; }
    userDeptInfo[key] = nickName;
    wx.setStorageSync('user:deptinfo', userDeptInfo)
}

/**
 * 获取用户在某部门（班级）下的昵称
 * @param userId
 * @param departmentNo
 * @returns {string}
 */
function getUserNickNameByDept(userId, departmentNo) {
    let key = `${userId}_${departmentNo}`;
    let userDeptInfo = wx.getStorageSync("user:deptinfo");
    if (userDeptInfo && userDeptInfo[userId]) {
        return userDeptInfo[key] ? userDeptInfo[key] : "";
    } else {
        return "";
    }
}

function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}


/*获取当前页url*/
function getCurrentPageUrl() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    var options = currentPage.options //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
/* 精确乘法 */
function accMul(arg1, arg2) {
    let m = 0
    let s1 = arg1.toString()
    let s2 = arg2.toString()
    try {
        m += s1.split('.')[1].length
    } catch (e) {}
    try {
        m += s2.split('.')[1].length
    } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}
/* 精确减法 */
function accSubduction(arg1, arg2) {
    let r1 = ''
    let r2 = ''
    let m = ''
    let n = ''
    try {
        r1 = arg1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

function editDate(date) {
    let newDate = new Date(date.replace(/-/g, '/'))
    let minutes = newDate.getMinutes()
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    return (newDate.getMonth() + 1) + '月' + newDate.getDate() + '日 ' + newDate.getHours() + ':' + minutes
}
/*优惠券类型处理*/
function setPromotions(type) {
    switch (type) {
        case 1:
            type = "秒杀券";
            break;
        case 2:
            type = "满减券";
            break;
        case 3:
            type = "折扣券";
            break;
    }
    return type
}

function checkFullSucreen() {
    let that = this;
    if (this.$parent.globalData.isFullSucreen != null) {
        that.isFullSucreen = true;
    } else {
        wx.getSystemInfo({
            success: function(res) {
                console.log(res, "this is res"); // 根据 屏幕高度 进行判断
                if (res.model.search("iPhone X") != -1) {
                    that.isFullSucreen = true;
                    this.$parent.globalData.isFullSucreen = true;
                }

            }
        });
    }

}

function getCartAmount(cartDatas) {
    let cartAmount = 0
    if (cartDatas && Object.keys(cartDatas).length > 0) {
        Object.values(cartDatas).map(item => {
            cartAmount += item.amount
        })
    }
    return cartAmount
        /*
    console.log("into update Cart badge num, the cart is ", cartDatas)
    wx.setTabBarBadge({
        index: 1,
        text: cartAmount.toString()
    })
    wx.removeTabBarBadge({ index: 1 })*/
}
/*获取购物数量*/
function getCard() {
    let cardDatas = wx.getStorageSync("cart");
    if (cardDatas && cardDatas.length > 0) {
        let cartAmount = 0
        cardDatas.map(item => {
            cartAmount += item.amount
        })
        wx.setTabBarBadge({
            index: 2,
            text: cartAmount.toString()
        })
    } else {
        wx.removeTabBarBadge({
            index: 2,
        })
    }
}
/* 传入时间 获取当天的时间戳*/
function getDateStamp(time) {
    let day = new Date()
    let currTime = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()
    return new Date(currTime + ' ' + time).getTime()
}
/* 从历史选择店铺 */
function setChooseShop(id, newshopinfo) {
    let histryShopInfo = wx.getStorageSync("histryShopInfo");
    let shopInfo = wx.getStorageSync("shopInfo");
    let arry = [];
    if (histryShopInfo.length > 0) {
        histryShopInfo.map(item => {
            if (item.id !== newshopinfo.id) {
                arry.push(item);
            }
        });
    }
    if (shopInfo) {
        arry.push(shopInfo);
        wx.setStorageSync("histryShopInfo", arry);
    }
    wx.setStorageSync("shopInfo", newshopinfo);
    wx.navigateBack({ delta: 1 });
}
/* 切换商店 */
function setChangeShop(isChange, shopData) {
    let shopInfo = isChange ? shopData.newShopInfo : shopData.shopInfo;
    wx.setStorageSync("shopInfo", shopInfo);

    // 编辑历史店铺
    let histryShopInfo = wx.getStorageSync("histryShopInfo");
    histryShopInfo = histryShopInfo ? histryShopInfo : [];
    if (histryShopInfo.length > 0) {
        // 把当前的店铺 从历史里去除
        let arry = [];
        histryShopInfo.map(item => {
            if (item.id !== shopInfo.id) {
                arry.push(item);
            }
        });
        if (isChange) {
            arry.push(shopData.shopInfo);
        }
        wx.setStorageSync("histryShopInfo", arry);
    } else {
        if (isChange) {
            wx.setStorageSync("histryShopInfo", [shopData.shopInfo]);
        }
    }
}

/* 通过id 帅选 item */
function getItemValue(arry, id) {
    let vItem = {}
    arry.map(item => {
        if (id === item.id) {
            vItem = item
        }
    })
    return vItem
}
module.exports = {
    getCard: getCard,
    getCartAmount: getCartAmount,
    fit2: fit2,
    sleep: sleep,
    fitImageScreen: fitImageScreen,
    DateFormat: DateFormat,
    buildRichTextObj: buildRichTextObj,
    saveUserDept2Buffer: saveUserDept2Buffer,
    getUserNickNameByDept: getUserNickNameByDept,
    formatLocation: formatLocation,
    getCurrentPageUrl: getCurrentPageUrl,
    getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,

    accMul: accMul,
    accSubduction: accSubduction,
    editDate: editDate,
    setPromotions: setPromotions,
    getDateStamp: getDateStamp,
    setChooseShop: setChooseShop,
    getItemValue: getItemValue,
    setChangeShop: setChangeShop
}