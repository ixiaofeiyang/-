<template>
  <view class="page">
    <view class="pay-result">
      <!--付款成功状态-->
      <view class="success-content"
            wx:if="{{successStatus}}">
        <image src="../../images/icon_succeed.png"
               class="payImg"></image>
        <text class="payStatus">恭喜您 订单支付成功</text>
        <!-- <view class="payBtn_box">
          <view class="goBuyBtn"
                bindtap="go2index">继续购物</view>
          <button class="takeOrderBtn"
                  open-type="share"
                  data-name="pageShare"
                  id="share">提醒团长接单</button>
        </view>
        <view class="payText">
          <image src="../../images/payTips_bg.png"></image>
          <view class="takeOrder">点击上面的
            <text class="red">“提醒团长接单”</text>按钮，将提醒信息发送到本店微信群,提醒团长及时处理您的订单。</view>
        
        </view> -->
        <view class="backBtn"
              bindtap="go2index">继续购物</view>
      
      </view>
      <!--付款失败状态-->
      <view class="error-content"
            wx:if="{{failStatus}}">
        <image src="../../images/icon_fail.png"
               class="payImg"></image>
        <text class="payStatus">很抱歉 订单支付失败</text>
        <view class="backBtn"
              bindtap="go2index">返回商城首页</view>
      </view>
    </view>
    <view class="explosive-content clearfloat"
          wx:if="{{explosiveList.length > 0}}">
      <view class="explosive_title">爆品推荐</view>
      <view class="explosiveList"
            wx:for="{{explosiveList}}"
            wx:key="index">
        <navigator url="{{'/pages/user/goods?id=' + item.id}}"
                   id="{{item.id}}">
          <image src="{{fileserver+item.cateImg}}"></image>
          <!--今日爆品标签-->
          <view class="tags_jrbp"
                wx:if="{{item.tagsFirst == '今日爆品'}}">
            <image src="../../images/tags_jrbp.png"></image>
          </view>
          <!--新品标签-->
          <block wx:if="{{item.tagsFirst == '新品'}}">
            <view class="tags_jrbp tags_xp">
              <image src="../../images/tags_xp.png"></image>
            </view>
          </block>
          <!--预售标签-->
          <block wx:if="{{item.tagsFirst == '预售'}}">
            <view class="tags_jrbp tags_ys">
              <image src="../../images/tags_ys.png"></image>
            </view>
          </block>
          <!--已抢光(限量）-->
          <view class="mark_img"
                wx:if="{{item.stock_status === 'empty'}}">
            <text>已抢光</text>
          </view>
          <block wx:else>
            <!--已结束（限时）-->
            <view class="mark_img"
                  wx:if="{{item.start_status === 2}}">
              <text>已结束</text>
            </view>
          </block>
          <!--未开售-->
          <block wx:if="{{item.start_status == 3}}">
            <view class="mark_bg">
              <text>{{item.full_start_time_str+'开售'}}</text>
            </view>
          </block>
          <view class="sku_info">
            <text class="sku_name">{{item.sku_name_show}}</text>
            <text class="sku_spec"
                  wx:if="{{item.sku_specification}}">{{item.sku_specification_show}}</text>
          </view>
          <view class="price_content">
            <view class="goods_price">
              <text class="font_small">¥</text>{{item.price/100}}
            </view>
            <text class="original_price">¥{{item.default_price/100}}</text>
          </view>

        </navigator>
        <block wx:if="{{item.start_status == 3}}">
          <view class="sku_addCart disbale_addCart"
                data-id="{{item.id}}">
            <image src="../../images/ico_carts.png"></image>
          </view>
        </block>

        <block wx:if="{{item.start_status == 1}}">
          <block wx:if="{{item.stock_status == 'empty'}}">
            <view class="sku_addCart disbale_addCart"
                  data-id="{{item.id}}">
              <image src="../../images/ico_carts.png"></image>
            </view>
          </block>
          <block wx:else>
            <view class="sku_addCart"
                  data-id="{{item.id}}"
                  catchtap="addToCart">
              <image src="../../images/ico_carts.png"></image>
            </view>
          </block>
        </block>
        <block wx:if="{{item.start_status == 2}}">
          <view class="sku_addCart disbale_addCart"
                data-id="{{item.id}}">
            <image src="../../images/ico_carts.png"></image>
          </view>
        </block>
      </view>
      <!--加载更多-->
      <view class="weui-loadmore weui-loadmore_line"
            wx:if="{{ noMoreData }}">
        <view class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多数据</view>
      </view>
    </view>
    <view class="offical_box">
      <official-account></official-account>
    </view>
       <!--用户信息授权-->
    <getuserinfo></getuserinfo>
  </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import moment from "moment";
import getuserinfo from "../../components/getuserinfo";
import ShopcartMixin from "../base/shopcart";
export default class Payresult extends auth {
  config = {
    enablePullDownRefresh: false
  };
  components = {
    getuserinfo: getuserinfo
  };
  mixins = [ShopcartMixin];
  data = {
    needUserinfo: false, // 是否显示授权
    failStatus: false, //付款失败状态
    successStatus: false, //付款成功状态
    orderId: 0, //订单Id
    userInfo: {}, //用户信息
    shopInfo: {}, //门店信息
    newGoodsList: [],
    explosiveList: [],
    ordersn:"",
    shareImg: "",
    cartDatas: null,
    noMoreData: false, // 没有更多数据
    fileserver: `${api.uploadimgFile}` //上传图片域名
  };
  async onLoad(options) {
    let result = await super.onLoad(options);
    this.orderId = options.orderId;
    this.ordersn = options.ordersn;

    if (options.status == 0) {
      this.failStatus = true;
    } else {
      this.successStatus = true;
      this.getShareImg()
    }

    this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};
    this.shopInfo =
      this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
    this.$apply();
    this.getExplosiveList();

  }
  async onShow() {
    // this.updateCart();
    this.cartDatas = wx.getStorageSync("oldCart");
  }

  //获取今日爆品分类
  async getExplosiveList() {
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/b2c/sku/listByTag?tags=explosive`
    );
    if (resultList.state !== "error") {
      if (resultList.rows.length > 0) {
        this.explosiveList = this.setGoodsItem(resultList.rows) || [];
        let arry = [];
        this.explosiveList.map((item, index) => {
          if (!!item.photos) {
            item["cateImg"] = item.photos.split(",")[0];
          }
          if (!!item.sku_specification) {
            try {
              let t = JSON.parse(item.sku_specification);
              item.sku_specification = t["规格"];
            } catch (ex) { }
            item.sku_specification_show =
              item.sku_specification.length > 10
                ? item.sku_specification.substring(0, 10) + "..."
                : item.sku_specification;
          }
          if (!!item.sku_name) {
            item.sku_name_show =
              item.sku_name.length > 22
                ? item.sku_name.substring(0, 22) + "..."
                : item.sku_name;
          }
          if (
            (item.start_status == 1 && item.stock_status == "full") ||
            item.start_status == 3
          ) {
            arry.push(item);
          }
        });
        this.explosiveList = arry;
      }
    }
    this.$apply();
  }
  setGoodsItem(goodsList) {
    let _now = this.getNow();
    goodsList.map(item => {
      // 设置商品唯一tags
      if (!!item.tags) {
        item.tagsFirst = "";
        let tagsArry = item.tags.split(",");
        if (tagsArry.length > 0) {
          for (let i in tagsArry) {
            if (
              tagsArry[i] == "今日爆品" ||
              tagsArry[i] == "新品" ||
              tagsArry[i] == "预售"
            ) {
              item.tagsFirst = tagsArry[i];
              break;
            }
          }
        }
      }

      if (item.is_time_limited) {
        let start_time = moment(item.start_time);
        //console.log(`${item.id} 是限时的`)    //1、进行中 2、已结束 3、还未开始
        if (moment(_now).isBefore(item.start_time)) item.start_status = 3;
        else if (
          moment(_now).isAfter(item.start_time) &&
          moment(_now).isBefore(item.end_time)
        ) {
          item.start_status = 1;
        } else {
          item.start_status = 2;
        }
        //=====start logic
        if (item.start_status == 1) {
          //进行中
          if (item.stock_available < 1) {
            item.stock_status = "empty";
          } else {
            item.stock_status = "full";
          }
        } else if (item.start_status == 3) {
          //未开始
          item.stock_status = "full";
        } else if (item.start_status == 2) {
          //已结束
          if (item.stock_available < 1) {
            item.stock_status = "empty";
          } else {
            item.stock_status = "full";
          }
        }
        //====end  logic
        item.start_time_str = start_time.format("YYYY-MM-DD"); //预售时间
        item.full_start_time_str = start_time.format("HH:mm"); //预售时间

        // item.end_time_str=item.expected_time;
        if (item.expected_time) {
          item.end_time_str = item.expected_time;
        } else {
          item.end_time_str = start_time.add(1, "days").format("YYYY-MM-DD"); //提货时间
        }
      } else {
        if (item.stock_available < 1) {
          item.stock_status = "empty";
        } else {
          item.stock_status = "full";
        }
        item.start_status = 1; //总是进行中
        item.start_time_str = moment(_now).format("YYYY-MM-DD"); //预售时间
        if (item.expected_time) {
          item.end_time_str = item.expected_time;
        } else {
          item.end_time_str = moment(_now)
            .add(1, "days")
            .format("YYYY-MM-DD"); //提货时间
        }
      }
    });
    return goodsList;
  }
  getNow() {
    return moment();
  }
  async addToCart(e) {
    wx.aldstat.sendEvent("支付结果页商品推荐点击加入购物车", {});
    let id = e.currentTarget.dataset.id;
    
    this.needUserinfo = this.$parent.globalData.needUserinfo;
    if (this.needUserinfo) {
      this.$broadcast("showUserInfo");
      return;
    }
    this.cartDatas = this.cartDatas || {};
    this.cartDatas[id] = this.cartDatas[id] || {
      amount: 0
    };
    this.cartDatas[id].amount++;
    wx.showToast({
      title: "加入购物车成功",
      icon: "none",
      duration: 1000
    });
    this.updateCart();
    this.$apply();
  }
  // 购物车数量
  updateCart() {
    this.cartAmount = this.getCartAmount();
    this.$apply();
  }
  //获取订单分享图片
  async getShareImg() {
    let result = await this.$parent.globalData.post(
      `${api.server}/api/ec/b2c/sku/generateImage`,
      {
        ordersn: this.ordersn,
        type: "order_detail_share"
      }
    );
    if (result.code === 0) {
      this.shareImg = result.url;
    }
    console.log(this.shareImg, "this  is shareImg result");
    this.$apply();
  }
  methods = {
    go2index() {
      wx.aldstat.sendEvent("支付结果页继续购物按钮点击", {});
      //明确删除购物车
      wx.reLaunch({ url: "/pages/user/index" });
    },
    onShareAppMessage() {
      wx.aldstat.sendEvent("支付结果页提醒团长接单按钮点击", {});
      let that = this;
      let shopInfoId = (!!that.shopInfo && that.shopInfo.id) || 0;
      return {
        title:
          "老板，我是" + that.userInfo.nickname + "刚在店里买的商品，请接单！",
        path: `/pages/user/orderdetail?ordersn=${
          that.ordersn
        }&shopid=${shopInfoId}`,
        imageUrl: that.shareImg || "../../images/shareImg2.jpg"
      };
    }
  };
}
</script>
<style>
page{
  background: #fff;
}
.pay-result {
  padding-bottom: 31rpx;
  background: #fff;
}
.payImg {
  width: 209rpx;
  height: 192rpx;
  margin: 0 auto;
  display: block;
  position: relative;
  top: 58rpx;
}
.success-content{
padding-top: 160rpx
}
.success-content .payStatus {
  font-size: 38rpx;
  color: #249aeb;
  font-weight: bold;
  text-align: center;
  position: relative;
  top: 78rpx;
  display: block;
}
.payBtn_box {
  margin-top: 130rpx;
  height: 95rpx;
}
.payBtn_box view,
.payBtn_box button {
  width: 345rpx;
  height: 80rpx;
  float: left;
  line-height: 80rpx;
  text-align: center;
  background: #fefefe;
  border: 3rpx solid #ec3e29;
  border-radius: 100rpx;
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #ec3e29;
  margin-left: 20rpx;
}
.payBtn_box .takeOrderBtn {
  background: #ec3e29;
  border: 0;
  color: #fefefe;
}
.payText {
  position: relative;
  width: 709rpx;
  height: 148rpx;
  margin: 0 auto;
}
.payText image {
  width: 709rpx;
  height: 148rpx;
  position: absolute;
  z-index: 1;
}
.payText .takeOrder {
  font-size: 24rpx;
  color: #4e4e4e;
  line-height: 39rpx;
  margin-top: 50rpx;
  margin-bottom: 30rpx;
  position: absolute;
  z-index: 2;
  padding: 0 61rpx;
}
.payText .takeSafety {
  font-size: 24rpx;
  color: #9d9da0;
  line-height: 39rpx;
}
.payText .takeOrder .red {
  color: #ec3e29;
}
.error-content {
  position: relative;
  height: 535rpx;
  top: 160rpx
}
.error-content .payImg {
  width: 207rpx;
  height: 197rpx;
}
.error-content .payStatus {
  font-size: 38rpx;
  color: #ec3e29;
  font-weight: bold;
  text-align: center;
  position: relative;
  top: 100rpx;
  display: block;
}
.backBtn {
  position: relative;
  left: 20rpx;
  background: linear-gradient(to bottom, #fb6890, #fb777d);
  border-radius: 100rpx;
  font-size: 28rpx;
  color: #ffffff;
  width: 710rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  top: 150rpx;
}
.explosive-content {
  background: #f2f2f2;
  margin-top: 20rpx;
  padding-bottom: 200rpx;
}

.explosive_title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #4e4e4e;
}
.explosiveList {
  width: 345rpx;
  height: 495rpx;
  background: #fff;
  margin-left: 20rpx;
  margin-top: 20rpx;
  position: relative;
  border-radius: 14rpx;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  float: left;
}

.explosiveList image {
  width: 345rpx;
  height: 299rpx;
  border-radius: 14rpx 14rpx 0 0;
}
.explosiveList .sku_info {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-left: 20rpx;
  padding-right: 20rpx;
}

.explosiveList text {
  color: #2f2f30;
  font-size: 26rpx;
}
.explosiveList .sku_info .sku_name {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  display: block;
  line-height: 32rpx;
  text-overflow: -o-ellipsis-lastline;
}
.explosiveList .sku_spec {
  background: #f2f2f2;
  font-size: 22rpx;
  padding: 5rpx;
  border-radius: 8rpx;
  color: #9b9b9b;
  position: relative;
  top: -3rpx;
}
.explosiveList .price_content {
  position: absolute;
  left: 20rpx;
  bottom: 10rpx;
}
.explosiveList .goods_price {
  font-size: 42rpx;
  color: #ec3e29;
  display: inline-block;
  font-weight: bold;
}
.explosiveList .font_small {
  font-size: 30rpx;
  color: #ec3e29;
}
.explosiveList .original_price {
  font-size: 26rpx;
  color: #919194;
  text-decoration: line-through;
  display: inline-block;
  margin-left: 18rpx;
}
.explosiveList .sku_addCart {
  width: 64rpx;
  height: 64rpx;
  border-radius: 100rpx;
  background: #ec3e29;
  position: absolute;
  right: 20rpx;
  bottom: 22rpx;
}
.explosiveList .disbale_addCart {
  background: #9c9c9c;
}
.explosiveList .sku_addCart image {
  width: 36rpx;
  height: 34rpx;
  display: block;
  margin: 16rpx auto;
  border-radius: 0;
}
.explosiveList .mark_img {
  position: absolute;
  width: 345rpx;
  height: 299rpx;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 14rpx 14rpx 0 0;
}
.explosiveList .mark_bg {
  position: absolute;
  width: 345rpx;
  height: 42rpx;
  top: 257rpx;
  left: 0;
  background: rgba(247, 157, 54, 0.9);
}
.explosiveList .mark_bg text {
  color: #fff;
  font-size: 25rpx;
  display: block;
  text-align: center;
  line-height: 45rpx;
}
.explosiveList .mark_img text {
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  display: block;
  line-height: 325rpx;
}
.explosiveList .tags_jrbp image {
  width: 100rpx;
  height: 70rpx;
  position: absolute;
  left: 14rpx;
  top: 13rpx;
  overflow: hidden;
  background: none;
}

.explosiveList .tags_ys image,
.explosiveList .tags_xp image {
  width: 100rpx;
  height: 42rpx;
}
.navigator-hover {
  background: none;
}
.offical_box {
  width: 100%;
  position: fixed;
  bottom: 0;
}
</style>
