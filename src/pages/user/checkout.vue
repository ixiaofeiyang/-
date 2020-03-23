<template>
  <view class="page">
    <view class="page__bd">
      <view class="tips"
            wx:if="{{showTimeStatus}}">
        <wux-notice-bar loop
                        wux-class="notice-bar"
                        icon="http://hjl2c.dawangtv.cn/wxa_images/icon_hint.gif">
          <!-- 春节放假通知：1月23日-1月30日，可下单不配送。1月31日正常配送。售后问题节后处理。祝大家新年“好极了” -->
          <!-- 应有关部门建议，为配合疫情防控，我司营业时间调整如下：1月31日营业到17:00；2月1日营业到12:00；2月2日之后，每天营业到17:00。 -->
          {{SysNoticeInfo.content}}
        </wux-notice-bar>
      </view>
      <!--收货人姓名 电话-->
      <view class="address_box" bindtap="go2addressList">
        <!-- <label>收件人：</label>
        <input type="text"
               placeholder-class='placeholdercolor'
               placeholder="请填写收件人姓名"
               value="{{receiver}}"
               bindinput="bindInputName"
               data-name="userName" />
        <input class="inp"
               type="number"
               maxlength="11"
               placeholder-class='placeholdercolor'
               value="{{mobile}}"
               placeholder="请填写手机号"
               bindinput="bindInputMobile"
               data-name="telNumber" /> -->

        <view class="weui-cell">
          <view class="weui-cell__bd">
            <view class="my_address" wx:if="{{!mobile}}">暂无收货地址，请先添加收货地址</view>
            <view class="my_name">{{receiver}} {{mobile}}</view>
            <view class="my_address">{{address}}</view>
          </view>

        </view>
        <image src="../../images/address_img.png"></image>

      </view>
      <!--门店自提点地址-->
      <!-- <view class="order_address">
        <view class="addressList">
          <view class="shopName">
            <text>自提点：{{shopInfo.shop_name}}</text>
            <text wx:if="{{shopInfo.status == 4}}">(休息中)</text>
          </view>
          <text class="shopAddress">{{shopInfo.address}}{{shopInfo.address_detail||''}}</text>
        </view>
        <view class="addressPhone"
              wx-if="{{shopInfo}}">
          <text bindtap="callmobile({{shopInfo.contact}})">自提点电话：{{shopInfo.contact}} </text>
          <image src="../../images/phone_img.png"></image>
        </view>
      </view> -->
      <!--门店商品-->
      <view class="order_goods">
        <view class="order_title">
          <text class="shop_name">{{shopInfo.shop_name}}商品</text>
          <text class="goods_num">共计{{goodsAmount}}件商品</text>
        </view>
        <view class="goodsContent">
          <view class="goods_list"
                wx:for="{{goodsList}}"
                wx:key="id">
            <image src="{{fileserver+item.cartImg}}"
                   mode="aspectFill"></image>
            <view class="goods_text">
              <text class="goods_name">{{item.Sku.sku_name}}</text>
              <!-- <view class="goods_spnum"> -->
              <text class="goods_spec"
                    wx:if="{{item.Sku.sku_specification_show}}">{{item.Sku.sku_specification_show}}</text>
              <!-- </view> -->
              <view class="goods_nums">
                <text class="font_small">X</text>
                {{item.amount}}
              </view>
              <view class="goods_footer">
                <!-- <text class="goods_time ui_flex_1">提货时间：{{item.Sku.expected_time}}</text> -->
                <view class="price_box ui_flex_1">
                  <text class="goods_price">
                    <text class="font_small">¥</text>{{item.Sku.price/100}}</text>
                  <text class="original_price">¥{{item.Sku.default_price/100}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="goods_total">
          <text class="goods_num">共计{{goodsAmount}}件商品</text>
          <view>应付金额：
            <text class="font_small">¥</text>
            <text class="red">{{TotalPrcie/100}}</text>
          </view>
        </view>
      </view>
      <!--服务热线-->
      <view class="service_explain">
        <text>1. 如果您购买的商品有任何问题，请直接与购买的自提点联系！</text>
        <text class="hit">100%售后保证！</text>
        <text>2. 如果您找不到购物时的提货门店，请致电热线帮忙！</text>
        <view class="phoneContent"
              bindtap="serviceHotline">
          <text class="phoneText">13665197818</text>
          <image src="../../images/phone_img.png"
                 class="phoneImg"></image>
        </view>
      </view>
      <!--总计-->
      <view class="cart-bottom {{isFullSucreen?'fix-Full-button':''}}">
        <view class="total">合计：
          <text class="font_small">¥</text>
          <text class="red">{{TotalPrcie/100}}</text>
        </view>
        <view class="checkout"
              bindtap="submitOrder">提交订单</view>
      </view>
    </view>
    <!--确认订单-->
    <view class="mark"
          wx:if="{{isShow}}"></view>
     <!-- <view class="checkout_box"
          wx:if="{{isShow}}">
      <view class="checkout_title">
        <image src="../../images/order_title.png"
               class="order_title"></image>
        <text> {{now}} 16:00 提货</text>
        <text>确认自提点</text>
      </view>
      <view class="checkout_explain">
        <view class="explain_text">
          <text class="red">此商品需要您到店自提，请仔细确认地址！</text>
        </view>
      </view>
      <view class="shop_address">
        <view class="shopName">
          <text>自提门店：{{shopInfo.shop_name}}</text>
          <text wx:if="{{shopInfo.status == 4}}">(休息中)</text>
        </view>
        <text>{{shopInfo.address}}{{shopInfo.address_detail||''}}</text>
      </view>
      <view class="checkoutBtn cancelBtn "
            bindtap="closeIsShow">取消付款</view>
      <view class="checkoutBtn"
            bindtap="submitOrder">确定订单</view>
    </view>-->
    <!--遮罩层-->
    <view class="mask"
          catchtouchmove="true"
          wx:if="{{mask}}"></view>
    <!--自定义loading-->
    <view class="shade-loading"
          wx:if="{{isShowLoading}}">
      <!-- <image class="loading-icon" src="../../images/loading-icon.gif"></image> -->
      <wux-spin nested
                wux-class="spin"
                size="default"
                tip="加载中..." />
    </view>
    <!--没有自提点时需选择自提点提示-->
    <confirm :confirmData.sync="confirmData"></confirm>
    <!--获取用户电话授权-->
    <getmobile :mobile="mobile"></getmobile>
  </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import log from "../../util/log";
import confirm from "../../components/confirm";
import getmobile from "../../components/getmobile";
import moment from "moment";

export default class Index extends auth {
  config = {
    navigationBarTitleText: "确认订单",
    enablePullDownRefresh: true,
    usingComponents: {
      "wux-notice-bar": "../../plugin/wux/notice-bar/index",
      "wux-spin": "../../plugin/wux/spin/index"
    }
  };
  components = {
    getmobile: getmobile,
    confirm: confirm
  };
  data = {
    needMobile: false, //手机号授权
    userInfo: {}, //用户信息
    shopInfo: {}, //门店信息
    isShow: false, //确认下单弹层显示状态
    goodsList: [], //商品数据
    skuids: null,
    shopid: null,
    goodsAmount: 0, // 商品总数
    TotalPrcie: 0, // 商品总价
    id: null,
    mobile: "",
    fileserver: `${api.uploadimgFile}`, //上传图片域名
    final_price: null,
    submitStatus: true, //按钮重置状态
    now: null,
    receiver: "",
    isFullSucreen: false, //全面屏手机判断标识
    timeStatus: false,
    isShowLoading: false,
    mask: false,
    showTimeStatus: false,
    SysNoticeInfo: {},
    confirmData: {}, //弹框数据
    addressid: null,
    address:'',
    //下单提交数据
    orderForm: {
      sku_list: [],
      shopid: null,
      use_cart: 0,
      shipping_price: 0,
      pay_name: "WeChat",
      receiver: "",
      mobile: "",
      country: "中国",
      province: "北京",
      city: "北京",
      district: "海淀区",
      address: "",
      order_source: "1"
    },
    payForm: {
      orderid: null,
      appid: "wx355bbf95fc53877a"
    },
    createOrderApi: ["/api/ec/b2c/order/create", "/api/ec/b2c/order/create4act"]
  };

  async onLoad(options) {
    console.log("into checkout page , onload options is ", options);
    let result = await super.onLoad(options);
    this.checkmobile();
    // this.mobile = this.userInfo.mobile;
    // this.receiver = this.userInfo.nickname;
    this.shopInfo =
      this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
    this.skuids = options.skuids;
    this.id = options.id;
    console.log(options, "options");
    // 验证是否是立即购买
    if (options.order_source == "2" || options.order_source == "3") {
      this.orderForm.order_source = Number(options.order_source);
      // this.goodsInfo = JSON.parse(options.goodsInfo);
      let resultInfo = await this.$parent.globalData.get(
        `${api.server}/api/ec/b2c/sku/info?id=${this.id}`
      );
      if (resultInfo.state !== "error") {
        this.goodsInfo = resultInfo;

        let _now = this.getNow().add(1, "days");
        this.now = _now.format("YYYY-MM-DD");

        let expected_time = this.now;
        if (!!this.goodsInfo && this.goodsInfo.expected_time) {
          expected_time = this.goodsInfo.expected_time;
        }

        this.goodsInfo.sku_specification = this.goodsInfo.sku_specification || ''

        try {
          let t = JSON.parse(this.goodsInfo.sku_specification);
          if (typeof (t) == 'object') {
            this.goodsInfo.sku_specification = t["规格"];
          }
        } catch (ex) { }
        if (!!this.goodsInfo.sku_specification) {
          this.goodsInfo.sku_specification_show =
            this.goodsInfo.sku_specification.length > 10
              ? this.goodsInfo.sku_specification.substring(0, 10) + "..."
              : this.goodsInfo.sku_specification;
        }
        this.goodsInfo.Sku = {
          headimg: this.goodsInfo.headimg,
          sku_name: this.goodsInfo.sku_name,
          sku_specification_show: this.goodsInfo.sku_specification_show,
          default_price: this.goodsInfo.default_price,
          price: this.goodsInfo.price,
          photos: this.goodsInfo.photos,
          expected_time: expected_time
        };
        if (!!this.goodsInfo.photos) {
          this.goodsInfo.cartImg = this.goodsInfo.photos.split(",")[0];
        }
        this.goodsInfo.amount = 1;
        this.goodsAmount = 1;
        this.goodsList.push(this.goodsInfo);
        this.TotalPrcie = this.goodsInfo.price;
        this.$apply();
      }
    } else {
      this.getCheckout();
    }
    this.getSysNotice();
    this.checkFullSucreen();
    //this.getCurrentTime();
    this.$apply();
  }
  checkmobile() {
    this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};
    this.orderForm.receiver = this.userInfo.nickname;
    if (!this.userInfo.mobile) {
      this.needMobile = true;
      this.$broadcast("showMobileInfo");
      return false;
    }
    return true;
  }
  async onPullDownRefresh() {
    this.getSysNotice();
    wx.stopPullDownRefresh();
  }
  onShow() {
    this.getDefaultAddress()
    this.shopInfo =
      this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
    this.$apply();
  }
  //check手机型号
  checkFullSucreen() {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res, "this is res"); // 根据 屏幕高度 进行判断
        if (res.model.search("iPhone X") != -1) {
          that.isFullSucreen = true;
        }
      }
    });
  }
  // 获取服务器的当前时间
  //   async getCurrentTime() {
  //     let self = this;
  //     let result = await this.$parent.globalData.get(
  //       `${api.server}/auth/currentTime`
  //     );
  //     this.currenttime = result.currenttime;
  //     let start_time = moment("2019-09-28 12:00:00");
  //     let end_time = moment("2019-10-04 00:00:00");
  //     let now = moment(this.currenttime);
  //     if (now.isAfter(start_time) && now.isBefore(end_time)) {
  //       this.timeStatus = true;
  //     } else {
  //       this.timeStatus = false;
  //     }
  //     this.$apply();
  //   }
  //结算
  async getCheckout() {
    let result = await this.$parent.globalData.post(
      `${api.server}/api/ec/b2c/cart/checkout`,
      {
        skuids: this.skuids
      }
    );
    this.goodsList = result.sku_list;
    if (this.goodsList.length > 0) {
      this.goodsList.map(item => {
        if (!!item.Sku && !!item.Sku.photos) {
          item["cartImg"] = item.Sku.photos.split(",")[0];
        }
      });
    }
    this.TotalPrcie = result.goods_price;
    let _now = this.getNow().add(1, "days");
    this.now = _now.format("YYYY-MM-DD");
    // 处理商品图片 保持 和 购物结构一致
    if (this.goodsList.length > 0) {
      this.goodsList.map(item => {
        try {
          let t = JSON.parse(item.Sku.sku_specification);
          item.Sku.sku_specification = t["规格"];
        } catch (ex) { }

        item.Sku.sku_specification_show =
          item.Sku.sku_specification.length > 10
            ? item.Sku.sku_specification.substring(0, 10) + "..."
            : item.Sku.sku_specification;

        item["headimg"] = item.Sku.headimg;
        item.Sku.expected_time = item.Sku.expected_time
          ? item.Sku.expected_time
          : this.now;
        this.goodsAmount += item.amount;
      });
    }
    console.log(this.goodsList, "this.goodsList");
    this.$apply();
  }

  // 下单
  async submitOrder() {
    wx.aldstat.sendEvent("确认订单页确认订单按钮点击", {});
    console.log(
      "into submit order method, the submitStatus is ",
      this.submitStatus
    );
    if (!this.checkmobile()) {
      //如果true,则是mobile好好的，如果check为false，说明手机号有问题
      return;
    }
    if (!this.submitStatus) {
      return false;
    }
    this.submitStatus = false;
    // wx.showLoading({ title: "加载中" });
    this.mask = true;
    this.isShowLoading = true;
    this.$apply();
    console.log(this.goodsList, 'this.goodsList')

    // 处理 sku_list
    if (this.orderForm.order_source == 2) {
      let skuid = ''
      if (typeof this.goodsList == 'object' && this.goodsList.constructor == Array && this.goodsList.length > 0) {
        skuid = this.goodsList[0].id
      }
      this.orderForm.sku_list = [
        {
          skuid: skuid || '',
          amount: 1,
          shopid: this.shopInfo.id
        }
      ];
    } else if (this.orderForm.order_source == 3) {
      let skuid = ''
      if (typeof this.goodsList == 'object' && this.goodsList.constructor == Array && this.goodsList.length > 0) {
        skuid = this.goodsList[0].id
      }
      this.orderForm.sku_list = [
        {
          skuid: skuid || '',
          amount: 1,
          shopid: this.shopInfo.id
        }
      ];
    } else {
      this.orderForm.sku_list = this.goodsList;
    }

    // 邀请好友活动
    let shareuid = wx.getStorageSync("shareuid") || "";
    this.orderForm.order_source = shareuid ? 3 : this.orderForm.order_source;
    if (this.orderForm.order_source == 3) {
      this.orderForm.utm_source = `activity20200101_${shareuid}`;
    }

    this.orderForm.shopid = 1;
    this.orderForm.address = this.address;
    this.orderForm.mobile = this.mobile;
    this.orderForm.receiver = this.receiver;
    console.log("this.mobile", this.mobile);

    // if (!this.mobile) {
    //   wx.showModal({
    //     confirmColor: "#338AF1",
    //     title: "提示",
    //     showCancel: false,
    //     content: "为了更好的服务，请填写手机号！"
    //   });
    //   this.submitStatus = true;
    //   // wx.hideLoading();
    //   this.mask = false;
    //   this.isShowLoading = false;
    //   this.$apply();
    //   return;
    // }
    //此处调用checkout接口，如果没问题了，再创建订单

    //创建订单
    let createApi =
      this.orderForm.order_source == 3
        ? this.createOrderApi[1]
        : this.createOrderApi[0];
    let resultOrder = await this.$parent.globalData.post(
      `${api.server}${createApi}`,
      this.orderForm
    );

    console.log("this is create order ", resultOrder);
    log.info("this is create order ", resultOrder);
    // wx.hideLoading();
    this.mask = false;
    this.isShowLoading = false;
    this.$apply();
    // 创建新订单失败
    if (resultOrder.state === "error") {
      if (resultOrder.errorType === "shop_closed") {
        this.shopInfo.status = 4;
        this.confirmData.title = "温馨提示";
        this.confirmData.msg = resultOrder.errorMsg;
        this.confirmData.url = "/pages/user/addresslist";
        this.$broadcast("showTips");
      } else {
        wx.showToast({
          title: resultOrder.errorMsg,
          icon: "none",
          duration: 2000
        });
      }
      this.submitStatus = true;
    }
    // 创建新订单成功
    if (resultOrder.state === "success") {
      this.payForm.orderid = resultOrder.order.id;
      wx.redirectTo({
        url: `/pages/user/pay?id=${resultOrder.order.id}&final_price=${
          resultOrder.order.final_price
          }&ordersn=${
          resultOrder.order.order_sn
          }`
      });
    }

    this.$apply();
  }
  //判断配送时间显示
  showInform() {
    let nowyear = moment(
      new Date().getTime() + this.$parent.globalData.diffTime
    ).format("YYYY-MM-DD HH:mm:ss");
    nowyear = moment(nowyear);
    let start_timeyear = moment(this.SysNoticeInfo.start_time);
    let end_timeyear = moment(this.SysNoticeInfo.end_time);
    if (nowyear.isAfter(start_timeyear) && nowyear.isBefore(end_timeyear)) {
      this.showTimeStatus = true;
    } else {
      this.showTimeStatus = false;
    }

    this.$apply();
  }
  //获取配送通知内容
  async getSysNotice() {
    let result = await this.$parent.globalData.get(
      `${api.server}/api/ec/sysnotice/list`
    );
    if (result.length > 0) {
      result.map(item => {
        if (item.status == 1) {
          this.SysNoticeInfo = item
          this.showInform();
        }
      });
    }
    // console.log('')
    this.$apply();
  }
  getNow() {
    return moment();
  }
  //获取收货人信息
  async getDefaultAddress() {
    let resultInfo = await this.$parent.globalData.get(
      `${api.server}/api/ec/address/getDefaultAddress`
    );
    if(!resultInfo){
      this.address = ''
      this.receiver = ''
      this.mobile = ''
      this.confirmData.title = "温馨提示";
      this.confirmData.msg = "您还没有收货地址，请先填写收货地址";
      this.confirmData.url = "/pages/user/editaddress";
      this.$broadcast("showTips");
      this.$apply();
      return
    }
    if (resultInfo.state !== "error") {
      this.address = resultInfo.address
      this.receiver = resultInfo.receiver
      this.mobile = resultInfo.mobile
      this.$apply();
    }
  }
  methods = {
    callmobile(mobile) {
      wx.makePhoneCall({
        phoneNumber: mobile
      });
    },
    bindInputName(e) {
      this.receiver = e.detail.value;
      console.log(e.detail.value, "this is receiver");
    },
    bindInputMobile(e) {
      console.log(e.detail);
      this.mobile = e.detail.value;
      this.$apply();
    },
    //父组件接收子组件传值
    compontpass: function (res) {
      if (e.detail.val) {
      }
      console.log(e.detail.val);
    },
    // showTap() {
    //   // this.shopInfo = this.$parent.globalData.shopInfo
    //   wx.aldstat.sendEvent("确认订单页提交订单按钮点击", {});
    //   this.isShow = true;
    // },
    serviceHotline() {
      wx.makePhoneCall({
        phoneNumber: "13665197818"
      });
    },
    closeIsShow() {
      wx.aldstat.sendEvent("确认订单页取消付款按钮点击", {});
      this.isShow = false;
    },
    go2addressList(){
       wx.navigateTo({
          url: `/pages/user/addresslist`
        });
    }
  };
}
</script>
<style>
.tips .wux-notice-bar {
  background: #fdf3e7;
  color: #ec3e29;
  font-weight: bold;
  line-height: 76rpx;
}
.address_box {
  width: 730rpx;
  /* height: 108rpx; */
  background: #fefefe;
  border-radius: 12rpx;
  margin: 20rpx auto 0 auto;
  font-size: 26rpx;
  position: relative;
}
.address_box label,
.address_box input {
  float: left;
  margin-top: 20rpx;
  font-weight: normal;
}
.address_box label {
  margin-top: 30rpx;
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #2f2f30;
}
.address_box input {
  border: solid 1rpx #c7c7c9;
  width: 310rpx;
  height: 56rpx;
  line-height: 56rpx;
  padding: 0 10rpx;
  font-size: 26rpx;
  color: #969699;
}
.address_box .inp {
  width: 230rpx;
  margin-left: 10rpx;
}
.address_box image {
  width: 728rpx;
  height: 6rpx;
  position: absolute;
  left: 1rpx;
  bottom: 0;
}
.order_address {
  width: 730rpx;
  margin: 20rpx auto 0 auto;
  background: #fefefe;
  border-radius: 12rpx;
  padding-bottom: 20rpx;
}

.addressList {
  padding: 24rpx 20rpx 18rpx 20rpx;
  border-bottom: solid 1rpx #f2f2f2;
}
.addressList .shopName text {
  display: inline-block;
  font-size: 30rpx;
  color: #ec3e29;
  font-weight: bold;
  margin-right: 16rpx;
}
.addressList .shopAddress {
  font-size: 26rpx;
  color: #969699;
  font-weight: normal;
  margin-top: 6rpx;
  display: block;
}
.addressPhone {
  padding-left: 20rpx;
  font-size: 24rpx;
  color: #f8992d;
  top: 10rpx;
  position: relative;
}
.addressPhone image {
  width: 25rpx;
  height: 25rpx;
  display: inline-block;
  position: absolute;
  top: 16rpx;
  margin-left: 15rpx;
}
.addressPhone text {
  display: inline-block;
  margin-top: 10rpx;
}
.order_goods {
  width: 730rpx;
  margin: 20rpx auto 0 auto;
  border-radius: 12rpx;
  position: relative;
  overflow: hidden;
}
.order_goods .goodsContent {
  background: #fefefe;
}
.order_goods .order_title {
  height: 84rpx;
  border-bottom: solid 1rpx #f2f2f2;
  position: relative;
  background: #fefefe;
}
.order_goods .order_title .shop_name {
  position: absolute;
  font-size: 28rpx;
  color: #2f2f30;
  left: 20rpx;
  top: 28rpx;
}
.order_goods .order_title .goods_num {
  font-size: 24rpx;
  color: #ababae;
  position: absolute;
  right: 20rpx;
  top: 30rpx;
}
.order_goods .goods_list {
  margin: 0px 20rpx;
  position: relative;
  border-bottom: solid 1rpx #f2f2f2;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  padding: 20rpx 0px;
}
.order_goods .goods_list:last-child {
  border-bottom: none;
}
.order_goods .goods_list:first-child {
  margin-top: 0;
}
.goods_list image {
  width: 164rpx;
  height: 164rpx;
  position: relative;
  left: 0;
  top: 0;
}
.goods_list .goods_text {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-left: 20rpx;
  position: relative;
}

.goods_list .goods_name {
  font-size: 26rpx;
  color: #2f2f30;
  font-weight: bold;
  display: block;
  margin-top: 4rpx;
  width: 480rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 36rpx;
  margin-top: -4rpx;
}
.goods_list .goods_spec {
  font-size: 22rpx;
  color: #9b9b9b;
  background: #f2f2f2;
  border-radius: 8rpx;
  padding: 6rpx;
  position: relative;
  top:-4rpx;
 
}
.goods_list .goods_price {
  font-size: 34rpx;
  color: #fb6890;
  position: relative;
  font-weight: bold;
  top: -2rpx;
}
.goods_list .goods_time {
  font-size: 24rpx;
  color: #f8921f;
  /* display: block; */
  position: relative;
  /* float: left; */
  word-break: keep-all;
  word-wrap: break-word;
}
.goods_list .price_box {
  /* float: right; */
  margin-right: 20rpx;
  /* text-align: right; */
}
.goods_list .font_small {
  font-size: 26rpx;
}
.goods_list .original_price {
  font-size: 26rpx;
  color: #919194;
  text-decoration: line-through;
  margin-left: 18rpx;
  /* display: block;
  position: relative; */
  /* float: left;
  top: 10rpx; */
}
.service_explain {
  padding: 20rpx 30rpx 100rpx 20rpx;
  font-size: 24rpx;
  color: #969699;
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
  margin-top: 6rpx;
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
  margin-top: 0;
}
.cart-bottom {
  height: 88rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 9998;
  display: flex;
  width: 100%;
}
.cart-bottom .total_num {
  margin: 28rpx 10rpx 0 20rpx;
  font-size: 24rpx;
  color: #9b9b9b;
}
.cart-bottom .total {
  height: 34rpx;
  flex: 1;
  margin: 11rpx 10rpx 0 20rpx;
  font-size: 26rpx;
  color: #2f2f30;
}
.cart-bottom .total .red {
  color: #fb6890;
  font-size: 44rpx;
  font-weight: bolder;
  position: relative;
  top: 5rpx;
}
.cart-bottom .total .font_small {
  color: #fb6890;
  font-size: 26rpx;
  display: inline-block;
  margin-right: 6rpx;
  position: relative;
  top: 2rpx;
}
.cart-bottom .checkout {
  height: 88rpx;
  width: 300rpx;
  text-align: center;
  line-height: 88rpx;
  font-size: 28rpx;
  background: linear-gradient(to right, #fb6890, #fb777d);
  color: #fff;
}
.checkout_box {
  width: 750rpx;
  height: 450rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99999;
  background: #fff;
}
.checkout_box .checkout_title {
  font-size: 32rpx;
  color: #000;
  font-weight: bold;
  text-align: center;
  padding-top: 30rpx;
  position: relative;
  margin-bottom: 40rpx;
}
.checkout_box .checkout_title image {
  width: 26rpx;
  height: 26rpx;
  position: absolute;
  right: 20rpx;
  top: 32rpx;
}
.checkout_box .checkout_title .order_title {
  width: 385rpx;
  height: 80rpx;
  left: 50%;
  margin-left: -192rpx;
  top: -15rpx;
}
.checkout_box .checkout_title text {
  position: absolute;
  font-size: 26rpx;
  color: #fff;
  font-weight: bold;
  /* left: 37%; */
  top: 10rpx;
  left: 41%;
}
.checkout_box .checkout_explain {
  height: 100rpx;
  position: relative;
}
.checkout_box .checkout_explain image {
  width: 89rpx;
  height: 74rpx;
  position: absolute;
  left: 22rpx;
  top: 27rpx;
}
.checkout_explain .explain_text {
  position: absolute;
  left: 130rpx;
  top: 31rpx;
}
.checkout_explain .explain_text text {
  display: block;
  font-size: 28rpx;
  color: #f8921f;
  font-weight: bold;
}
.checkout_explain .explain_text .red {
  font-size: 26rpx;
  color: #ec3e29;
  font-weight: normal;
  text-align: center;
}
.checkout_box .shop_address {
  width: 730rpx;
  background: #f2f2f2;
  border-radius: 12rpx;
  margin: 0 auto;
  padding-top: 8rpx;
  padding-bottom: 8rpx;
}
.checkout_box .shop_address text {
  text-align: center;
  font-size: 24rpx;
  color: #969699;
  margin-top: 10rpx;
  display: block;
}
.checkout_box .shop_address .shopName {
  text-align: center;
}
.checkout_box .shop_address .shopName text {
  font-size: 28rpx;
  color: #161616;
  font-weight: bold;
  display: inline-block;
}
.checkout_box .shop_address .shopName text:nth-child(1) {
  margin-right: 16rpx;
}
.checkout_box .checkoutBtn {
  border: 2rpx solid #ec3e29;
  border-radius: 100rpx;
  letter-spacing: 0.38rpx;
  font-size: 28rpx;
  color: #ec3e29;
  width: 750rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  position: absolute;
  bottom: 30rpx;
  width: 330rpx;
  text-align: center;
  left: 400rpx;
}
.checkout_box .cancelBtn {
  border: 2rpx solid #969699;
  font-size: 28rpx;
  color: #969699;
  letter-spacing: 0.38rpx;
  left: 20rpx;
}
.goods_total {
  width: 730rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #fefefe;
  border-radius: 12rpx;
  margin: 20rpx auto 0 auto;
  font-size: 24rpx;
  color: #ababae;
  text-indent: 20rpx;
  position: relative;
}
.goods_total view {
  position: absolute;
  right: 20rpx;
  font-size: 26rpx;
  color: #2f2f30;
  top: 4rpx;
}
.goods_total view .red {
  color: #fb6890;
  font-size: 38rpx;
  font-weight: bolder;
  position: relative;
  top: 5rpx;
}
.goods_total view .font_small {
  font-size: 26rpx;
  color: #fb6890;
  margin-right: 6rpx;
  display: inline-block;
}
.goods_total .goods_num {
  position: relative;
  top: 7rpx;
}
.goods_spnum {
  position: relative;
}
.goods_nums {
  position: absolute;
  right: 0px;
  color: #919194;
  top: 50%;
  color: #9b9b9b;
  font-size: 26rpx;
  margin-top: -20rpx;
}
.goods_nums .font_small {
  font-size: 18rpx;
}
.fix-Full-button {
  bottom: 68rpx !important;
}

.fix-Full-button::after {
  content: " ";
  position: fixed;
  bottom: 0 !important;
  height: 68rpx !important;
  width: 100%;
  background: #fff;
}

.tips .wux-notice-bar {
  background: #fdf3e7;
  color: #ec3e29;
  font-weight: bold;
  line-height: 76rpx;
}
.goods_footer {
  position: absolute;
  bottom: -5rpx;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  width: 100%;
  padding-right: 20rpx;
  height: 44rpx;
  line-height: 44rpx;
}
.ui_flex_1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
}
.shade-loading {
  width: 162rpx;
  height: 77rpx;
  background: rgba(102, 102, 102, 0.63);
  border-radius: 29rpx;
  position: fixed;
  top: 50%;
  margin-top: -79.5rpx;
  left: 50%;
  margin-left: -81rpx;
  padding-top: 82rpx;
  z-index: 999999;
}
/* .shade-loading {
  width: 200rpx;
  height: 116rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12rpx;
  position: fixed;
  top: 50%;
  margin-top: -108rpx;
  left: 50%;
  margin-left: -100rpx;
  padding-top: 100rpx;
  z-index: 999999; 
}*/
.weui-cell {
  padding: 30rpx;
  min-height:80rpx;
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
  font-weight: normal;
}
</style>