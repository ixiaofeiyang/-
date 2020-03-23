<template>
  <view class="page">
    <view class="weui-cells__group weui-cells__group_form">
      <view class="weui-cells weui-cells_form">
        <view class="weui-cell">
          <view class="weui-cell__hd">
            <label class="weui-label">收货人姓名</label>
          </view>
          <view class="weui-cell__bd">
            <input class="weui-input"
                   placeholder="请填写收货人姓名"
                   value="{{receiver}}"
                   bindinput="bindInput"
                   data-name="receiver" />
          </view>
        </view>
        <view class="weui-cell">
          <view class="weui-cell__hd">
            <label class="weui-label">收货人联系电话</label>
          </view>
          <view class="weui-cell__bd">
            <input class="weui-input"
                   placeholder="请填写收货人的联系电话"
                   value="{{mobile}}"
                   bindinput="bindInput"
                   data-name="mobile" />
          </view>
        </view>
        <!-- <view class="weui-cell">
          <view class="weui-cell__hd">
            <label class="weui-label">所在地区</label>
          </view>
          <view class="weui-cell__bd">
            <input class="weui-input"
                   placeholder="请选择" />
          </view>
        </view> -->
        <view class="weui-cell">
          <view class="weui-cell__hd">
            <label class="weui-label">详细地址</label>
          </view>
          <view class="weui-cell__bd">
            <input class="weui-input"
                   placeholder="请填写收货人的详细地址"
                   value="{{address}}"
                   bindinput="bindInput"
                   data-name="address" />
          </view>
        </view>
      </view>

      <view class="submit_btn"
            bindtap="createAddress">保存并使用该地址</view>
      <view wx:if="{{id}}"
            class="submit_btn delete_btn"
            bindtap="deleteAddress">删除地址</view>

    </view>
  </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import log from "../../util/log";
export default class Editaddress extends wepy.page {
  config = {
    navigationBarTitleText: "编辑收货地址",

  };
  data = {
    receiver: "", //收货人姓名
    mobile: "", //联系方式
    address: "", //详细地址
    issave: false, //按钮状态（避免重复提交数据）
    id: null,
  };
  async onLoad(options) {
    this.id = Number(options.id)
    this.getAddressInfo()
  }

  //创建收货人地址
  async createAddress() {
    if (this.issave) return;
    if (!this.receiver) {
      wx.showModal({
        confirmColor: "#338AF1",
        title: "提示",
        showCancel: false,
        content: "请填写收货人姓名！"
      });
      return;
    }
    if (!this.mobile) {
      wx.showModal({
        confirmColor: "#338AF1",
        title: "提示",
        showCancel: false,
        content: "请填写收货人手机号！"
      });
      return;
    }
    if (!/^1[34578]\d{9}$/.test(this.mobile)) {
      wx.showModal({
        confirmColor: "#338AF1",
        title: "提示",
        showCancel: false,
        content: "请输入正确的联系方式"
      });
      return;
    }
    if (!this.address) {
      wx.showModal({
        confirmColor: "#338AF1",
        title: "提示",
        showCancel: false,
        content: "请填写收货人的详细地址"
      });
      return;
    }
    this.issave = true;
    let action = this.id ? 'modify' : 'create'
    let result = await this.$parent.globalData.post(
      `${api.server}/api/ec/address/${action}`,
      {
        receiver: this.receiver,
        mobile: this.mobile,
        address: this.address,
        id: this.id
      }
    );
    if (result.state !== "error") {
      let num = this.id ? 2 : 1
      wx.navigateBack({
          delta: num
        })
    }
  }
  async getAddressInfo() {
    let resultInfo = await this.$parent.globalData.get(
      `${api.server}/api/ec/address/info?id=${this.id}`
    );
    if (resultInfo.state !== "error") {
      this.receiver = resultInfo.receiver
      this.mobile = resultInfo.mobile
      this.address = resultInfo.address
      this.$apply();
    }
  }
  async goToDeleta(){
      let result = await this.$parent.globalData.post(
        `${api.server}/api/ec/address/delete`,
        {
          id: this.id
        }
      );
      
      if (result.state == 'success') {
        wx.navigateBack({ delta: 1 });
      }
    }
  methods = {
    bindInput(e) {
      let key = e.currentTarget.dataset.name;
      this[key] = e.detail.value;
      this.$apply();
    },
    
    async deleteAddress() {
      let self = this
      wx.showModal({
      title: "系统提示",
      content: "确认要删除吗?",
      success(res) {
        if (res.confirm) {
          self.goToDeleta();
        } else if (res.cancel) {
          return false;
        }
      }
    });
    }
  };
}
</script>
<style>
page {
  background: #fff;
}
.submit_btn {
  width: 710rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  background: linear-gradient(to right, #fb6890, #fb777d);
  border-radius: 100rpx;
  margin: 36rpx auto;
  font-size: 28rpx;
  color: #fff;
}
.delete_btn {
  background: #f2f2f2;
  border: solid 1rpx #f2f2f2;
  color: #000;
}
</style>
