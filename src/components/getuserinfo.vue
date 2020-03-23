<template>
  <view wx:if="{{needUserinfo}}">
    <view class="login-box">
      <view class="title">会员登录
        <image src="../images/hjl_logo.png"></image>
      </view>
      <view class="h2">为了保证您的订单信息一致，请您授权登录</view>
      <text class="h3">·获取您的公开信息（昵称、头像）</text>
      <button class='sumbit cancel'
              bindtap="onbtnclosetap">取消</button>
      <button class="sumbit"
              open-type="getUserInfo"
              bindgetuserinfo="agree">确定</button>
    </view>
    <view class="mark"
          wx:if="{{needUserinfo}}"></view>
  </view>
</template>
<script>
import wepy from "wepy";
import config from "../config/api";
import { api } from "../config/api";
export default class login extends wepy.component {
  data = {
    needUserinfo: false,
    code: "",
    showModalStatus: false,
    agreeStatus: false
  };
  events = {
    showUserInfo: async $event => {
      this.code = wepy.$instance.globalData.loginInfo.code;
      //如果这时候拿到了，肯定能用
      if (!this.code) {
        console.log("in component login: globaldata code not exist , we should wepy.login again"
        );
        let res1 = await wepy.login();
        this.code = res1.code;
        clearTimeout(wepy.$instance.globalData.codetimer);
        wepy.$instance.globalData.codetimer = setTimeout(() => {
          wepy.$instance.globalData.loginInfo.code = null;
        }, 1000 * 60 * 60 * 1);
      } else {
        this.code = wepy.$instance.globalData.loginInfo.code;
      }
      this.needUserinfo = true;

      this.$apply();
    }
  };
  methods = {
    async agree(e) {
      if (this.agreeStatus) {
        return
      }
      this.agreeStatus = true
      //this.Login = wepy.$instance.globalData.needUserinfo = false;
      this.from = wepy.$instance.globalData.route;
      try {
        console.log(e.detail.errMsg);
        console.log(e.detail.userInfo);
        console.log(e.detail.rawData);
        console.log(e.detail.encryptedData);
        console.log("iv is ", e.detail.iv);
      } catch (e) {
        console.log(e);
      }

      if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
        return;
      }
      let formdata = {
        code: this.code,
        iv: e.detail.iv,
        userInfo: e.detail.userInfo,
        encryptedData: e.detail.encryptedData
      };
      let res = await wepy.$instance.globalData.post(
        `${api.auth.updateuserinfo.url}`,
        formdata
      );

      console.log("in login component, res is ", res)
      wepy.$instance.globalData.token = res.token;
      wx.setStorageSync("user:token", res.token);
      let duration = 60 * 60 * 24 * 6;
      wx.setStorageSync("user:expireTime", new Date().getTime() + duration * 1000);
      await wepy.$instance.globalData.refreshUserInfo(true);
      this.agreeStatus = false
      this.needUserinfo = false;
      wepy.$instance.globalData.needUserinfo = false;
      this.$apply();
      this.$emit("showUserInfodone")
    },
    onbtnclosetap() {
      this.needUserinfo = false;
      this.agreeStatus = false
    }
  };
}
</script>
<style>
.mark {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
  overflow: hidden;
}
.login-box {
  width: 580rpx;
  position: fixed;
  left: 50%;
  top: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  background: #fff;
  border-radius: 12rpx;
  z-index: 9999;
}
.h2 {
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #353535;
}

.title {
  text-align: center;
  padding-top: 40rpx;
  font-size: 39rpx;
  color: #fff;
  font-weight: bold;
  height: 290rpx;
  background: url(http://hjl2c.dawangtv.cn/wxa_images/info_title.png) no-repeat;
  background-size: 580rpx 290rpx;
}
.h2 text {
  font-size: 28rpx;
  color: #171717;
  line-height: 40rpx;
  font-weight: bold;
}
.h3 {
  font-size: 22rpx;
  color: #969699;
  padding: 0 20rpx;
}
.title image {
  width: 137rpx;
  height: 138rpx;
  display: block;
  margin: 0 auto;
  padding-top: 22rpx;
}
.login-box .ico_bt_btn {
  text-align: center;
  font-size: 30rpx;
  color: #1aad16;
  font-weight: bold;
}
.login-box .line {
  border-top: solid 1rpx #f2f3f2;
  padding-top: 15rpx;
}
.login-box .ico-colsed {
  width: 29rpx;
  height: 28rpx;
  position: absolute;
  top: 30rpx;
  right: 30rpx;
}
.login-box .sumbit {
  border: 2rpx solid #ec3e29;
  border-radius: 100rpx;
  width: 260rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #ec3e29;
  float: left;
  margin-left: 22rpx;
  margin-top: 30rpx;
  background: #fff;
  margin-bottom: 30rpx;
}
.login-box .cancel {
  border: 2rpx solid #969699;
  color: #969699;
}
</style>
