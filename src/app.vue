<style>
@import "style/app.wxss";
</style>
<script>
import wepy from "wepy";
import "./util/ald-stat";
import "wepy-async-function";
import { api, server, appid } from "./config/api";
const log = require("./util/log.js");
const EventBus = require("./util/eventbus");

// const argus_jserror_miniapp_compiled = require("./util/argus_jserror_miniapp_compiled");
// const argus_time_stat_miniapp_compiled = require("./util/argus_time_stat_miniapp_compiled");
export default class extends wepy.app {
  config = {
    pages: [
      "pages/user/index", //首页
      "pages/user/editaddress", //编辑收货地址
      "pages/user/transportinfo", //订单跟踪
      "pages/user/activity", //抢百元年货红包活动页
      "pages/user/activityinfo", //新人专享惊爆价活动页
      "pages/user/activityyears", //年货节礼券活动页
      "pages/user/categorylist", //分类列表页
      "pages/user/mycouponlist", //优惠券活动列表页
      "pages/user/searchlist", //搜索列表页
      "pages/user/addresslist2", //自提点列表页
      "pages/user/addresslist", //收货地址列表
      "pages/user/time", //营业时间页面
      "pages/user/cart", //购物车
      "pages/user/pay", //在线支付
      "pages/user/checkout", //确认订单
      "pages/user/my", //个人中心
      "pages/user/goods", //商品详情
      "pages/user/orderlist", //订单列表
      "pages/user/orderdetail", //订单详情
      "pages/user/payresult" //付款结果
    ],
    permission: {
      "scope.userLocation": {
        desc: "请允许获取您的地理位置授权，以便定位您附近的自提点"
      }
    },
    window: {
      backgroundTextStyle: "dark",
        navigationBarBackgroundColor: "#fb6890",
        backgroundColor: "#fb6890",
      // navigationBarBackgroundColor: "#B70F0D",
      // backgroundColor: "#B70F0D",
      navigationBarTitleText: "好集乐",
      navigationBarTextStyle: "white",
      enablePullDownRefresh: true,
      onReachBottomDistance: 50
    },
    tabBar: {
      backgroundColor: "#ffffff",
      borderStyle: "white",
      selectedColor: "#fb6890",
      color: "#b0b0b0",
      list: [
        {
          pagePath: "pages/user/index",
          iconPath: "static/images/ico_home.png",
          selectedIconPath: "static/images/ico_home_pressed.png",
          text: "首页"
        },
        {
          pagePath: "pages/user/categorylist",
          iconPath: "static/images/ico_category.png",
          selectedIconPath: "static/images/ico_category_pressed.png",
          text: "分类"
        },
        {
          pagePath: "pages/user/cart",
          iconPath: "static/images/ico_cart.png",
          selectedIconPath: "static/images/ico_cart_pressed.png",
          text: "购物车"
        },

        {
          pagePath: "pages/user/my",
          iconPath: "static/images/ico_my.png",
          selectedIconPath: "static/images/ico_my_pressed.png",
          text: "我的"
        }
      ]
    },
    navigateToMiniProgramAppIdList: ["wxeb490c6f9b154ef9"], //跳转小程序
    networkTimeout: {
      request: 10000,
      downloadFile: 10000
    },
    debug: false
  };

  Prequest(method = "GET") {
    let that = this;
    return function(url, data = {}, header = {}) {
      console.log(`发${method}请求:${url}`);
      log.info(`发${method}请求:${url}`);
      return new Promise(function(resolve, reject) {
        if (!that.globalData.token) {
          return reject("token is null");
        }
        let defaultheader = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${that.globalData.token}`
        };
        for (let key in header) {
          defaultheader[key] = header[key];
        }
        wx.request({
          url,
          data,
          method,
          header: defaultheader,
          success: function(res) {
            if (res && res.data) {
              if (res.data.errCode == "200002") {
                //token 失效
                wx.showModal({
                  confirmColor: "#7ec792",
                  content: `登陆凭证失效，重新获取中`,
                  showCancel: false,
                  success: async function() {
                    wx.removeStorageSync("user:token");
                    await that.refreshToken();
                    //wx.navigateTo({ url: "/pages/auth/refreToken" });
                    wx.startPullDownRefresh();
                  }
                });
                wx.hideLoading();
                reject(res);
                return;
              } else if (res.data.errorCode) {
                console.error(res);
                let msg =
                  res.data.errorMsg || res.data.messasge || res.data.errmsg;
                wx.showModal({
                  confirmColor: "#7ec792",
                  content: msg,
                  showCancel: false
                });

                wx.hideLoading();
                reject(res);
                return;
              }
            }
            resolve(res.data);
          },
          fail: function(err) {
            console.error("系统错误", err);
            log.error(
              "请求错误的信息是" + JSON.stringify(err) + "请求错误的URL是" + url
            );
            let errorMsg = "";
            if (
              err.errMsg.indexOf("request:fail timeout") != -1 ||
              err.errMsg.indexOf("request:fail 请求超时") != -1 ||
              err.errMsg.indexOf("request:fail socket time") != -1
            ) {
              errorMsg = "网络超时，请刷新重试";
            }
            if (
              err.errMsg.indexOf("request:fail request unknow host error") != -1
            ) {
              errorMsg = "网络请求异常，请删除小程序重新进入";
            }
            wx.showModal({
              confirmColor: "#7ec792",
              content: errorMsg || err.errMsg,
              showCancel: false
            });
            wx.hideLoading();
            reject(err);
          }
        });
      });
    };
  }

  //上传文件
  Pupload() {
    let that = this;
    return function(url, filePath, name = "file", formData = {}, header = {}) {
      return new Promise(function(resolve, reject) {
        let defaultheader = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${that.globalData.token}`
        };
        for (let key in header) {
          defaultheader[key] = header[key];
        }
        wx.uploadFile({
          url,
          filePath,
          name,
          formData,
          header: defaultheader,
          success: function(res) {
            //console.log(res);
            resolve(res.data);
          },
          fail: function(err) {
            console.log("err, ", err);
            reject(err);
          }
        });
      });
    };
  }

  sleep = time => new Promise(resolve => setTimeout(resolve, time));

  constructor() {
    super();
    this.use("requestfix");
    this.use("promisify");
  }

  async onLaunch(options) {
    /*
        path	String	打开小程序的路径
        query	Object	打开小程序的query
        scene	Number	打开小程序的场景值
        shareTicket	String	shareTicket，详见 获取更多转发信息
        referrerInfo	Object	当场景为由从另一个小程序或公众号或App打开时，返回此字段
        referrerInfo.appId	String	来源小程序或公众号或App的 appId，详见下方说明
        referrerInfo.extraData	Object	来源小程序传过来的数据，scene=1037或1038时支持
        */
    console.log("into app.vue onlaunch");
    console.log(options, "options");

    let self = this;
    let result = wx.getSystemInfoSync(); //取运行环境
    self.globalData.environment = result.environment || "";
    if (result.environment == "wxwork") {
    }
    console.log("query is ", options.query);
    if (!!options.scene) {
      let { scene, query } = options;

      if (scene == 1011) {
        console.log("scene, query is ", scene, query.action);
        if (query.action == "openconsole") {
          wx.setEnableDebug({
            enableDebug: true
          });
        }
        if (query.action == "closeconsole") {
          wx.setEnableDebug({
            enableDebug: false
          });
        }
        if (query.action == "clearstorage") {
          try {
            wx.clearStorageSync();
          } catch (e) {
            // Do something when catch error
          }
        }
      }
      self.globalData.scene = options.scene; //huan
    }
    await self.initToken();
    if (!!options.shareTicket) {
      //发请求前先拿合法token
      self.globalData.shareTicket = options.shareTicket;
      // await sself.globalData.get(``)//发请求，告诉后端有ticket
    }
    //wx.showLoading({ title: "加载中", mask: true });
    let userinfo = self.globalData.userInfo || wx.getStorageSync("user:detail");
    console.log("in app.vue  launch, userinfo is(from local) ", userinfo);
    if (!userinfo) {
      if (!userinfo.nickname) {
        await self.refreshUserInfo();
      }
    }
    self._afterLaunch();
    //setInterval(()=>{console.log("check global user data", self.globalData.chatusers)},2000)
    wx.hideLoading();
  }
  _afterLaunch() {
    console.log("after launch");
    this.globalData.launched = true;
    // console.log('是否进入onlanuch');
    this.checkUpdateVersion();
  }
  //4.查询是否有新版本
  checkUpdateVersion() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse("getUpdateManager")) {
      //创建 UpdateManager 实例
      let updateManager = wx.getUpdateManager();
      console.log("进入到checkUpdateVersion方法");
      //检测版本更新
      updateManager.onCheckForUpdate(function(res) {
        console.log("获取远端小程序版本");
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function() {
            //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
            updateManager.applyUpdate();
          });
          updateManager.onUpdateFailed(function() {
            // 新版本下载失败
            wx.showModal({
              title: "已经有新版本喽~",
              content:
                "请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~"
            });
          });
        }
      });
    }
  }
  async refreshToken() {
    let self = this;
    let url = `${api.auth.authorize.url}`;
    wx.showLoading({ title: "重新获取token中", mask: true });
    if (!this.globalData.launched) return;
    this.globalData.launched = false;
    let login_result = await wepy.login();

    self.globalData.loginInfo.code = login_result.code;
    this.globalData.codetimer = setTimeout(() => {
      self.globalData.loginInfo.code = null;
    }, 1000 * 60 * 60 * 1);
    let formdata = {
      code: login_result.code,
      scene: self.globalData.scene,
      environment: self.globalData.environment
    };
    let res = await wepy.request({
      url: url,
      data: formdata,
      method: "POST"
    });
    self.globalData.token = res.data.token;
    wx.setStorageSync("user:token", self.globalData.token);
    let duration = 60 * 60 * 24 * 6;
    wx.setStorageSync(
      "user:expireTime",
      new Date().getTime() + duration * 1000
    );
    //await this.$parent.globalData.refreshUserInfo();
    this.globalData.launched = true;
    wx.hideLoading();
  }
  async initToken() {
    //初始化token 数据以globalData中为准
    let needlogin = false;
    let token = (this.globalData.token =
      this.globalData.token || wx.getStorageSync("user:token"));
    let now = parseFloat(new Date().getTime());
    let eptime = parseFloat(
      this.globalData.expireTime || wx.getStorageSync("user:expireTime")
    );
    console.log("eptime is ", eptime, ";now is ", now);
    if (!eptime || eptime - now <= 86400000) {
      needlogin = true;
    }
    if (!token) needlogin = true;
    if (needlogin) {
      await this.login();
    }
  }
  qylogin() {
    return new Promise(function(resolve, reject) {
      wx.qy.login({
        success: function(res) {
          resolve(res);
        },
        fail: function(e) {
          reject(e);
        }
      });
    });
  }

  async login() {
    let self = this;
    let login_result;
    let url = `${api.auth.authorize.url}`;
    if (self.globalData.environment == "wxwork") {
      console.log("we go qy login");
      login_result = await self.qylogin();
      url = `${api.auth.authorizeqy.url}`;
    } else {
      login_result = await wepy.login();
    }
    console.log(
      " in app.vue login method:login_result is " + login_result.code
    );
    self.globalData.loginInfo.code = login_result.code;
    this.globalData.codetimer = setTimeout(() => {
      self.globalData.loginInfo.code = null;
    }, 1000 * 60 * 60 * 1);
    let formdata = {
      code: login_result.code,
      scene: self.globalData.scene,
      //utm_campaign : self.globalData.scene
      //utm_source : JSON.stringify(options)
      environment: self.globalData.environment
    };
    let res = await wepy.request({
      url: url,
      data: formdata,
      method: "POST"
    });
    // console.log("res is ");
    console.log(res);
    // console.log(res.data.token);
    // self.globalData.token = res.data.token;
    console.log("res is appid", api, appid);
    var openid = "";
    if (res.data.userinfo.identifier) {
      openid = res.data.userinfo.identifier;
    } else {
      let info = res.data.userinfo.Passports;
      info.map(item => {
        if (item.appid == appid) {
          openid = item.identifier;
        }
      });
    }
    console.log("app, openid==", openid);
    wx.setStorageSync("user:openid", openid);
    self.globalData.token = res.data.token;
    wx.setStorageSync("user:token", self.globalData.token);
    let duration = 60 * 60 * 24 * 6;
    wx.setStorageSync(
      "user:expireTime",
      new Date().getTime() + duration * 1000
    );
  }

  async bindUser(fromUserid) {
    //用户做关联
    if (!fromUserid) {
      return;
    }
    let that = this;
    let userinfo = (that.globalData.userInfo =
      that.globalData.userInfo || wx.getStorageSync("user:detail"));
    if (!userinfo) {
      await that.globalData.refreshUserInfo();
    }
    userinfo = that.globalData.userInfo =
      that.globalData.userInfo || wx.getStorageSync("user:detail");

    if (userinfo.extra) {
      let extraobj = JSON.parse(userinfo.extra);
      if (extraobj.uids.indexOf(fromUserid + "") == -1) {
        let updateResult = await this.globalData.post(
          `${server}/auth/user/updateConnectUids`,
          { uid_from: fromUserid }
        );
      }
      await that.globalData.refreshUserInfo();
    } else {
      let updateResult = await this.globalData.post(
        `${server}/auth/user/updateConnectUids`,
        { uid_from: fromUserid }
      );
      await that.globalData.refreshUserInfo();
    }
  }

  //刷新用户信息
  async refreshUserInfo() {
    console.log("into refresh user info");
    let self = this;
    let res2;
    res2 = await this.globalData.get(`${api.auth.userDetail.url}`);
    let obj = res2;
    let userDetail = {};
    if (obj) {
      //兼容处理 userinfo
      let userProfiles = obj.UserProfiles;
      userDetail = Object.assign(
        {},
        obj,
        { userprofile: obj.UserProfiles },
        { passport: obj.Passports }
      );
      delete userDetail.UserProfiles;
      delete userDetail.Passports;
    }
    self.globalData.userInfo = userDetail;
    console.log("refresh user info done, user info is ", userDetail);
    wx.setStorageSync("user:detail", userDetail);
  }
  onShow(options) {
    // console.log("onshow extraData is ", options.referrerInfo.extraData);
    // if (options.referrerInfo.extraData) {
    //   this.globalData.activate_ticket =
    //     options.referrerInfo.extraData.activate_ticket;
    //   this.globalData.code = options.referrerInfo.extraData.code;
    //   this.globalData.card_id = options.referrerInfo.extraData.card_id;
    // }
  }
  onHide() {
    console.log("this is app on hide");
  }
  onPageNotFound(res) {
    wx.switchTab({ url: "pages/user/index" }); // 如果是 tabbar 页面，请使用 wx.switchTab
  }
  onError(error) {
    log.error(error);
  }
  globalData = {
    sleep: this.sleep,
    get: this.Prequest("GET"),
    post: this.Prequest("POST"),
    upload: this.Pupload(),
    bindUser: this.bindUser,
    refreshUserInfo: this.refreshUserInfo.bind(this),
    userInfo: null,
    token: "",
    scene: null,
    shareTicket: null,
    environment: null,
    //tokenLose: 86400000, // 单位：毫秒，86400000：1天的毫秒数，倒计时1天之内的 token 失效，重新刷新 token
    clipboard: null,
    setting: {},
    io: null,
    chatusers: null,
    socket1: null,
    socketConnect: false,
    checksocketConnectInterval: null,
    currentChatUid: null,
    loginInfo: {},
    EventBus: EventBus,
    activate_ticket: "",
    code: "",
    card_id: "",
    needUserinfo: false,
    route: null,
    shopid: null,
    shopInfo: null,
    isFullSucreen: null,
    isShopOpen: true,
    ifForceOpenShop: false,
    isSavingCart: false,
    isAdding: false,
    currenttime: 0,
    diffTime:0
  };
}
</script>