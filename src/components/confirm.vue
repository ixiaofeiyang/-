<template>
    <view>
        <view class="mark" wx:if="{{isShowMark}}" catchtouchmove="true"></view>
        <!--提示类型-->
        <view class="confirm_container" wx:if="{{isShowTips}}">
            <view class="confirm_title">{{confirmData.title}}</view>
            <view class="confirm_con">
                <text class="confirm_text text_left">{{confirmData.msg}}</text>
            </view>
            <view class="confirm_sumbit">
                <button wx:if="{{confirmData.url}}" data-url="{{confirmData.url}}" bindtap="goToUrl">确定</button>
                <button wx:else bindtap="confirmOn">确定</button>
            </view>
        </view>
        <!--确认类型-->
        <view class="confirm_container" wx:if="{{isChoose}}">
            <view class="confirm_title">{{confirmData.title}}</view>
            <view class="confirm_con">
                <text class="confirm_text font-blod">{{confirmData.address}}</text>
                <text class="confirm_text">{{confirmData.shopName}}</text>
            </view>
            <view class="confirm_sumbit">
                <button class="cancel_btn" bindtap="closeConfirm">取消</button>
                <button class="continue_btn" bindtap="confirmChoose">确定</button>
            </view>
        </view>
        <!--选择类型-->
        <view class="confirm_container" wx:if="{{isChange}}">
            <view class="confirm_title">{{confirmData.title}}</view>
            <view class="confirm_con">
                <view class="confirm_content_title">当前购物门店与上次自提门店不一致</view>
                <view class="confirm_content_hint">请选择您最方便的自提点：</view>
                <view class="confirm_content_text">
                    <view bindtap="changeShop" data-curr="0" class="confirm_address">
                        <view class="address_box">{{confirmData.newShopInfo.address}}</view>
                        <text class="shopName_box">{{confirmData.newShopInfo.shop_name}}</text>
                        <text>{{confirmData.newShopInfo.contact}}</text>
                        <icon type="success" size="20" color="red" wx:if="{{currShop}}" />
                        <icon wx:if="{{!currShop}}" type="success" size="20" color="gray" />
                    </view>
                    <view bindtap="changeShop" data-curr="1" class="confirm_address">
                        <view class="address_box">{{confirmData.shopInfo.address}}</view>
                        <text class="shopName_box">{{confirmData.shopInfo.shop_name}}</text>
                        <text>{{confirmData.shopInfo.contact}}</text>
                        <icon type="success" size="20" color="red" wx:if="{{!currShop}}" />
                        <icon type="success" size="20" color="gray" wx:if="{{currShop}}" />
                    </view>
                </view>
            </view>
            <view class="confirm_sumbit">
                <button class="color-orange" bindtap="confirmChange">确定</button>
            </view>
        </view>
    </view>
</template>
<script>
import wepy from "wepy";
import api from "../config/api";
export default class Confirm extends wepy.component {
  data = {
    isShowMark: false,
    isShowTips: false,
    isChoose: false,
    isChange: false,
    currShop: true
  };
  props = {
    confirmData: {
      type: Object,
      default: "none"
    }
  };
  events = {
    showTips: async $event => {
      this.isShowMark = true;
      this.isShowTips = true;
      this.$apply();
    },
    isChooseShop: async $event => {
      this.isShowMark = true;
      this.isChoose = true;
      this.$apply();
    },
    isChangeShop: async $event => {
      this.isShowMark = true;
      this.isChange = true;
      this.$apply();
    }
  };
  closeModal() {
    this.isShowMark = false;
    this.isShowTips = false;
    this.isChoose = false;
    this.isChange = false;
    this.$apply();
  }
  methods = {
    goToUrl(e) {
      this.closeModal();
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    },
    closeConfirm() {
      this.closeModal();
    },
    confirmOn() {
      this.closeModal();
      this.$emit("confirmOn");
    },
    confirmChoose() {
      this.closeModal();
      this.$emit("chooseShop");
    },
    changeShop(e) {
      this.currShop = e.currentTarget.dataset.curr === "0" ? true : false;
    },
    confirmChange(e) {
      this.closeModal();
      this.$emit("changeShop", this.currShop);
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
.confirm_container {
  width: 580rpx;
  position: fixed;
  left: 50%;
  top: 50%;
  background: #fff;
  border-radius: 12rpx;
  z-index: 9999;
  -webkit-transform: translateX(-50%) translateY(-50%);
}
.confirm_title {
  background: url(http://hjl2c.dawangtv.cn/wxa_images/tiltle.png) no-repeat;
  background-size: 580rpx 118rpx;
  width: 580rpx;
  height: 118rpx;
  color: #fff;
  text-align: center;
  font-size: 39rpx;
  line-height: 118rpx;
  font-weight: bold;
  position: relative;
}
.confirm_con {
  padding: 40rpx 30rpx 0 30rpx;
}
.confirm_con text {
  font-size: 28rpx;
  color: #666;
  display: block;
}
.confirm_con .confirm_text {
  text-align: center;
}
.confirm_con .text_left {
  text-align: left;
  width: 504rpx;
  margin: 0 auto
}
.confirm_sumbit button {
  border: 2rpx solid #ec3e29;
  border-radius: 100rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #ec3e29;
  background: #fff;
  width: 425rpx;
  margin-bottom: 40rpx;
  margin-top: 30rpx;
}
.confirm_sumbit .cancel_btn {
  border: 2rpx solid #969699;
  color: #969699;
  width: 260rpx;
  float: left;
  margin-left: 20rpx;
}
.confirm_con .font-blod {
  font-size: 34rpx;
  color: #4a4a4a;
  line-height: 40rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  line-height: 48rpx;
}
.confirm_sumbit .continue_btn {
  width: 260rpx;
  float: left;
  margin-left: 20rpx;
}
.confirm_content_title {
  font-size: 26rpx;
  color: #ec3e29;
  margin-left: 25rpx;
  background: url(http://hjl2c.dawangtv.cn/wxa_images/ico-warn.png) no-repeat;
  background-size: 35rpx 35rpx;
  padding-left: 50rpx;
  margin-top: 10rpx;
}
.confirm_content_hint {
  margin-top: 28rpx;
  margin-bottom: 28rpx;
  font-size: 22rpx;
  color: #969699;
}
.confirm_content_text {
  font-size: 30rpx;
  color: #91918f;
}
.confirm_address {
  margin-bottom: 20rpx;
  position: relative;
}
.address_box {
  font-size: 30rpx;
  color: #4a4a4a;
  font-weight: bold;
  line-height: 36rpx;
  margin-bottom: 8rpx;
  width: 430rpx;
}
.confirm_address text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  color: #969699;
  font-size: 26rpx;
}
.shopName_box {
  width: 340rpx;
}
.con_address {
  font-size: 30rpx;
  color: #91918f;
}
.confirm_content_text icon {
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  margin-top: -30rpx;
  right: 0;
}
.confirm_sumbit .color-orange {
  background: #ec3e29;
  color: #fff;
  width: 540rpx;
}
</style>
