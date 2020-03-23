<template>
    <view class="page">
        <view class="page__bd">
            <!--用户信息-->
            <view class="user_info" wx:if="{{userInfo.nickname}}">
                <image src="{{userInfo.headimg}}" class="headerImg" bindtap="resetStorage"></image>
                <text class="nick_name">{{userInfo.nickname}}</text>
                <text class="mobile" wx:if="{{mobile}}">{{mobile}}</text>
            </view>
            <view class="user_info" wx:else>
                <view class="hit">登录后享受更多优惠及服务</view>
                <button class="sumbit" bindtap="agree">登录</button>
            </view>
            <view class="userContent_bg"></view>
            <!--我的订单状态-->
            <view class="userContent">
                <view class="order_status">
                    <view class="myOrderConten">
                        <text>我的订单</text>
                        <text data-index='0' bindtap="go2orderList">查看全部订单</text>
                        <image src="../../images/icon-left.png" class="icon_left"></image>
                    </view>
                    <view class="statusContent">
                        <view class="statusList" bindtap="go2orderList" data-index='0'>
                            <view class="iconContent">
                                <image src="../../images/qbdd_img.png" class="icon1"></image>
                            </view>
                            <text>全部订单</text>
                        </view>
                        <view class="statusList" bindtap="go2orderList" data-index='1'>
                            <view class="iconContent">
                                <image src="../../images/wfk_img.png" class="icon2"></image>
                                <text class="tags" wx:if="{{amountData.noPayCount>0}}">{{amountData.noPayCount}}</text>
                            </view>
                            <text>未付款</text>
                        </view>
                        <view class="statusList" bindtap="go2orderList" data-index='2'>
                            <view class="iconContent">
                                <image src="../../images/dth_img.png" class="icon3"></image>
                                <text class="tags" wx:if="{{amountData.noCarryCount>0}}">{{amountData.noCarryCount}}</text>
                            </view>
                            <text>待提货</text>
                        </view>
                        <view class="statusList" bindtap="go2orderList" data-index='3'>
                            <view class="iconContent">
                                <image src="../../images/yth_img.png" class="icon4"></image>
                                <!-- <text class="tags" wx:if="{{amountData.carryCount>0}}">{{amountData.carryCount}}</text> -->
                            </view>
                            <text>已提货</text>
                        </view>
                    </view>
                </view>
				<!-- 我的优惠券 -->
				<view class="coupon_box" bindtap="goCoupon">
					<image src="../../images/icon_coupon.png" class="icon_coupon"></image>
					<text>优惠券</text>
					<image src="../../images/icon-left.png" class="icon_left"></image>
				</view>
                <!--我的自提点-->
                <!-- <view class="order_address">
                    <view class="myOrderConten myAddressContent">
                        <text>我的当前自提点</text>
                        <text bindtap="go2myAddress" wx:if="{{shopInfo}}">切换自提点</text>
                        <text bindtap="go2editaddress" wx:if="{{!shopInfo}}">设置自提点</text>
                        <image src="../../images/icon-left-yellow.png" class="icon_left"></image>
                    </view>
                    <view class="addressList" wx:if="{{shopInfo.shop_name}}">
                        <view class="shopName">
                        <text>{{shopInfo.shop_name}}</text>
                        <text wx:if="{{shopInfo.status == 4}}">(休息中)</text>
                        </view>
                        <text class="shopAddress">{{shopInfo.address}}{{shopInfo.address_detail||''}}</text>
                    </view>
                     <view class="addressList" wx:else>
                         <text></text>
                         <text class="font_size">暂无自提点</text>
                     </view>
                    <view class="addressPhone" wx:if="{{shopInfo.contact}}">
                        <text bindtap="callmobile({{shopInfo.contact}})">自提点电话：{{shopInfo.contact}}</text>
                        <image src="../../images/phone_img.png"></image>
                    </view>
                </view> -->
                <!--服务热线-->
                <view class="service_explain">
                    <text>1. 如果您购买的商品有任何问题，请直接与购买的自提点联系！</text>
                    <text class="hit">100%售后保证！</text>
                    <text>2. 如果您找不到购物时的提货门店，请致电热线帮忙！</text>
                    <view class="phoneContent" bindtap="serviceHotline">
                        <text class="phoneText">13665197818</text>
                        <image src="../../images/phone_img.png" class="phoneImg"></image>
                    </view>
                </view>
                <view class="buyBtn" bindtap="go2index">去购物</view>
            </view>
            <!--获取用户信息授权-->
            <getuserinfo v-on:showUserInfodone="showUserInfodone"></getuserinfo>
            <!--获取用户电话授权-->
            <getmobile :mobile="mobile"></getmobile>
        </view>
    </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import getuserinfo from "../../components/getuserinfo";
import getmobile from "../../components/getmobile";
export default class Index extends auth {
  config = {
    navigationBarTitleText: "个人中心"
  };
  components = {
    getuserinfo: getuserinfo,
    getmobile: getmobile
  };
  data = {
    needUserinfo: false, // 是否显示授权
    userInfo: {}, //用户信息
    shopInfo: {}, //门店信息
    number: 1,
    needMobile: false,
    mobile: "",
    amountData: {
      //allCount: 0,
      noPayCount: 0,
      noCarryCount: 0
    },
    timer1: null,
    counter: 0
  };

  async onLoad(options) {
    let result = await super.onLoad(options);
    await this.$parent.globalData.refreshUserInfo();
    // this.needUserinfo = this.$parent.globalData.needUserinfo;

    await this.getOrderInfo();
    this.$apply();
  }
  async onPullDownRefresh() {
    await this.onShow();
    await this.getOrderInfo();
    wx.stopPullDownRefresh();
  }
  async onShow() {
    this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};
    this.needUserinfo = this.$parent.globalData.needUserinfo;
    this.mobile = this.userInfo.mobile;
    if (!this.needUserinfo) {
      if (!this.mobile) {
        this.needMobile = true;
        this.$broadcast("showMobileInfo");
      }
    }

    await this.$parent.globalData.refreshUserInfo();

    console.log("into my onshow fn");
    this.shopInfo =
      this.$parent.globalData.shopInfo
    this.$apply();
  }
  //获取订单状态的数量
  async getOrderInfo() {
    let result = await this.$parent.globalData.get(
      `${api.server}/api/ec/order/myOrderInfo`
    );
    this.amountData = { noPayCount: 0, noCarryCount: 0 };
    for (let i in result) {
      this.amountData.noPayCount =
        result[i].order_status === 0
          ? result[i].count
          : this.amountData.noPayCount;
      this.amountData.noCarryCount =
        result[i].order_status === 1
          ? result[i].count
          : this.amountData.noCarryCount;
      this.amountData.carryCount =
        result[i].order_status === 4
          ? result[i].count
          : this.amountData.carryCount;
    }
    this.$apply();
  }
  methods = {
    agree() {
      this.$broadcast("showUserInfo");
    },
    showUserInfodone(){
       this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};
      this.mobile = this.userInfo.mobile;
      if (!this.mobile) {
          this.needMobile = true;
          this.$broadcast("showMobileInfo");
        }
    },
    //父组件接收子组件传值
    resetStorage() {
      this.counter++;
      console.log("the counter is ", this.counter);
      clearTimeout(this.timer1);
      this.timer1 = setTimeout(() => {
        this.counter = 0;
      }, 2000);
      if (this.counter >= 6) {
        this.counter = 0;
        try {
          wx.clearStorageSync();
        } catch (e) {
          // Do something when catch error
        }
      }
    },
    compontpass: function(res) {
      if (e.detail.val) {
      }
      console.log(e.detail.val);
    },
    serviceHotline() {
      wx.makePhoneCall({
        phoneNumber: "13665197818"
      });
    },
    callmobile(mobile) {
      wx.makePhoneCall({
        phoneNumber: mobile
      });
    },
    go2orderList(e) {
      wx.navigateTo({
        url: "/pages/user/orderlist?index=" + e.currentTarget.dataset.index
      });
    },
    go2myAddress() {
      this.$parent.globalData.jumpAddress = {
        url: "/pages/user/index",
        id: null
      };
      wx.navigateTo({ url: "/pages/user/addresslist" });
    },
    go2editaddress() {
      this.$parent.globalData.jumpAddress = {
        url: "/pages/user/index",
        id: null
      };
      wx.navigateTo({ url: "/pages/user/addresslist" });
    },
    go2index() {
      wx.switchTab({ url: "/pages/user/index" });
	},
	goCoupon(){
		wx.navigateTo({ url: "/pages/user/mycouponlist" });
	}
  };
}
</script>
<style>
.user_info {
  background: linear-gradient(to bottom, #fb6890, #fb777d);
  height: 130rpx;
  position: fixed;
  width: 750rpx;
  z-index: 9997;
}
.user_info .headerImg {
  width: 104rpx;
  height: 104rpx;
  position: absolute;
  left: 20rpx;
  bottom: 20rpx;
  border-radius: 100rpx;
}
.user_info .nick_name,
.user_info .mobile {
  position: absolute;
  left: 145rpx;
  top: 15rpx;
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}
.user_info .mobile {
  font-weight: normal;
  top: 70rpx;
  font-size: 24rpx;
}
.userContent_bg {
  height: 62rpx;
  background: #fb777d;
  position: relative;
  top: 130rpx;
}
.userContent,.coupon_box{
  position: relative;
}
.order_status {
  width: 730rpx;
  height: 215rpx;
  background: #fefefe;
  margin: 70rpx auto 20rpx auto;
  border-radius: 12rpx;
  position: relative;
}
.myOrderConten {
  height: 76rpx;
  border-bottom: solid 1rpx #f2f2f2;
  position: relative;
}
.myOrderConten text {
  display: inline-block;
  margin-left: 20rpx;
  padding-top: 20rpx;
  font-size: 28rpx;
  color: #2f2f30;
  font-weight: bold;
}
.myOrderConten text:nth-child(2) {
  position: absolute;
  font-size: 22rpx;
  color: #969699;
  font-weight: normal;
  right: 40rpx;
  top: 8rpx;
}
.myOrderConten .icon_left,.coupon_box .icon_left{
  position: absolute;
  width: 12rpx;
  height: 20rpx;
  right: 20rpx;
  top: 32rpx;
}
.statusContent .statusList {
  width: 25%;
  margin: 0 auto;
  float: left;
}
.statusContent .statusList image {
  width: 37rpx;
  height: 37rpx;
  display: block;
  margin: 28rpx auto 20rpx auto;
}
.statusContent .iconContent {
  position: relative;
  width: 45rpx;
  margin: 0 auto;
}
.statusContent .statusList .icon2 {
  width: 41rpx;
  height: 37rpx;
}
.statusContent .statusList .icon3 {
  width: 45rpx;
  height: 37rpx;
}
.statusContent .statusList .icon4 {
  width: 44rpx;
  height: 37rpx;
}
.statusContent .statusList text {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: #2f2f30;
}
.order_address,.coupon_box{
  width: 730rpx;
  margin: 20rpx auto;
  background: #fefefe;
  border-radius: 12rpx;
  padding-bottom: 20rpx;
}
.myAddressContent text:nth-child(2) {
  color: #f8921f;
}
.addressList {
  padding: 14rpx 20rpx;
  border-bottom: solid 1rpx #f2f2f2;
}
.addressList .shopName text {
  display:inline-block;
  font-size: 30rpx;
  color: #ec3e29;
  font-weight: bold;
  margin-right: 20rpx;
}
.addressList .font_size{
  font-size:30rpx;
}
.addressList .shopAddress {
  font-size: 26rpx;
  color: #969699;
  font-weight: normal;
  margin-top: 6rpx;
  display: block
}
.addressPhone {
  padding-left: 20rpx;
  font-size: 24rpx;
  color: #f8992d;
  top: 8rpx;
  position: relative;
}
.addressPhone image {
  width: 25rpx;
  height: 25rpx;
  display: inline-block;
  position: absolute;
  top: 9rpx;
  margin-left: 15rpx;
}
.addressPhone text {
  display: inline-block;
  margin-top: 5rpx;
}
.service_explain {
  padding: 10rpx 30rpx;
  font-size: 24rpx;
  color: #969699;
  height: 160rpx;
}
.service_explain text {
  display: block;
}
.service_explain .phoneImg {
  width: 25rpx;
  height: 25rpx;
  float: left;
  display: block;
  margin-left: 12rpx;
  margin-top: 5rpx;
}
.service_explain .phoneText {
  margin-left: 24rpx;
  float: left;
}
.service_explain .phoneContent {
  width: 290rpx;
  height: 40rpx;
}
.buyBtn {
  width: 710rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  background: linear-gradient(to bottom, #fb6890, #fb777d);
  border-radius: 100rpx;
  margin: 36rpx auto;
  font-size: 28rpx;
  color: #fff;
}
.service_explain .hit {
  margin-left: 24rpx;
  margin-bottom: 15rpx;
  margin-top: 0;
}
.statusContent .statusList .tags {
  width: 22rpx;
  height: 22rpx;
  line-height: 22rpx;
  text-align: center;
  background: #fff;
  border: 1rpx solid #ec3e29;
  border-radius: 100rpx;
  font-size: 16rpx;
  color: #ec3e29;
  position: absolute;
  top: -8rpx;
  right: -8rpx;
}
.user_info .sumbit {
  width: 207rpx;
  height: 64rpx;
  margin: 10rpx auto;
  border: 2rpx solid #fefefe;
  border-radius: 100rpx;
  font-size: 30rpx;
  color: #fefefe;
  font-weight: bold;
  background: none;
  line-height: 64rpx;
}
.user_info .hit {
  font-size: 26rpx;
  color: #fefefe;
  text-align: center;
  font-weight: bold;
}
.coupon_box {
	background: #fefefe;
	padding:20rpx 0px;
}
.coupon_box text{
	font-size: 28rpx;
	color: #2f2f30;
	font-weight: bold;
}
.icon_coupon{
	width: 42rpx;
	height: 32rpx;
	display: inline-block;
	margin:0px 20rpx;
	margin-bottom: -3rpx;
}
</style>