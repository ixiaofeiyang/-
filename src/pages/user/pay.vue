<template>
  <view class="page">
    <view class="pay-box">
      <!--付款步骤示意图-->
      <view class="step_box">
        <image src="../../images/step_img.png"></image>
        <view class="step_text">
          <text>提交订单</text>
          <text>去付款</text>
          <text>完成交易</text>
        </view>
      </view>
      <!--订单金额-->
      <view class="price_box">
        <view class="price_title">订单金额</view>
        <view class="price_order">
          <text>¥</text>{{final_price/100}}</view>
        <view class="price_time">订单提交成功，请在3分钟内完成支付</view>
      </view>
      <view class="paystatusindicator">
        {{paystatus}}
      </view>
    </view>
    <!--view class="payBtn" bindtap="submitPay">去付款</view-->
  </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import log from "../../util/log";
export default class Pay extends wepy.page {
  config = {
    navigationBarTitleText: "在线支付",
    enablePullDownRefresh: false,
    navigationBarTextStyle: "black",
    navigationBarBackgroundColor: "#ffffff",
    backgroundColor: "#ffffff"
  };
  data = {
    status: false, //付款成功失败状态
    orderId: 0, //订单Id
    prepay_id: "",
    final_price: null,
    ordersn: "",
    payForm: {
      orderid: null,
      appid: "wx355bbf95fc53877a"
    },
    counter: 0,
    paystatus: "",
    prepaytimer: null
  };
  async onLoad(options) {
    this.payForm.orderid = options.id;
    this.final_price = options.final_price;
    this.ordersn = options.ordersn;
    this.submitPay();
  }
  // 唤起微信支付
  async submitPay() {
    let that = this;

    //ui上显示文案：“真正准备支付数据”
    console.log("马上准备支付了");
    log.info("马上准备支付了");
    this.counter = 0;
    this.prepaytimer = setInterval(() => {
      //此处显示准备时间，如果7秒钟还没准备好，则弹提示框,并且后退
      this.counter++;
      console.log("已经准备了" + this.counter + "秒");
      log.info("已经准备了" + this.counter + "秒");
      if (this.counter >= 7) {
        //此时应该后边出错了，我们后退
        console.log("7s过后，我们回退");
        log.info("7s过后，我们回退");
        clearInterval(this.prepaytimer);
      }
    }, 1000);

    let resultPay = await this.$parent.globalData.post(
      `${api.server}/api/ec/pay/prepay`,
      this.payForm
    );
    clearInterval(this.prepaytimer);
    //文案： "数据已经准备完毕，马上唤起弹框微信支付"
    console.log("prepay准备好了，prepay是", resultPay);
    log.info("prepay准备好了，prepay是", resultPay);
    if (resultPay.state == "error") {
      wx.showModal({
        confirmColor: "#7ec792",
        content: resultPay.errorMsg,
        showCancel: false,
        success: async function () {
          wx.navigateBack({ delta: 1 });
        }
      });
      return;
    }
    if (resultPay.errcode == 0) {
      try {
        const payParam = resultPay.data.payData;
        // this.prepay_id = payParam.package.split("=")[1];
        console.log("现在唤起微信支付");
        log.info("现在唤起微信支付");
        wx.requestPayment({
          timeStamp: payParam.timeStamp,
          nonceStr: payParam.nonceStr,
          package: payParam.package,
          signType: payParam.signType,
          paySign: payParam.paySign,
          success: async function (errMsg) {
            try {
              wx.requestSubscribeMessage({
                tmplIds: ["4aI3wVd-4J-TcMdYPbLE1M2UXzr6UlcLE91pLauogHs"],
                success(res) {
                  console.log("res", res);
                  if (
                    res["4aI3wVd-4J-TcMdYPbLE1M2UXzr6UlcLE91pLauogHs"] ==
                    "accept"
                  ) {
                    console.log("允许发订阅消息");
                    that.submitMessage();
                  } else {
                    console.log("拒绝发订阅消息");
                  }
                }
              });
            } catch (ex) {
              wx.setStorageSync("oldCart", {});
              log.info("支付成功");
              wx.reLaunch({
                url:
                  `/pages/user/payresult?status=1&orderId=${that.payForm.orderid}&ordersn=${that.ordersn}`

              });
            }
            wx.setStorageSync("oldCart", {});
            log.info("支付成功");
            wx.redirectTo({
              url:
                `/pages/user/payresult?status=1&orderId=${that.payForm.orderid}&ordersn=${that.ordersn}`
            });
          },
          fail: function (errMsg) {
            log.info("支付失败", errMsg);
            wx.setStorageSync("oldCart", {});
            if (errMsg == "requestPayment:fail cancel")
              wx.navigateBack({ delta: 1 });
            else
              wx.redirectTo({
                url:
                  `/pages/user/payresult?status=0&orderId=${that.payForm.orderid}&ordersn=${that.ordersn}`
              });
          }
        });
      } catch (ex) {
        //此处可以加提示
        console.log("pay error");
        wx.navigateBack({ delta: 1 });
      }
    } else {
      wx.showModal({
        confirmColor: "#7ec792",
        content: "支付发生错误！",
        showCancel: false,
        success: function () {
          wx.navigateBack({ delta: 1 });
        }
      });
      return;
    }
  }
  async submitMessage() {
    let resultMessage = await this.$parent.globalData.post(
      `${api.server}/api/ec/notice/send`,
      {
        msg_type: "pay_success",
        orderid: this.payForm.orderid
        // prepay_id: this.prepay_id
      }
    );
  }
  methods = {};
}
</script>
<style>
.step_box {
  background: #fff;
  border-top: solid 1rpx #ededed;
  padding-bottom: 30rpx;
}
.step_box image {
  width: 593rpx;
  height: 39rpx;
  display: block;
  margin: 0 auto;
  padding-top: 40rpx;
}

.step_text text {
  width: 28%;
  display: inline-block;
  font-size: 24rpx;
  color: #acacac;
  text-align: center;
  margin-right: 60rpx;
  padding-top: 12rpx;
}
.step_text text:nth-child(3) {
  margin-right: 0;
}
.price_box {
  margin-top: 20rpx;
  background: #fff;
  height: 390rpx;
}
.price_box {
  text-align: center;
  padding-top: 90rpx;
}
.price_title {
  font-size: 30rpx;
  color: #353535;
  font-weight: bold;
}
.price_order {
  font-size: 56rpx;
  color: #ec3e29;
  line-height: 50rpx;
  padding-top: 30rpx;
  font-weight: bold;
}
.price_order text {
  font-size: 36rpx;
  font-weight: normal;
}
.price_time {
  font-size: 24rpx;
  color: #aeaeae;
  background: #f2f2f2;
  border-radius: 100rpx;
  width: 505rpx;
  height: 55rpx;
  line-height: 55rpx;
  text-align: center;
  margin: 30rpx auto;
}
.payBtn {
  position: fixed;
  bottom: 50rpx;
  width: 690rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  background: #ec3e29;
  border-radius: 100rpx;
  font-size: 28rpx;
  color: #fff;
  letter-spacing: 0.38rpx;
  margin-left: 30rpx;
}
</style>
