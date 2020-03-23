<template>
  <view wx:if="{{needMobile}}">
    <view class="mobile-box">
      <view class="title">
        <image src="../images/mobile_title.png"></image>
        <text>手机号授权</text>
      </view>
      <view class="h2">
        <text>为给您提供更好的服务，</text>
        <text>请授权获取个人电话信息。</text>
      </view>
      <button class='sumbit cancel'
              bindtap="closedBtn">取消</button>
      <button class='sumbit'
              bindgetphonenumber="getPhoneNumber"
              open-type="getPhoneNumber">确定</button>

      <!-- <image wx:if="{{needMobile}}" src="../images/icon-colsed.png" class="ico-colsed" bindtap="closedBtn"></image> -->
    </view>
    <view class="mark"
          wx:if="{{needMobile}}"></view>
  </view>
</template>
<script>
import wepy from "wepy";
import config from "../config/api";
import { api } from "../config/api";
export default class login extends wepy.component {
  props = {
    isLogin: Boolean,
    // 双向传值
    mobile: {
      type: String,
      default: "nothing",
      twoWay: true
    }
  };
  data = {
    needMobile: false,
    code: "",
    agreeStatus: false
  };
  events = {
    showMobileInfo: async $event => {
      //console.log($event)
      //console.log(` receive ${$event.name} from ${$event.source}`);
      this.code = wepy.$instance.globalData.loginInfo.code;
      //如果这时候拿到了，肯定能用
      if (!this.code) {
        console.log(
          "in component login: globaldata code not exist , we should wepy.login again"
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
      this.needMobile = true;
      this.$apply();
    }
  };
  methods = {
    async getPhoneNumber(e) {
      if (this.agreeStatus) {
        return
      }
      this.agreeStatus = true
      this.isMobile = wepy.$instance.globalData.isMobile = false;
      let that = this;
      let options = getCurrentPages().pop().options;
      let params = Object.keys(options)
        .map(item => {
          return item + "=" + options[item];
        }).join("&");
      if (!e.detail.iv) {
        return;
      }

      // 请求接口
      let formdata = {
        code: this.code,
        iv: e.detail.iv,
        userInfo: e.detail.userInfo,
        encryptedData: e.detail.encryptedData
      };
      let res = await wepy.$instance.globalData.post(
        `${api.auth.updateusermobile.url}`,
        formdata
      );
      // console.log(res)
      this.mobile = res.phoneNumber;
      this.needMobile = false;
      this.agreeStatus = false
      await wepy.$instance.globalData.refreshUserInfo(true);
      this.$apply();
      this.$emit("showMobileInfodone")
    },
    closedBtn() {
      this.needMobile = false;
      this.agreeStatus = false

      //wx.switchTab({ url: "/pages/user/index" });
    }
  };
}
</script>
<style>
.mark {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
}
.mobile-box {
  width: 580rpx;
  position: fixed;
  left: 50%;
  top: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  background: #fff;
  border-radius: 12rpx;
  z-index: 9999;
}
.mobile-box .h2 {
  padding-top: 60rpx;
}
.mobile-box .h2 text {
  text-align: center;
  font-size: 28rpx;
  color: #969699;
  display: block;
  font-weight: normal;
}

.mobile-box .title {
  text-align: center;
  padding-top: 35rpx;
  font-size: 39rpx;
  color: #fff;
  font-weight: bold;
  position: relative;
  height: 83rpx;
  background: none;
}
.mobile-box .title image {
  width: 580rpx;
  height: 118rpx;
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 0;
}
.mobile-box .title text {
  position: absolute;
  left: 196rpx;
}
.mobile-box .ico_bt_btn {
  text-align: center;
  font-size: 30rpx;
  color: #1aad16;
  font-weight: bold;
}
.mobile-box .line {
  border-top: solid 1rpx #f2f3f2;
  padding-top: 15rpx;
}
.mobile-box .ico-colsed {
  width: 29rpx;
  height: 28rpx;
  position: absolute;
  top: 30rpx;
  right: 30rpx;
}
.mobile-box .sumbit {
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
.mobile-box .cancel {
  border: 2rpx solid #969699;
  color: #969699;
}
</style>
