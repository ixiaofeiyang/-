<template>
  <view class="page">
    <view class="weui-cells">
      <view class="weui-cell" wx:for="{{addresslist}}" bindtap="setDefault" wx:key="id" data-default="{{item.is_default}}" id="{{item.id}}">
        <view class="weui-cell__hd">
            <image wx:if="{{item.is_default}}" src="https://hjl2c.dawangtv.cn/wxa_images/choose_img_checked.png"></image>
          <image wx:if="{{!item.is_default}}" src="https://hjl2c.dawangtv.cn/wxa_images/choose_img.png"></image>
        </view>
        <view class="weui-cell__bd">
          <view class="my_name">{{item.receiver}} {{item.mobile}}</view>
          <view class="my_address">{{item.address}}</view>
        </view>
        <view class="weui-cell__hd red" catchtap="go2EditAddress" id="{{item.id}}">编辑</view>
      </view>
     
      
    </view>
    <view class="bottom_box" bindtap="go2EditAddress">
      <text>新增收获地址</text>
    </view>
  </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import log from "../../util/log";
export default class Addresslist extends wepy.page {
  config = {
    navigationBarTitleText: "收货地址",

  };
  data = {
    addresslist:[],//地址列表
  };
  async onLoad(options) {
    
  }
  async onShow(){
    this.getMyAddressList()
  }
  async getMyAddressList() {
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/address/list`
    );
    if (resultList.state !== "error") {
      this.addresslist = resultList.rows
      this.$apply();
    }
  }
  
  methods = {
   async setDefault(e){
      let id = e.currentTarget.id
      let is_default = e.currentTarget.dataset.default
      if(is_default){
        return
      }
      this.addresslist.map(item=>{
        item.is_default = false
        if(item.id == id) {
          item.is_default = true
        }
      })

      let result = await this.$parent.globalData.post(
        `${api.server}/api/ec/address/setDefaultAddress`,
        {
          addressid:id
        }
      );
      if(result.state == 'success') {
        wx.navigateBack({
          delta: 1
        })
      }

      this.$apply();
    },
    go2EditAddress(e){
       wx.navigateTo({
        url: `/pages/user/editaddress?id=${e.currentTarget.id}`
      });
    }
  };
}
</script>
<style>
page {
  background: #fff;
}
.weui-cell__bd {
  margin-left: 20rpx;
  padding: 10rpx;
  margin-right: 20rpx;
}
.weui-cell image{

  width: 38rpx;
  height: 38rpx;
}
.my_name {
  font-weight: bold;
  font-size: 28rpx;
  padding: 2rpx 0;
}
.my_address {
  color: #999;
  font-size: 26rpx;
  padding: 2rpx 0;
}
.red {
  color: #fb6890;
}
.bottom_box {
  height: 88rpx;
  width: 750rpx;
  background: #f2f2f2;
  position: fixed;
  line-height: 88rpx;
  bottom: 0;
  border-top: solid 1rpx #f2f2f2;
}
.bottom_box text {
  background: linear-gradient(to right, #fb6890, #fb777d);
  color: #fff;
  display: block;
  text-align: center;
  float: right;
  height: 88rpx;
  padding: 0 100rpx;
  font-size: 28rpx;
}
</style>
