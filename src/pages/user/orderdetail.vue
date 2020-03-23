<template>
    <view class="page">
        <view class="page__bd">
            <skeleton slector="skeleton" bgcolor="none" loading="spin" wx:if="{{showSkeleton}}"></skeleton>
            <!--订单完成状态显示-->
            <view class="skeleton">
                <view class="order_status" wx:if="{{orderInfo.order_status==1}}">
                    <image src="../../images/dth_img.png"></image>
                    <text>待提货</text>
                </view>
                <view class="order_status skeleton-rect" wx:if="{{orderInfo.order_status==4}}">
                    <image src="../../images/yth_img.png"></image>
                    <text>已提货</text>
                </view>
                <view class="order_status" wx:if="{{orderInfo.order_status==0}}">
                    <image src="../../images/wfk_img.png"></image>
                    <text>未付款</text>
                </view>
                <view class="order_status" wx:if="{{orderInfo.order_status==-1}}">
                    <image src="../../images/ygb_img.png"></image>
                    <text>已关闭</text>
                </view>
                <!--收货人信息-->
                <view class="address_box">
                    <image src="../../images/address_img_top.png" class="topImg"></image>
                    <image src="../../images/address_img.png"></image>
                    <view class="addressList">
                        <text class="skeleton-rect">收货人：{{orderInfo.receiver}} {{orderInfo.mobile2}}</text>
                        <text class="skeleton-rect">{{orderInfo.address}}</text>
                    </view>
                    <!-- <view class="addressPhone" bindtap="callmobile({{shopInfo.contact}})">
                        <text class="skeleton-rect">自提点电话：{{orderInfo.Shop.contact}}</text>
                        <image src="../../images/phone_img.png"></image>
                    </view> -->
                </view>
                <!--服务热线-->
                <view class="service_explain">
                    <text>1. 如果您购买的商品有任何问题，请直接与购买联系！</text>
                    <text class="hit">100%售后保证！</text>
                    <text>2. 如果您找不到购物时的提货门店，请致电热线帮忙！</text>
                    <view class="phoneContent" bindtap="serviceHotline">
                        <text class="phoneText">13665197818</text>
                        <image src="../../images/phone_img.png" class="phoneImg"></image>
                    </view>
                </view>
                <!--订单商品信息-->
                <view class="order_goods">
                    <view class="order_title">
                        <text class="shop_name ">{{orderInfo.Shop.shop_name}}商品</text>
                        <view class="goBuyBtn" bindtap="go2index">
                            <image src="../../images/ico_carts.png"></image>
                            <text>去购物</text>
                        </view>
                    </view>
                    <view class="goodsContent">
                        <view class="goods_list">
                            <view class="goods_top" wx:for="{{orderGoods}}" wx:key="id">
                                <navigator url="/pages/user/goods?id={{item.Sku.id}}">
                                    <image src="{{fileserver+item.cartImg}}" class="skeleton-rect" mode="aspectFill"></image>
                                    <text class="goods_price skeleton-rect">
                                        <text class="font_small ">¥</text>{{item.sku_price/100}}</text>
                                    <text class="goods_num  skeleton-rect">
                                        <text class="font_small">X </text>{{item.amount}}</text>
                                    <text class="goods_time skeleton-rect">提货时间： {{item.end_time_str}}</text>
                                    <view class="goods_text ">
                                        <view class="goods_name skeleton-rect">{{item.sku_name}}</view>
                                        <text class="goods_spec skeleton-rect" wx:if="{{item.sku_specification}}">{{item.sku_specification_show}}</text>
                                    </view>
                                </navigator>
                            </view>

                            <view class="order_time">

                                <view class="ordersTotal">
                                    <text class="num skeleton-rect">共{{goodsAmount}}件商品</text>
                                    <text class="price skeleton-rect">商品总价：¥{{orderInfo.total_price/100}}</text>
                                </view>
                            </view>
                            <view class="order_time ordersPrice">
                                <view class="ordersTotal">
                                    <text class="skeleton-rect">
                                        <text>已优惠：</text>
                                        <text class="font_red_s ">¥{{orderInfo.discount_amount/100}}</text>
                                    </text>
                                    <text class="skeleton-rect">
                                        <text>实付：</text>
                                        <text class="font_red ">¥{{orderInfo.final_price/100}}</text>
                                    </text>
                                </view>
                            </view>
                            <view class="order_code">
                                <text class="skeleton-rect" selectable="true">订单编码：{{orderInfo.order_sn}}</text>
                                <text class="skeleton-rect">订单时间：{{orderInfo.created_at}}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!--用户信息授权-->
        <!-- <getuserinfo></getuserinfo> -->
    </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import moment from "moment";
import getuserinfo from "../../components/getuserinfo";
export default class Index extends auth {
  config = {
    navigationBarTitleText: "订单详情",
    enablePullDownRefresh: false,
    usingComponents: {
      skeleton: "../../plugin/wux/skeleton/skeleton"
    }
  };
  components = {
    getuserinfo: getuserinfo
  };
  data = {
    needUserinfo: false, // 是否显示授权
    userInfo: {}, //用户信息
    shopInfo: {}, //门店信息
    id: null, //订单ID
    shopid: null,
    showSkeleton: true,
    ordersn:"",
    orderInfo: {
      id: 1,
      order_status: 4,
      receiver: "收货人的姓名电话",
      address: "收件人的地址"
    }, //订单信息数据
    orderGoods: [
      {
        id: 1,
        sku_price: "",
        amount: "",
        sku_name: "商品名称",
        sku_specification: "商品规格"
      }
    ], //商品信息数据
    goodsAmount: 0, //商品共计总数
    newShopInfo: {}, //新的自提点门店信息
    fileserver: `${api.uploadimgFile}` //上传图片域名
  };

  async onLoad(options) {
    let result = await super.onLoad(options);
    this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};
    this.needUserinfo = this.$parent.globalData.needUserinfo;
    console.log("this.need login is ", this.needUserinfo);
    if (this.needUserinfo) this.$broadcast("showUserInfo");
    // 验证分享商店id
    this.id = options.orderId;
    this.shopid = options.shopid;
    this.ordersn = options.ordersn;
    await this.getOrderDetail();
    if (this.orderInfo.id) {
      this.showSkeleton = false;
      this.$apply();
    }
  }

  //获取订单详情
  async getOrderDetail() {
    let resultInfo = await this.$parent.globalData.get(
      `${api.server}/api/ec/order/info?ordersn=${this.ordersn}`
    );
    if (resultInfo.state !== "error") {
      this.orderInfo = resultInfo;
      this.orderInfo.mobile2 =
        this.orderInfo.mobile.substring(0, 3) +
        "****" +
        this.orderInfo.mobile.substring(7);
      this.orderGoods = resultInfo.OrderDetails;
      let _now = this.getNow();

      this.orderGoods.map(item => {
        try {
          let t = JSON.parse(item.sku_specification);
          item.sku_specification = t["规格"];
        } catch (ex) {}
        if (!!item.sku_specification) {
          item.sku_specification_show =
            item.sku_specification.length > 10
              ? item.sku_specification.substring(0, 10) + "..."
              : item.sku_specification;
        }
        if (!!item.Sku && !!item.Sku.photos) {
          item["cartImg"] = item.Sku.photos.split(",")[0];
        }
        this.goodsAmount += item.amount;
        if (item.sku_expected_time) {
          item.end_time_str = item.sku_expected_time;
        } else {
          item.end_time_str = moment(item.created_at)
            .add(1, "days")
            .format("YYYY-MM-DD"); //提货时间
        }
      });
    }
    this.$apply();
  }
  getNow() {
    return moment();
  }
  methods = {
    callmobile(mobile) {
      wx.makePhoneCall({
        phoneNumber: mobile
      });
    },
    serviceHotline() {
      wx.makePhoneCall({
        phoneNumber: "13665197818"
      });
    },
    go2index() {
      wx.reLaunch({ url: `/pages/user/index?shopid=${this.shopid}` });
    }
  };
}
</script>
<style>
.order_status {
  height: 80rpx;
  background: #fdf3e7;
  position: relative;
}
.order_status image {
  width: 31rpx;
  height: 31rpx;
  position: absolute;
  top: 25rpx;
  left: 20rpx;
}
.order_status text {
  font-size: 28rpx;
  color: #ec3e29;
  font-weight: bold;
  top: 22rpx;
  left: 62rpx;
  position: absolute;
}
.address_box {
  width: 730rpx;
  background: #fefefe;
  border-radius: 12rpx;
  margin: 20rpx auto 0 auto;
  font-size: 26rpx;
  position: relative;
}
.address_box image {
  width: 728rpx;
  height: 6rpx;
  position: absolute;
  bottom: 0;
}
.address_box .addressPhone image {
  width: 25rpx;
  height: 25rpx;
  display: inline-block;
  position: absolute;
  top: 9rpx;
  margin-left: 15rpx;
}
.address_box .topImg {
  top: 0;
}
.addressList {
  padding: 14rpx 20rpx;
  border-bottom: solid 1rpx #f2f2f2;
}
.addressList text {
  display: block;
  font-size: 30rpx;
  color: #2f2f30;
  font-weight: bold;
  margin-top: 10rpx;
}
.addressList text:nth-child(2) {
  font-size: 26rpx;
  color: #969699;
  font-weight: normal;
  /* margin-top: 6rpx; */
}

.addressPhone {
  padding-left: 20rpx;
  font-size: 24rpx;
  color: #f8992d;
  top: 10rpx;
  position: relative;
  padding-bottom: 21rpx;
}

.addressPhone text {
  display: inline-block;
  margin-top: 6rpx;
}
.order_goods {
  width: 730rpx;
  margin: 30rpx auto 0 auto;
  background: #fefefe;
  border-radius: 12rpx;
}
.order_goods .order_title {
  height: 84rpx;
  border-bottom: solid 1rpx #f2f2f2;
  position: relative;
}
.order_goods .order_title .shop_name {
  position: absolute;
  font-size: 28rpx;
  color: #ec3e29;
  left: 20rpx;
  top: 25rpx;
  font-weight: bold;
}
.order_goods .goods_num {
  font-size: 26rpx;
  color: #acacaf;
  position: absolute;
  right: 20rpx;
  top: 50rpx;
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
  float: left;
}
.goods_list .goods_text {
  float: left;
  margin-left: 20rpx;
  margin-top: 5rpx;
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
  font-size: 44rpx;
  color: #2f2f30;
  display: inline-block;
  position: absolute;
  top: -8rpx;
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
.goods_list .font_small {
  font-size: 26rpx;
}
.goods_list .goods_num .font_small {
  font-size: 18rpx;
}
.service_explain {
  padding: 10rpx 30rpx;
  font-size: 24rpx;
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
  height: 58rpx;
  border-bottom: solid 1rpx #f2f2f2;
  position: relative;
  line-height: 44rpx;
}
.ordersTime {
  position: absolute;
  left: 20rpx;
  font-size: 24rpx;
  color: #969699;
}
.ordersTotal {
  font-size: 24rpx;
  color: #2f2f30;
  position: relative;
}
.ordersTotal .num {
  display: block;
  float: left;
}
.ordersTotal .price {
  display: block;
  float: right;
}
.order_code {
  height: 86rpx;
  position: relative;
  padding-top: 20rpx;
  padding-bottom: 20rpx;
}
.order_code text {
  font-size: 24rpx;
  color: #969699;
  display: block;
  line-height: 40rpx;
  margin-bottom: 10rpx;
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
  width: 199rpx;
  height: 58rpx;
  line-height: 62rpx;
  text-align: center;
  border-radius: 100rpx;
  position: absolute;
  right: 20rpx;
  top: 14rpx;
  font-size: 24rpx;
  color: #fefefe;
  background: #f79d36;
}
.goBuyBtn image {
  width: 27rpx;
  height: 25rpx;
  position: relative;
  top: 6rpx;
  margin-right: 6rpx;
}
.ordersPrice .num {
  width: 500rpx;
  text-align: right;
  position: relative;
  top: 4rpx;
}
.ordersPrice {
  padding-top: 14rpx;
  padding-bottom: 2rpx;
}
.font_red {
  color: #ec3e29;
  font-size: 34rpx;
  position: relative;
  top: 2rpx;
}
.font_red_s {
  color: #ec3e29;
  display: inline-block;
  margin-right: 50rpx;
}
.ordersPrice .ordersTotal {
  text-align: right;
}
</style>