<template>
    <view class="page">
        <view>
            <!--订单状态切换导航-->
            <view class="orderStatus_box">
                <text class="{{currNav == '0' ? 'checked' : ''}}" bindtap="navTab" data-index='0'>全部订单</text>
                <text class="{{currNav == '1' ? 'checked' : ''}}" bindtap="navTab" data-index='1'>未付款</text>
                <text class="{{currNav == '2' ? 'checked' : ''}}" bindtap="navTab" data-index='2'>待提货</text>
                <text class="{{currNav == '3' ? 'checked' : ''}}" bindtap="navTab" data-index='3'>已提货</text>
            </view>
            <!--没有相关的订单-->
            <view class="no-order-tips" wx:if="{{orderList.length <= 0}}">
                <text>您还没有相关的订单</text>
            </view>
            <!--订单列表-->
            <view class="scroll_box ">
                <skeleton slector="skeleton" bgcolor="none" loading="spin" wx:if="{{showSkeleton}}"></skeleton>
                <view class="skeleton">
                    <view class="order_goods " wx:if="{{orderList.length > 0 }}" wx:for="{{orderList}}" wx:key="id" id="{{item.id}}" data-ordersn="{{item.order_sn}}" catchtap="go2orderDetail">
                        <view class="order_title ">
                            <text class="order_code" selectable="true">订单编号：{{item.order_sn}}</text>
                            <text class="order_code skeleton-rect" wx:if="{{showSkeleton}}">订单编号订单编号订单编号：</text>
                            <block wx:if="{{item.pay_status}}">
                                <text class="order_status order_status_color" >已支付</text>
                            </block>
                            <block wx:else>
                                <block>
                                    <text class="order_status skeleton-rect" wx:if="{{!item.isover3min}}">未支付</text>
                                    <text class="order_status order_status_color"  wx:else>已关闭</text>
                                </block>
                            </block>
                        </view>
                        <view class="goodsContent">
                            <!--商品列表-->
                            <view class="goods_list">
                                <view class="goods_top" wx:for="{{item.OrderDetails}}" wx:key="id" wx:for-item="iitem">

                                    <image src="{{fileserver+iitem.cartImg}}" mode="aspectFill" class="skeleton-rect"></image>
                                    <view class="goods_price">
                                        <text class="font_small">¥</text>{{iitem.sku_price/100}}</view>
                                    <view class="goods_price skeleton-rect" wx:if="{{showSkeleton}}">
                                        <text class="font_small">¥</text>商价格</view>
                                    <view class="goods_num">
                                        <text class="font_small">X </text>{{iitem.amount}}</view>
                                    <view class="goods_num skeleton-rect" wx:if="{{showSkeleton}}">
                                        <text class="font_small">X </text>数量</view>
                                    <view class="goods_text">
                                        <text class="goods_name ">{{iitem.sku_name}}</text>
                                        <text class="goods_name skeleton-rect" wx:if="{{showSkeleton}}">商品名称商品名称</text>
                                        <text class="goods_spec" wx:if="{{iitem.sku_specification}}">{{iitem.sku_specification_show}}</text>
                                        <text class="goods_spec skeleton-rect" wx:if="{{showSkeleton}}">商品规格</text>
                                    </view>
                                </view>
                                <view class="order_time">
                                    <text class="ordersTime">{{item.created_at}}</text>
                                    <text class="ordersTime skeleton-rect" wx:if="{{showSkeleton}}">订单时间订单时间订单时间订单时间</text>
                                    <view class="ordersTotal ">共{{item.goodsAmount}}件商品
                                        <text class="price ">¥{{item.final_price/100}}</text>
                                    </view>
                                    <view class="ordersTotal skeleton-rect" wx:if="{{showSkeleton}}">共{{item.goodsAmount}}件商品
                                        <text class="price ">¥{{item.final_price/100}}</text>
                                    </view>
                                </view>
                                <view class="order_code order_line" wx:if="{{item.order_status===0 && !item.isover3min}}">
                                    <!-- <text>提货单号：0 123456789123</text> -->
                                    <view class="deleteBtn pay_btn" catchtap="go2pay" data-price="{{item.final_price}}" id="{{item.id}}">去付款</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!--加载更多-->
            <view class="weui-loadmore weui-loadmore_line" wx:if="{{ noMoreData }}">
                <view class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多数据</view>
            </view>
            <!--请求中的loading-->
            <view class="weui-loadmore weui-loadmore_line" wx:if="{{ isLoading }}">
                <view class="weui-loadmore__tips weui-loadmore__tips_in-line">正在加载中</view>
            </view>
        </view>
        <!--下单时商品确认提示-->
        <confirm :confirmData.sync="confirmData"></confirm>
    </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import moment from "moment";
import confirm from "../../components/confirm";
export default class Index extends auth {
  config = {
    navigationBarTitleText: "订单管理",
    enablePullDownRefresh: false,
    usingComponents: {
      skeleton: "../../plugin/wux/skeleton/skeleton"
    }
  };
  components = {
    confirm: confirm
  };
  data = {
    needUserinfo: false, // 是否显示授权
    orderStatus: false, //订单状态
    orderList: [
      {
        id: 1,
        order_sn: "",
        created_at: "",
        OrderDetails: [
          {
            sku_name: "",
            sku_price: "",
            sku_specification: "",
            amount: ""
          }
        ]
      },
      {
        id: 2,
        order_sn: "",
        created_at: "",
        OrderDetails: [
          {
            sku_name: "",
            sku_price: "",
            sku_specification: "",
            amount: ""
          }
        ]
      },
      {
        id: 3,
        order_sn: "",
        created_at: "",
        OrderDetails: [
          {
            sku_name: "",
            sku_price: "",
            sku_specification: "",
            amount: ""
          }
        ]
      },
      {
        id: 4,
        order_sn: "",
        created_at: "",
        OrderDetails: [
          {
            sku_name: "",
            sku_price: "",
            sku_specification: "",
            amount: ""
          }
        ]
      }
    ], //订单列表

    goodsAmount: 0,
    noMoreData: false, // 没有更多数据
    isLoading: false, // 是否在加载中
    page: 0, // 页数给予默认值1
    sizeIndx: 10, //每页只显示10条数据
    allPages: 0, //总页数
    fileserver: `${api.uploadimgFile}`, //上传图片域名
    requestData: {},
    requestUrl: null,
    isover3min: false,
    confirmData: {},
    currNav: 0,
    errorMsg: "",
    skuIds: null,
    showSkeleton: true,
    orderApi: [
      // 订单状态列表接口
      "/api/ec/order/mylist?", //全部订单
      "/api/ec/order/mylist?order_status=0", //未付款订单
      "/api/ec/order/mylist?order_status=1", //待提货订单
      "/api/ec/order/mylist?order_status=4" //已提货订单
    ]
  };
  //   async onPullDownRefresh() {
  //     this.page = 0
  //     await this.reload()
  //     wepy.stopPullDownRefresh()
  //   }
  async onReachBottom() {
    // 如果没有更多内容，直接返回
    if (this.noMoreData) {
      return;
    }
    // this.page = this.page + 1
    await this.loadMore();
    this.$apply();
  }
  async loadMore() {
    // 如果没有更多数据， 或者正在加载，直接返回
    if (this.noMoreData || this.isLoading) {
      return;
    }
    // 开始请求之前设置 isLoading 为true
    this.isLoading = true;
    this.page = this.page + 1;
    await this.getOrderList(this.page, false);

    // 开始结束后设置 isLoading 为 false
    this.isLoading = false;
    this.$apply();
  }

  // 重新加载
  async reload() {
    this.noMoreData = false;
    this.page = 0;
    return await this.getOrderList(this.page, true);
  }

  async onLoad(options) {
    let result = await super.onLoad(options);
    if (options.index) {
      this.currNav = options.index + "";
    }

    await this.getOrderList(0);

    this.$apply();
  }
  onShow() {}

  //获取订单列表信息
  async getOrderList(pageIndex) {
    let resultList = await this.$parent.globalData.get(
      `${api.server}${this.orderApi[this.currNav]}&page=${pageIndex}&size=${
        this.sizeIndx
      }`
    );
    if (resultList.state == "error") {
      this.showSkeleton = false;
      this.orderList = [];
      this.$apply();
      return;
    }

    if (resultList.rows.length > 0) {
      this.showSkeleton = false;
    }

    this.allPages = Math.ceil(resultList.count / this.sizeIndx);
    if (pageIndex == 0) {
      this.orderList = resultList.rows;
    } else {
      //加载更多
      let tempArray = this.orderList;
      tempArray = tempArray.concat(resultList.rows);
      this.orderList = tempArray;
    }

    console.log(this.allPages, pageIndex);
    this.noMoreData = this.allPages === pageIndex + 1 ? true : false;
    this.orderList.map(item => {
      let createat = moment(item.created_at).add(3, "minutes");
      if (moment().isBefore(createat)) {
        item.isover3min = false;
      } else item.isover3min = true;

      item["goodsAmount"] = 0;
      item.OrderDetails.map(iitem => {
        try {
          let t = JSON.parse(iitem.sku_specification);
          iitem.sku_specification = t["规格"];
        } catch (ex) {}
        if (!!iitem.sku_specification) {
          iitem.sku_specification_show =
            iitem.sku_specification.length > 10
              ? iitem.sku_specification.substring(0, 10) + "..."
              : iitem.sku_specification;
        }
        item["goodsAmount"] += iitem.amount;
        if (!!iitem.Sku && !!iitem.Sku.photos) {
          iitem["cartImg"] = iitem.Sku.photos.split(",")[0];
        }
      });
    });
    this.$apply();
  }
  async go2pay(e) {
    let id = e.currentTarget.id;
    let result = await this.$parent.globalData.post(
      `${api.server}/api/ec/b2c/order/check4pay`,
      { orderid: id }
    );
    if (result.state == "error") {
      this.confirmData.title = "温馨提示";
      this.confirmData.msg = result.errorMsg.replace(/,/g, "\n");
      this.$broadcast("showTips");
      this.$apply();
      return;
    }
    wx.navigateTo({
      url: `/pages/user/pay?id=${id}&final_price=${e.target.dataset.price}`
    });
  }
  methods = {
    navTab(e) {
      this.allPages = 0;
      this.page = 0;
      this.currNav = e.currentTarget.dataset.index + "";
      this.orderList = [];
      this.getOrderList(0);
      this.$apply();
    },
    go2orderDetail(e) {
      let ordersn = e.currentTarget.dataset.ordersn;
      wx.navigateTo({
        url: `/pages/user/orderdetail?ordersn=${ordersn}`
      });
    }
  };
}
</script>
<style>
.addressList {
  padding: 14rpx 20rpx;
  border-bottom: solid 1rpx #f2f2f2;
}
.addressList text {
  display: block;
  font-size: 28rpx;
  color: #2f2f30;
  font-weight: bold;
}
.addressList text:nth-child(2) {
  font-size: 24rpx;
  color: #969699;
  font-weight: normal;
  margin-top: 6rpx;
}
.address_box .icon_phone {
  left: 20rpx;
}
.addressPhone {
  padding-left: 20rpx;
  font-size: 22rpx;
  color: #f8992d;
  top: 10rpx;
  position: relative;
}
.addressPhone image {
  width: 25rpx;
  height: 25rpx;
  display: inline-block;
  position: absolute;
  top: 9rpx;
}
.addressPhone text {
  display: inline-block;
  margin-left: 35rpx;
  margin-top: 7rpx;
}
.order_goods {
  width: 730rpx;
  margin: 0 auto 20rpx auto;
  background: #fefefe;
  border-radius: 12rpx;
}
.order_goods .order_title {
  height: 84rpx;
  border-bottom: solid 1rpx #f2f2f2;
  position: relative;
}
.order_goods .order_title .order_code {
  font-size: 26rpx;
  color: #969699;
  left: 20rpx;
}
.order_goods .order_title .order_status {
  font-size: 26rpx;
  color: #ec3e29;
  position: absolute;
  right: 20rpx;
  height: 30rpx;
  margin-top: 30rpx;
}
.order_goods .order_title .order_status_color {
  color: #969699;
}

.order_goods .goods_list {
  margin: 20rpx;
  position: relative;
  padding-bottom: 8rpx;
  border-bottom: solid 1rpx #f2f2f2;
}
.goods_list image {
  width: 118rpx;
  height: 118rpx;
  position: relative;
  left: 0;
  top: 0;
  background: #f2f2f2;
  display: block;
}
.goods_list .goods_text {
  position: absolute;
  left: 140rpx;
  top: 5rpx;
}
.goods_list .goods_name {
  font-size: 26rpx;
  color: #2f2f30;
  font-weight: bold;
  display: block;
  margin-top: 4rpx;
  width: 344rpx;
  line-height: 36rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods_list .goods_spec {
  font-size: 22rpx;
  color: #9b9b9b;
  background: #f2f2f2;
  border-radius: 8rpx;
  padding: 6rpx;
  position: relative;
}
.goods_list .goods_price {
  font-size: 26rpx;
  color: #2f2f30;
  display: inline-block;
  position: absolute;
  top: 10rpx;
  right: 20rpx;
}
.goods_list .goods_time {
  font-size: 24rpx;
  color: #f8921f;
  display: block;
  position: absolute;
  top: 90rpx;
  right: 20rpx;
}
.order_goods .goods_num {
  font-size: 26rpx;
  color: #acacaf;
  position: absolute;
  right: 20rpx;
  top: 58rpx;
}
.goods_list .font_small {
  font-size: 26rpx;
}
.goods_list .goods_num .font_small {
  font-size: 18rpx;
}
.service_explain {
  padding: 10rpx 30rpx;
  font-size: 22rpx;
  color: #969699;
  height: 160rpx;
}
.service_explain text {
  display: block;
  margin-top: 10rpx;
}
.service_explain .phoneImg {
  width: 25rpx;
  height: 25rpx;
  float: left;
  display: block;
  margin-left: 12rpx;
  margin-top: 11rpx;
}
.service_explain .phoneText {
  margin-left: 24rpx;
  float: left;
}
.service_explain .phoneContent {
  width: 290rpx;
  height: 40rpx;
}

.service_explain .hit {
  margin-left: 24rpx;
  margin-bottom: 15rpx;
}
.goods_top {
  border-bottom: solid 1rpx #f2f2f2;
  padding-bottom: 8rpx;
  position: relative;
  margin-bottom: 18rpx;
  min-height: 126rpx;
}
.order_time {
  height: 66rpx;

  position: relative;
  line-height: 56rpx;
}
.ordersTime {
  position: absolute;
  /* left: 20rpx; */
  font-size: 24rpx;
  color: #969699;
}
.ordersTotal {
  font-size: 24rpx;
  color: #2f2f30;
  position: absolute;
  right: 20rpx;
}
.ordersTotal .price {
  color: #ec3e29;
  font-size: 34rpx;
  display: inline-block;
  margin-left: 22rpx;
  position: relative;
  top: 3rpx;
}
.order_code {
  height: 86rpx;
  line-height: 86rpx;
  position: relative;
}
.order_code text {
  left: 20rpx;
  font-size: 24rpx;
  color: #969699;
}
.order_code .deleteBtn {
  width: 145rpx;
  height: 54rpx;
  line-height: 54rpx;
  text-align: center;
  border: 1rpx solid #2f2f30;
  border-radius: 100rpx;
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  font-size: 24rpx;
  color: #2f2f30;
}

.goBuyBtn {
  width: 153rpx;
  height: 58rpx;
  line-height: 58rpx;
  text-align: center;
  border: 1rpx solid #f8992d;
  border-radius: 100rpx;
  position: absolute;
  right: 20rpx;
  top: 10rpx;
  font-size: 24rpx;
  color: #f8992d;
}
.goBuyBtn image {
  width: 27rpx;
  height: 25rpx;
  position: relative;
  top: 2rpx;
  margin-right: 6rpx;
}
.order_code .pay_btn {
  color: #fefefe;
  background: #ec3e29;
  border: 0;
}
.order_code .pay_btn.disabled {
  color: #fefefe;
  background: #cccccc;
  border: 0;
}
.orderStatus_box {
  height: 101rpx;
  background: #f2f2f2;
  position: fixed;
  top: 0;
  z-index: 9999;
  width: 100%;
}
.orderStatus_box text {
  display: inline-block;
  width: 110rpx;
  text-align: center;
  padding-top: 27rpx;
  font-size: 26rpx;
  color: #2f2f30;
  margin-left: 48rpx;
  margin-right: 26rpx;
}
.orderStatus_box text.checked {
  border-bottom: solid 6rpx #ef4c34;
  border-radius: 2rpx;
}
.no-order-tips {
  display: block;
  line-height: 29rpx;
  text-align: center;
  font-size: 29rpx;
  color: #999;
  margin-top: 320rpx;
}
.scroll_box {
  margin-top: 105rpx;
}
.pop_box {
  width: 580rpx;
  position: fixed;
  left: 50%;
  top: 50%;
  background: #fff;
  border-radius: 12rpx;
  z-index: 9999;
  -webkit-transform: translateX(-50%) translateY(-50%);
}
.pop_box .h2 {
  padding-top: 30rpx;
}
.pop_box .h2 text {
  font-size: 28rpx;
  color: #666;
  display: block;
  /* padding-top: 20rpx; */
  font-weight: normal;
  width: 490rpx;
  margin: 0 auto;
}

.pop_box .title {
  text-align: center;
  padding-top: 35rpx;
  font-size: 39rpx;
  color: #fff;
  font-weight: bold;
  position: relative;
  height: 83rpx;
}
.pop_box .title image {
  width: 580rpx;
  height: 118rpx;
  position: absolute;
  top: 0;
  left: 0;
}
.pop_box .title text {
  position: absolute;
  left: 196rpx;
}
.pop_box .ico_bt_btn {
  text-align: center;
  font-size: 30rpx;
  color: #1aad16;
  font-weight: bold;
}

.pop_box .sumbit {
  border: 2rpx solid #ec3e29;
  border-radius: 100rpx;
  width: 425rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #ec3e29;
  margin: 20rpx auto;
  color: #fff;
  background: #ec3e29;
}
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
.order_line {
  border-top: solid 1rpx #f2f2f2;
}
.goods_list .skeleton-rect {
  color: #fff;
}
</style>