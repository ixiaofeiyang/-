<template>
  <view class="page">
    <view class="page__bd">
      <view>
        <view class="tips"
              wx:if="{{showTimeStatus}}">
          <wux-notice-bar loop
                          wux-class="notice-bar"
                          icon="http://hjl2c.dawangtv.cn/wxa_images/icon_hint.gif">
            {{SysNoticeInfo.content}}
          </wux-notice-bar>
        </view>
        <view>
          <view class="goods_swiper ">
            <!--swiper-->
            <swiper class="goods-gallery"
                    indicator-dots="true"
                    interval="3000"
                    duration="1000"
                    autoplay="true">
              <swiper-item wx:for="{{photos}}"
                           wx:key="item"
                           wx:if="{{goodsInfo.photos.length>0}}">
                <image src="{{fileserver+item}}"
                       background-size="cover"
                       bindtap='previewImag'
                       mode='aspectFill'
                       data-url='{{fileserver+item}}'></image>
              </swiper-item>
            </swiper>
          </view>
          <!--价格-->
          <skeleton slector="skeleton"
                    bgcolor="none"
                    loading="spin"
                    wx:if="{{showSkeleton}}"></skeleton>
          <view class="skeleton">
            <view class="goods_tab ">
              <!-- <image src="../../images/goods_tab.png"></image> -->
              <view class="goods_price"
                    wx:if="{{!showSkeleton}}">
                <text class="font_small">¥</text>
                <text>{{goodsInfo.price/100}}</text>
              </view>
              <view class="goods_price goods_price1 skeleton-rect"
                    wx:if="{{showSkeleton}}">
                <text></text>
              </view>
              <view class="original_price "
                    wx:if="{{!showSkeleton}}">
                <text>¥</text>
                <text>{{goodsInfo.default_price/100}}</text>
              </view>
              <view class="original_price original_price1 skeleton-rect"
                    wx:if="{{showSkeleton}}">
                <text></text>
              </view>
              <!--倒计时-->
              <block wx:if="{{!TimeBegin}}">
                <view class="goods_time"
                      wx:if="{{goodsTime}}">
                  <text>{{downTimeText}}</text>
                  <view class="count_down">{{countdown}}</view>
                </view>
              </block>
              <view class="goods_time skeleton-rect"
                    wx:if="{{showSkeleton}}">
                <text class="skeleton-rect">距离商品开售还剩</text>
                <view class="count_down skeleton-radius">{{countdown}}</view>
              </view>
              <!--开售时间-->
              <view class="goods_time time_begin"
                    wx:if="{{TimeBegin}}">
                <text>{{downTimeText}}</text>
                <view class="times">
                  <text>{{goodsInfo.full_start_time_str}}</text>
                </view>
              </view>
            </view>

            <!--商品信息-->
            <view class="goods_box">
              <view class="goods_title "
                    wx:if="{{!showSkeleton}}">
                <text class="goods_name">{{goodsInfo.sku_name}}</text>
              </view>
              <view class="goods_title skeleton_name"
                    wx:if="{{showSkeleton}}">
                <text class="goods_name skeleton-rect ">商品名称</text>
              </view>
              <view class="goods_content">
                <!-- <view class="goods_time">
                  <text class="skeleton-rect">预售时间：{{goodsInfo.start_time_str}}</text>
                  <text class="skeleton-rect">提货时间：{{goodsInfo.end_time_str}}</text>
                </view> -->
                <!-- <view class="goods_num "
                      wx:if="{{showSkeleton}}">
                  <view class="data_num skeleton-rect">已售已售数量</view>
                  <view class="data_num skeleton-rect">累计销量份的分量</view>
                </view> -->
                <!-- <view class="goods_num"
                      wx:if="{{!showSkeleton}}">
                  <block wx:if="{{goodsInfo.user_purchase_limit<=0}}">
                    <block wx:if="{{goodsInfo.is_quantity_limited}}">
                      <view class="goods_number">已售
                        <text>{{goodsInfo.sold_quantity_today}}</text> 份 / 限量 {{goodsInfo.quantity_limit}} 份 </view>
                    </block>
                    <block wx:else>
                      <view class="goods_number">已售
                        <text>{{goodsInfo.sold_quantity_today}}</text> 份 </view>
                    </block>
                  </block>
                  <block wx:else>
                    <view class="goods_number skeleton-rect">限购
                      <text> {{goodsInfo.user_purchase_limit}}</text>份 / 已售
                      <text>{{goodsInfo.sold_quantity_today}}</text> 份
                    </view>
                  </block>
                  <text class="total_num">累计销量 {{goodsInfo.sold_quantity}} 份</text>
                </view> -->
              </view>
            </view>
          </view>
        </view>
      </view>
      <!--品牌故事-->
      <!-- <view class="brand_story">
	                <view class="brand_title">
	                    <text>品牌故事</text>
	                </view>
	                <image src="../../images/goods_brand.jpg"></image>
	                <text class="story_info">哈密瓜主产于吐哈盆地，它形态各异，风味独特，瓜肉肥厚，清脆爽口。哈密瓜营养丰富，含糖量最高达21%。哈密…</text>
	                <view class="story_btn">
	                    <text>查看品牌故事</text>
	                    <image src="../../images/icon-down.png"></image>
	                </view>
	            </view> -->
      <!--商品详情-->
      <view class="goods_info">
        <view class="goods_desc">
          <view class="brand_title">
            <text>商品详情</text>
          </view>
          <rich-text bindtap="previewDetailImag"  nodes="{{goodsInfo.description}}" />
        </view>
      </view>
      <!--价格说明-->
      <view class="buy_guide price_hint">
        <view class="guide_title">价格说明</view>
        <image src="../../images/icon_down_red.png"
               class="icon_down"></image>
        <view class="guide_info">
          <view class="guide_text">
            <view class="ico_bg">
              <text class="font_blod">划线价格:</text>
              <text>指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，井非原价，仅供参考。</text>
            </view>
            <view class="mt10 ico_bg">
              <text class="font_blod">未划线价格:</text>
              <text>指商品的实时标价，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化，最终以订单结算页价格为准。</text>
            </view>
            <view class="ico_bg">
              <text>商家详情页(含主图)以图片或文字形式标注的一口价、促销价、优惠价等价格可能是在使用优惠券、满减或特定优惠活动和时段等情形下的价格，具体请以结算页面的标价、优惠条件或活动规则为准。
              </text>
            </view>
            <view class="ico_bg">
              <text>此说明仅当出现价格比较时有效，若商家单独对划线价格进行说明，以商家的表述为准。</text>
            </view>
          </view>
        </view>
      </view>
      <view class="bottomBox {{isFullSucreen?'recommend_con_type':''}}">
      <!--购物指南-->
      <!-- <view class="buy_guide ">
        <view class="guide_title">购物指南</view>
        <image src="../../images/icon_down_red.png"
               class="icon_down"></image>
        <view class="guide_info">
          <image src="../../images/guide_img.jpg"></image>
          <view class="guide_text">
            <text class="font_blod">1.消费者下单</text>
            <text>每天商品下单时间：00:00~22:00</text>
            <view class="mt10">
              <text class="font_blod">2.物流配送</text>
              <text>每天16:00之前，物流配送将消费者昨日下单的商品，配送到相应下单的自提点</text>
            </view>
            <text class="font_blod">3.消费者自提</text>
            <text>每天16:00以后（具体根据门店不同，到货时间不同，以团长通知为准）消费者可以到相应的自提点提货</text>
          </view>
        </view>
      </view> -->
      <!--推荐商品-->
      <view class="explosive-content"
            wx:if="{{recommendList.length > 0}}">
        <view class="recommend_title">
          <text>为您推荐</text>
        </view>
        <view class="recommend_con ">
          <view class="explosiveList"
                wx:for="{{recommendList}}"
                wx:key="index">
            <navigator url="{{'/pages/user/goods?id=' + item.id}}"
                       id="{{item.id}}">
              <image src="{{fileserver+item.recommendImg}}"></image>
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
      </view>
      </view>
      <view class="statusText"
            wx:if="{{statusShow}}">{{statusText}}</view>
      <!--底部按钮-->
      <view class="bottom_box {{isFullSucreen?'fix-Full-button':''}}">
        <view class="icon_box">
          <view class="icon"
                bindtap="goToCart">
            <image src="../../images/icon_cart.png"></image>
            <text>购物车</text>
            <text wx:if="{{cartAmount>0}}"
                  class="tags">{{cartAmount}}</text>
          </view>
          <view class="icon">
            <button class="ico_bt_btn"
                    bindtap="downLoad">
              <image src="../../images/icon_share.jpg"></image>
              <text>分享</text>
            </button>
          </view>
        </view>
        <view class="btn_box btn_disabled"
              wx:if="{{!isenabled}}">
          <text class="addBtn">加入购物车</text>
          <text class="gobuyBtn">立即购买</text>
        </view>
        <view class="btn_box"
              wx:if="{{isenabled}}">
          <text class="addBtn"
                bindtap="addToCart">加入购物车</text>
          <text class="gobuyBtn"
                bindtap="goToBuy">立即购买</text>
        </view>
      </view>

      <view class="mark"
            wx:if="{{isShowModal}}"></view>
      <!--分享弹层-->
      <view class="shareModal"
            wx:if="{{isShowModal}}">
        <button class="ico_bt_btn"
                open-type="share"
                data-name="pageShare"
                id="share">
          <view class="share_icon">
            <image src="../../images/wx_iocn.png"></image>
            <text>微信好友</text>
          </view>
        </button>
        <view class="mask_disbale"
              wx:if="{{modelStatus}}"></view>
        <view class="share_icon"
              bindtap="saveImageToPhotos">
          <image src="../../images/pic_icon.png"></image>
          <text>保存图片</text>
        </view>
        <view class="cancel_btn"
              bindtap="hideModal">取消</view>
      </view>

    </view>
    <!-- <button class="ico_bt_btn" open-type="share" data-name="pageShare" id="share">
	            <image class="backTop" bindtap="goTop" src="../../images/share_btn.png"></image>
	        </button> -->
    <!-- <view class="backTop">
      <button class="ico_bt_btn"
              bindtap="downLoad">
        <view class="share_box">
          <image src="../../images/share_top.png"></image>
          <text>分享</text>
        </view>
      </button>
      <view class="home_box"
            wx:if="{{isShare}}"
            bindtap="goToIndex">
        <image src="../../images/icon_home.png"
               class="icon-home"></image>
        <text>首页</text>
      </view>
    </view>
    <view class="sharePoster"
          wx:if="{{sharePoster}}">
      <image src="{{sharePic}}"></image>
    </view> -->
    <!--活动入口-->
    <view class="activity_enter"
          bindtap="go2activity"
          wx:if="{{isShowActivity}}">
      <image src="../../images/activity2_img/enter_btn.gif"></image>
    </view>
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
                tip="生成中..." />
    </view>
    <!--用户信息授权-->
    <getuserinfo></getuserinfo>
    <!--提示框-->
    <confirm :confirmData.sync="confirmData"
             v-on:changeShop="changeShop"></confirm>

  </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import log from "../../util/log";
import getuserinfo from "../../components/getuserinfo";
import moment from "moment";
import confirm from "../../components/confirm";
// import Check23clockMixin from "../base/check23clock";
import ShopcartMixin from "../base/shopcart";

export default class Index extends auth {
  config = {
    navigationBarTitleText: "商品详情",
    navigationBarTextStyle: "black",
    navigationBarBackgroundColor: "#ffffff",
    backgroundColor: "#ffffff",
    usingComponents: {
      skeleton: "../../plugin/wux/skeleton/skeleton",
      "wux-notice-bar": "../../plugin/wux/notice-bar/index",
      "wux-spin": "../../plugin/wux/spin/index"
    }
  };
  mixins = [ShopcartMixin];
  components = {
    getuserinfo: getuserinfo,
    confirm: confirm
  };
  data = {
    fileserver: `${api.uploadimgFile}`, //上传图片域名
    goodsTime: false,
    statusShow: false,
    isenabled: true,
    needUserinfo: false, // 是否显示授权
    id: null, //商品ID
    goodsInfo: {}, //商品信息数据
    amount: 1, //商品数量
    cartAmount: 0,
    cartDatas: null,
    countdown: "", //倒计时
    downTimeText: "", //倒计时显示文案
    isShopkeeper: false, //身份判断标识
    photos: {}, //商品swiper数据
    shopInfo: null, //门店信息数据
    newShopInfo: {}, //新的门店自提点数据
    targetdifftime: null,
    _now: null,
    isFullSucreen: false, //全面屏手机判断标识
    interval1: null,
    lastcartupdatetime: null,
    iscartupdated: null,
    isShare: false,
    sharePoster: false, //海报默认值
    sharePic: "", //分享图片
    headimg: "", //头像
    isShowModal: false, //分享模态
    skuimg: "", //缓存到本地的商品图
    modelStatus: false,
    shareImg: "",
    submitStatus: false,
    showSkeleton: true,
    statusText: "",
    TimeBegin: false,
    showTimeStatus: false,
    isShowActivity: false,
    confirmData: {}, //弹框数据
    //分享海报数据
    formDataPoster: {
      type: "sku_poster",
      skuid: null,
      appid: "wx355bbf95fc53877a",
      shopid: null,
      activity_time: "00 : 00 : 00",
      activity_title: ""
    },
    //微信好友分享的商品图数据
    // formDataShare: {
    //   type: "sku_cover",
    //   skuid: null
    // },
    recommendList: [],
    goodsList: [], //商品列表数据
    isShowLoading: false,
    mask: false,
    descriptionArr:[],
    SysNoticeInfo:{},
  };

  async onLoad(options) {
    let result = await super.onLoad(options);
    this.needUserinfo = this.$parent.globalData.needUserinfo;
    console.log("this.need login is ", this.needUserinfo);
    // this.shopInfo =
    //   this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
    if (this.needUserinfo) {
      //this.$broadcast("showUserInfo");
    }
    this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};

    // await this.getMyShopInfo();
    // 点邀请进来的
    if (options.shareuid) {
      wx.setStorageSync("shareuid", options.shareuid);
    }
    this.id = options.id;
    // this.shopid = options.shopid;
    let oscenekv = decodeURIComponent(options.scene).split("&");

    for (let item of oscenekv) {
      let [k, v] = item.split("=");
      // if (k == "shopid") {
      //   this.shopid = options.shopid || v;
      // }
      if (k == "id") {
        this.id = options.id || v;
      }
    }

    // if (this.shopid == "0" || this.shopid) {
    //   this.isShare = true;
    // }

    // this.shopid = this.shopid == 0 ? null : this.shopid;
    // if (this.shopid) {
    //   console.log("进入到订单详情页，shopid是", this.shopid);
    //   this.getShopInfo(this.shopid);
    // }
    // if (wx.getStorageSync("user:detail").id != -1) {
    //   if (wx.getStorageSync("shopid")) {
    //     await this.setShopInfo(wx.getStorageSync("shopid"));
    //     wx.removeStorageSync("shopid");
    //   }
    // }
    this.getSysNotice();
    await this.getGoodsInfo();
    if (this.goodsInfo.id) {
      this.showSkeleton = false;
    }
    await this.getRecommendList();
    this.checkFullSucreen();
    this.$apply();
  }
  async onShow() {
    console.log("into goods onshow function");
    // this.shopInfo =
    //   this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
    this.cartDatas = wx.getStorageSync("oldCart");
    this.updateCart();
    this.$apply();
  }

  // 设置门店
  // async setShopInfo(shopid) {
  //   let id = shopid ? shopid : this.shopInfo.id;
  //   let myShopInfo = await this.$parent.globalData.post(
  //     `${api.server}/api/ec/user/setMyAddress`,
  //     { address: id }
  //   );
  //   wx.setStorageSync("shopInfo", this.shopInfo);
  //   this.$apply();
  // }
  // 获取我选择的门店
  // async getMyShopInfo() {
  //   let myShopInfo = await this.$parent.globalData.get(
  //     `${api.server}/api/ec/user/getMyAddress`
  //   );
  //   if (myShopInfo.state == "error") {
  //     // this.shopInfo = null;
  //   } else {
  //     this.shopInfo = this.$parent.globalData.shopInfo = myShopInfo;
  //   }
  //   this.$apply();
  // }

  async onPullDownRefresh() {
    this.getSysNotice();
    await this.getGoodsInfo();
    wx.stopPullDownRefresh();
  }

  //check手机型号
  checkFullSucreen() {
    let that = this;
    if (this.$parent.globalData.isFullSucreen != null) {
      that.isFullSucreen = true;
    } else {
      wx.getSystemInfo({
        success: function (res) {
          console.log(res, "this is res"); // 根据 屏幕高度 进行判断
          if (res.model.search("iPhone X") != -1) {
            that.isFullSucreen = true;
            that.$parent.globalData.isFullSucreen = true;
          }
        }
      });
    }
  }
  //获取门店信息
  // async getShopInfo(shopid) {
  //   // this.shopInfo =
  //   //   this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
  //   if (!!this.shopInfo && this.shopInfo.id == shopid) return;

  //   let resultShopInfo = await this.$parent.globalData.get(
  //     `${api.server}/api/ec/b2c/shop/info?id=${shopid}`
  //   );
  //   if (resultShopInfo.state !== "error") {
  //     // 验证切换自提点
  //     this.newShopInfo = resultShopInfo;
  //     console.log(this.shopInfo, "this.shopInfo");
  //     if (!this.shopInfo) {
  //       this.shopInfo = this.$parent.globalData.shopInfo = this.newShopInfo;
  //       this.setShopInfo();
  //       if (wx.getStorageSync("user:detail").id == -1 && this.shopid != 0) {
  //         wx.setStorageSync("shopid", this.shopid);
  //       }
  //       wx.setStorageSync("shopInfo", this.newShopInfo);
  //       this.$apply();
  //       return;
  //     }
  //     // 和已有的自提点不一致需要选择是否切换
  //     this.confirmData.shopInfo = this.shopInfo;
  //     this.confirmData.newShopInfo = this.newShopInfo;
  //     this.confirmData.title = "确认自提点";
  //     this.$apply();
  //     this.$broadcast("isChangeShop");
  //   }
  //   this._now = new Date();
  // }
  //获取商品信息
  countDown1() {
    let a = new Date().getTime();
    let b = moment(this.targetdifftime)
      .toDate()
      .getTime();
    //console.log(moment(this.targetdifftime).format('hh:mm:ss'));

    let timediff = Math.round((b - a) / 1000);
    if (!timediff) {
      this.countdown = "";
      return;
    }
    //console.log(timediff)
    if (timediff < 0) {
      if (this.goodsInfo.start_status == 3) {
        this.isenabled = true;
        this.statusShow = false;
      }
      this.countdown = "00 : 00 : 00";
      this.$apply();
      return;
    }
    let day = parseInt(timediff / 3600 / 24);
    let hour = parseInt((timediff / 3600) % 24) + day * 24;
    hour = hour < 10 ? "0" + hour : hour;
    let minute = parseInt((timediff / 60) % 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = timediff % 60;
    second = second < 10 ? "0" + second : second;
    this.countdown = hour + " : " + minute + " : " + second;
    this.$apply();
  }
  async getGoodsInfo() {
    let item = await this.$parent.globalData.get(
      `${api.server}/api/ec/b2c/sku/info?id=${this.id}`
    );
    if (item.state == "error") return;
    // this.onShareImg();
    if (!item.status) {
      this.isenabled = false;
      this.statusShow = true;
      this.goodsTime = true;
      this.statusText = "该商品已下架";
    }
    if (!!item.photos) {
      this.photos = item.photos.split(",");
    }

    // let htmlstr = '<p><img src="http://hjlfile.dawangtv.cn/2019/18677/oMRAP-D-n5nH0xCWIuY3Qva_.jpg" alt="详情.jpg" /><img src="https://pics5.baidu.com/feed/ae51f3deb48f8c54a5bc44b8bdad0af3e1fe7f40.jpeg?token=a60e1e31586d10aee4b2bd4789870687&s=AA32448442A31B0520A13096030050B2s" alt="详情.jpg" /></p>'
    // var re = /<img(.+?)src=""*([^\s]+?)""*(\s|>)/ig;
    // var a = htmlstr.match(re);
    // for (var i=0;i<a.length ;i++ )
    // {
    //   this.descriptionArr.push(a[i].replace(re,"$2"))
    // }

    item.description = !!item.description
      ? item.description
        .replace(/style=\"\"/g, "")
        .replace(
          /\<img/gi,
          '<img style="width:100%;height:auto; display:block" '
        )
      : "";
    let _now = new Date();
    clearInterval(this.timer);
    if (item.is_time_limited) {
      let start_time = moment(item.start_time);
      console.log(`${item.id} 是限时的`); //1、进行中 2、已结束 3、还未开始
      if (moment(_now).isBefore(item.start_time)) {
        item.start_status = 3;
        this.isenabled = false;
        this.statusShow = true;
        this.goodsTime = false;
        this.TimeBegin = true;
        this.statusText = "该商品未开售";
        // this.downTimeText = "距商品开售还剩";
        this.downTimeText = "开售时间";
        this.targetdifftime = item.start_time;
        this.timer = setInterval(() => {
          this.countDown1();
        }, 1000);
      } else if (
        moment(_now).isAfter(item.start_time) &&
        moment(_now).isBefore(item.end_time)
      ) {
        item.start_status = 1;
        this.statusShow = false;
        this.goodsTime = true;
        this.TimeBegin = false;
        this.downTimeText = "距商品结束还剩";
        if (
          moment(item.end_time).isAfter(
            moment({
              hour: 22
            })
          )
        )
          this.targetdifftime = moment({
            hour: 22
          });
        else {
          //item.end_time   //应该是23点
          this.targetdifftime = moment(item.end_time);
        }
        this.timer = setInterval(() => {
          this.countDown1();
        }, 1000);
      } else {
        item.start_status = 2;
        this.statusShow = true;
        this.isenabled = false;
        this.goodsTime = true;
        this.downTimeText = "距商品结束还剩";
        this.countdown = "00 : 00 : 00";
        this.statusText = "该商品已结束";
      }
      console.log("start_status is ", item.start_status);
      item.start_time_str = start_time.format("YYYY-MM-DD"); //预售时间
      item.full_start_time_str = start_time.format("HH:mm"); //预售时间

      //   item.end_time_str = start_time.add(1, "days").format("YYYY-MM-DD"); //提货时间
      if (item.expected_time) {
        item.end_time_str = item.expected_time;
      } else {
        item.end_time_str = start_time.add(1, "days").format("YYYY-MM-DD"); //提货时间
      }
      if (item.stock_available < 1) {
        this.isenabled = false;
        this.statusShow = true;
        this.goodsTime = true;
        this.statusText = "该商品已抢光";
      }
      this.goodsInfo = item;
      this.$apply();
      return;
    }
    if (item.is_quantity_limited) {
      //return;
    }
    console.log(`${item.id} 不限时的`);
    item.start_status = 1;
    this.downTimeText = "距商品结束还剩";
    this.goodsTime = true;
    this.targetdifftime = moment({
      hour: 22
    }); //item.end_time
    this.timer = setInterval(() => {
      this.countDown1();
    }, 1000);
    item.start_time_str = moment(_now).format("YYYY-MM-DD"); //预售时间
    if (item.expected_time) {
      item.end_time_str = item.expected_time;
    } else {
      item.end_time_str = moment(_now)
        .add(1, "days")
        .format("YYYY-MM-DD"); //提货时间
    }
    // 库存不足
    if (item.stock_available < 1) {
      this.isenabled = false;
      this.statusShow = true;
      this.goodsTime = true;
      this.statusText = "该商品已抢光";
    }
    //this.getCurrentTime(this.goodsInfo.start_time, this.goodsInfo.end_time);
    console.log("in the end the goods Info is ", item);
    this.goodsInfo = item;
    this.$apply();
  }
  //获取推荐列表
  async getRecommendList() {
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/sku/recommendation/list?skuid=${this.id}`
    );
    if (resultList.state !== "error") {
      this.recommendList = resultList;
      this.recommendList = this.setGoodsItem(this.recommendList);
    }
    let arry = [];
    this.recommendList.map(item => {
      if (
        (item.start_status == 1 && item.stock_status == "full") ||
        item.start_status == 3
      ) {
        arry.push(item);
      }
    });
    this.recommendList = arry;
    this.$apply();
  }
  setGoodsItem(goodsList) {
    let _now = _now;
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
      if (!!item.photos) {
        item["recommendImg"] = item.photos.split(",")[0];
      }
      try {
        let t = JSON.parse(item.sku_specification);
        item.sku_specification = t["规格"];
      } catch (ex) { }
      if (!!item.sku_specification) {
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
  /**
   * 加入购物车
   * */
  async addToCart(e) {
    wx.aldstat.sendEvent("商品详情页加入购物车点击", {});
    let goodsid = e.currentTarget.dataset.id || this.goodsInfo.id;
    this.needUserinfo = this.$parent.globalData.needUserinfo;
    if (this.needUserinfo) {
      this.$broadcast("showUserInfo");
      return;
    }
    this.cartDatas = this.cartDatas || {};
    this.cartDatas[goodsid] = this.cartDatas[goodsid] || {
      amount: 0
    };
    this.cartDatas[goodsid].amount++;
    wx.showToast({
      title: "加入购物车成功",
      icon: "none",
      duration: 1000
    });
    this.updateCart();
    this.$apply();
  }

  //立即购买
  goToBuy() {
    wx.aldstat.sendEvent("商品详情页立即购物按钮点击", {});
    this.needUserinfo = this.$parent.globalData.needUserinfo;
    if (this.needUserinfo) {
      this.$broadcast("showUserInfo");
      return;
    }
    wx.navigateTo({
      url: `/pages/user/checkout?id=${this.id}&skuids=${
        this.goodsInfo.id
        }&order_source=2`
    });
  }
  // 购物车数量
  updateCart() {
    this.cartAmount = this.getCartAmount();
    console.log(this.cartAmount);
    this.$apply();
  }
  //获取保存图片(海报)
  async downLoad() {
    wx.aldstat.sendEvent("商品详情页商品分享点击", {});
    let that = this;
    that.isShowModal = true;
    try {
      // wx.showLoading({
      //   title: "生成中"
      // });
      that.isShowLoading = true;
      that.mask = true;
      that.$apply();
      // let shopid = that.shopInfo ? that.shopInfo.id : 0;
      // shopid = that.shopid ? that.shopid : shopid;
      that.modelStatus = true;
      that.formDataPoster.skuid = that.id;
      // that.formDataPoster.shopid = shopid;
      that.formDataPoster.activity_time = that.countdown
        ? that.countdown
        : that.formDataPoster.activity_time;
      that.formDataPoster.activity_title = that.downTimeText;
      let result = await this.$parent.globalData.post(
        `${api.server}/api/ec/b2c/sku/generateImage`,
        that.formDataPoster
      );
      log.info("这是获取保存图片海报的 result", result);
      if (result.code == 0) {
        that.downLoadImg(result.url);
      } else {
        // wx.hideLoading();
        that.isShowLoading = false;
        that.mask = false;
        that.$apply();
        console.log("出错了，稍后在试");
      }
    } catch (e) {
      // wx.hideLoading();
      that.isShowLoading = false;
      that.mask = false;
      that.isShowModal = false;
      that.sharePoster = false;
      that.$apply();
    }
    that.$apply();
  }
  //把海报下载到本地
  downLoadImg(url) {
    let that = this;
    wx.downloadFile({
      url: url, //网络路径

      success: function (res) {
        that.sharePic = res.tempFilePath;
        that.skuimg = res.tempFilePath;
        that.sharePoster = true;
        that.modelStatus = false;
        that.$apply();
      },
      fail: function (res) {
        console.log("into goods.vue 海报下载失败", res);
        log.info("into goods.vue 海报下载失败" + JSON.stringify(res));
        wx.showModal({
          title: "下载失败",
          content: "请稍后再试"
        });
        that.sharePoster = false;
      },
      complete: function (res) {
        // wx.hideLoading();
        that.isShowLoading = false;
        that.mask = false;
        that.$apply();
      }
    });
  }
  //保存海报图片
  saveImage() {
    if (!this.sharePoster) return;
    if (this.submitStatus) {
      return false;
    } else {
      this.submitStatus = true;
    }
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.skuimg,
      success: res => {
        that.submitStatus = false;
        console.log(res);
        this.showToast("保存成功");
      },
      fail: err => {
        that.submitStatus = false;
        console.log(err);
        this.showToast("保存失败，请稍后重试");
      }
    });
  }
  // 微信提示方法
  showToast(title) {
    wx.showToast({
      title: title,
      icon: "none"
    });
  }
  //获取微信分享好友商品图片
  //   async onShareImg() {
  //     this.formDataShare.skuid = this.id;
  //     let result = await this.$parent.globalData.post(
  //       `${api.server}/api/ec/b2c/sku/generateImage`,
  //       this.formDataShare
  //     );
  //     if (result.code === 0) {
  //       this.shareImg = result.url;
  //     }
  //     console.log(this.shareImg, "this  is shareImg result");
  //     log.info("这是获取微信分享好友的商品图片的result", result);
  //     this.$apply();
  //   }
  
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

  methods = {
    // 轮播图片放大
    previewImag(e) {
      let that = this
      let current = e.target.dataset.url //获取当前点击的 图片 url
      let bigPhotos = that.goodsInfo.photos.split(",")

      if (bigPhotos.length > 0 ) {
        for( let i in bigPhotos) {
          bigPhotos[i] = that.fileserver + bigPhotos[i]
        }
        wx.previewImage({
          current,
          urls: bigPhotos
        })
      }
    },
    // 商品详情图片放大
    previewDetailImag(e) {
      console.log('previewDetailImag', this.descriptionArr)
      // let that = this
      // let current = e.target.dataset.url //获取当前点击的 图片 url
      // let bigPhotos = that.goodsInfo.photos.split(",")

      // if (bigPhotos.length > 0 ) {
      //   for( let i in bigPhotos) {
      //     bigPhotos[i] = that.fileserver + bigPhotos[i]
      //   }
      //   wx.previewImage({
      //     current,
      //     urls: bigPhotos
      //   })
      // }
    },
    // changeShop(e) {
    //   util.setChangeShop(e, this.confirmData);
    //   this.shopInfo = e
    //     ? this.confirmData.newShopInfo
    //     : this.confirmData.shopInfo;
    //   this.$parent.globalData.shopInfo = this.shopInfo;
    //   this.shopid = this.shopInfo.id;
    //   wx.setStorageSync("shopInfo", this.shopInfo);
    //   if (wx.getStorageSync("user:detail").id == -1 && this.shopid != 0) {
    //     wx.setStorageSync("shopid", this.shopid);
    //   }
    //   this.setShopInfo();
    //   this.$apply();
    // },
    goToCart() {
      this.forceSaveCart();
      wx.switchTab({ url: "/pages/user/cart" });
    },
    goToIndex() {
      wx.aldstat.sendEvent("商品详情页返回首页按钮点击", {});
      this.forceSaveCart();
      wx.switchTab({ url: "/pages/user/index" });
    },
    go2activity() {
      wx.navigateTo({
        url: "/pages/user/activity"
      });
    },
    hideModal() {
      if (this.modelStatus) return;
      this.isShowModal = false;
      this.sharePoster = false;
      this.$apply();
    },
    go2goods(e) {
      let id = e.currentTarget.id;
      wx.navigateTo({
        url: `/pages/user/goods?id=${id}`
      });
    },
    //分享
    onShareAppMessage() {
      let that = this;
      // let shopid = that.shopInfo ? that.shopInfo.id : 0;
      // shopid = that.shopid ? that.shopid : shopid;
      // console.log('that.goodsInfo.cover_img'+that.goodsInfo.cover_img)
      return {
        title:
          that.goodsInfo.sku_name + "，" + that.goodsInfo.price / 100 + "元/份",
        // path: `/pages/user/goods?id=${that.id}&shopid=${shopid}&shareuid=${
        //   that.userInfo.id == -1 ? "" : that.userInfo.id
        //   }`,
        path: `/pages/user/goods?id=${that.id}`,
        imageUrl: that.goodsInfo.cover_img || "../../images/shareImg1.jpg"
      };
    },
    //授权微信相册
    saveImageToPhotos(filePath) {
      let that = this;
      // 相册授权
      if(wx.getSetting){
        wx.getSetting({
          success(res) {
            // 进行授权检测，未授权则进行弹层授权
            console.log(res);
            if (res.authSetting["scope.writePhotosAlbum"] == false) {
              console.log("用户肯定是之前否定过拒绝过相册授权");
              wx.openSetting();
            }
            if (!res.authSetting["scope.writePhotosAlbum"]) {
              wx.authorize({
                scope: "scope.writePhotosAlbum",
                success() {
                  console.log("授权成功");
                  that.saveImage();
                },
                // 拒绝授权时，则进入手机设置页面，可进行授权设置
                fail() {
                  wx.openSetting({
                    success: function (data) {
                      console.log("openSetting success");
                    },
                    fail: function (data) {
                      console.log("openSetting fail");
                    }
                  });
                }
              });
            } else {
              // 已授权则直接进行保存图片
              that.saveImage();
            }
          },
          fail(res) {
            console.log(res);
          }
        });
      }
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
.goods_swiper {
  width: 750rpx;
  height: 650rpx;
  overflow: hidden;
  position: relative;
  z-index: 11;
  background: #f2f2f2;
}
.goods-gallery image {
  width: 750rpx;
  height: 650rpx;
}
.goods_swiper swiper {
  height: 650rpx;
}
.goods_tab {
  position: relative;
  height: 100rpx;
  background: linear-gradient(to right, #fb6890, #fd6f76)
}
.goods_tab image {
  width: 750rpx;
  height: 100rpx;
  position: absolute;
}
.goods_tab .goods_price {
  font-size: 64rpx;
  position: relative;
  left: 20rpx;
  color: #fff;
  float: left;
}
.goods_tab .goods_price1 text,
.goods_tab .original_price1 text {
  display: inline-block;
}
.goods_tab .goods_price1 text {
  width: 130rpx;
}
.goods_tab .original_price1 text {
  width: 50rpx;
}
.goods_tab .goods_price .font_small {
  font-size: 26rpx;
}
.goods_tab .original_price {
  position: relative;
  font-size: 26rpx;
  color: #fff;
  float: left;
  top: 40rpx;
  margin-left: 40rpx;
  text-decoration: line-through;
}
.goods_tab .commission_price {
  text-decoration: none;
  font-size: 28rpx;
  top: 34rpx;
}
.goods_time {
  position: absolute;
  right: 30rpx;
  font-size: 24rpx;
  color: #ffffff;
  top: 9rpx;
}
.goods_time text {
  position: relative;
  margin-right: 38rpx;
}
.goods_time .count_down {
  width: 240rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  background: rgba(255, 255, 255, 0.3);
  /* border-radius: 100px; */
  font-size: 24rpx;
  color: #fff;
  position: absolute;
  margin-top: 4rpx;
  right: 2rpx;
}
.goods_box {
  background: #fefefe;
  padding: 20rpx;
  position: relative;
}
.goods_title {
  /* border-bottom: solid 1rpx #f2f2f2;
  padding-bottom: 8rpx; */
  padding-top: 12rpx
}
.goods_title text {
  display: block;
  text-align: left;
  font-size: 24rpx;
  color: #969699;
}
.goods_title .goods_name {
  font-size: 32rpx;
  color: #2f2f30;
  font-weight: bold;
  margin-bottom: 10rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 34rpx;
}
.skeleton_name {
  padding-bottom: 12rpx;
}
.skeleton_name .goods_name {
  width: 80%;
  height: 30rpx;
  color: #fff;
}
.skeleton_name .goods_explain {
  width: 40%;
  height: 30rpx;
  color: #fff;
}
.goods_content {
  position: relative;
  padding-bottom: 20rpx;
}
.goods_content .goods_time {
  position: relative;
  left: 5rpx;
  top: 20rpx;
  font-size: 24rpx;
  color: #f8921f;
  line-height: 36rpx;
}
.goods_content .goods_time text {
  display: block;
  margin-top: 10rpx;
  line-height: 30rpx;
  width: 300rpx;
}
.goods_content .goods_num {
  position: absolute;
  right: 0rpx;
  font-size: 28rpx;
  color: #2f2f30;
  top: 18rpx;
  text-align: right;
}
.goods_content .goods_num .data_num {
  line-height: 28rpx;
  margin-top: 10rpx;
}
.goods_content .goods_num .sell_number {
  font-size: 24rpx;
  color: #969699;
  font-weight: normal;
  text-align: right;
}
.goods_content .goods_number text,
.coupon-num {
  color: #ec3e29;
}
.brand_story {
  position: relative;
  margin-top: 20rpx;
  height: 465rpx;
  overflow: hidden;
  background: #fefefe;
}
.brand_title {
  height: 38rpx;
  width: 710rpx;
  margin: 0 auto 40rpx auto;
  border-bottom: solid 1rpx #f2f2f2;
  position: relative;
}
.brand_title text {
  position: absolute;
  padding: 12rpx;
  background: #fefefe;
  left: 287rpx;
  font-size: 28rpx;
  color: #2f2f30;
  font-weight: bold;
  top: 4rpx;
}
.brand_story image {
  width: 710rpx;
  height: 194rpx;
  left: 20rpx;
  top: 76rpx;
  position: absolute;
}
.brand_story .story_info {
  font-size: 24rpx;
  color: #939396;
  position: absolute;
  top: 290rpx;
  left: 20rpx;
  width: 700rpx;
  height: 76rpx;
  overflow: hidden;
}
.story_btn {
  font-size: 24rpx;
  color: #f8921f;
  border: 2rpx solid #f8921f;
  border-radius: 100rpx;
  width: 266rpx;
  height: 58rpx;
  text-align: center;
  line-height: 58rpx;
  position: relative;
  margin: 0 auto;
  top: 342rpx;
}
.story_btn text {
  position: absolute;
  left: 44rpx;
}
.story_btn image {
  position: absolute;
  width: 24rpx;
  height: 14rpx;
  left: 196rpx;
  top: 22rpx;
}
.goods_info {
  position: relative;
  overflow: hidden;
  background: #fefefe;
  margin-top: 20rpx;
}
.goods_desc {
  width: 710rpx;
  margin: 0 auto;
  position: relative;
  padding-bottom: 20rpx;
}
.goods_desc image {
  width: 710rpx;
  height: 4500rpx;
  display: block;
}
.goods_img {
  padding-top: 38rpx;
}
.buy_guide {
  background: #fefefe;
  margin-top: 20rpx;
  position: relative;
  padding-bottom: 20rpx;
}
.guide_title {
  height: 52rpx;
  width: 710rpx;
  text-indent: 40rpx;
  border-bottom: solid 1rpx #f2f2f2;
  font-size: 28rpx;
  color: #2f2f30;
  text-align: center;
  font-weight: bold;
  padding-top: 24rpx;
}
.buy_guide .icon_down {
  width: 27rpx;
  height: 16rpx;
  position: absolute;
  left: 50%;
  margin-left: -13rpx;
}
.guide_info image {
  width: 15rpx;
  height: 225rpx;
  left: 30rpx;
  position: absolute;
  top: 132rpx;
  z-index: 1;
}
.guide_info text {
  display: block;
  font-size: 24rpx;
  color: #939396;
  padding-left: 60rpx;
}
.price_hint .guide_info {
  padding: 0 32rpx 0 30rpx;
}
.price_hint .guide_info text {
  /* display: block; */
  font-size: 24rpx;
  color: #939396;
  /* padding-left: 60rpx; */
  width: 300rpx;
  display: initial;
  padding: 0;
  position: relative;
  z-index: 3;
}
.guide_info .font_blod {
  font-weight: bold;
  font-size: 28rpx;
  color: #2f2f30;
  margin-bottom: 5rpx;
  background: url(https://hjlbe.dawangtv.cn/2019/2/nLcq2wRr8IZO5wbG_lQW1qYw.jpg)
    no-repeat 30rpx 14rpx;
  background-size: 15rpx 15rpx;
  position: relative;
  z-index: 2;
}
.guide_info .ico_bg {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/icon_hints.png) no-repeat
    0 22rpx;
  background-size: 16rpx 16rpx;
  padding-left: 33rpx;
}
.price_hint .guide_info .font_blod {
  color: #000;
  background: none;
}
.guide_text {
  padding-top: 45rpx;
}
.bottom_box {
  height: 108rpx;
  border-top: 1rpx #dedede solid;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 99999;
  display: flex;
}
.btn_box,
.btn_disabled {
  width: 480rpx;
  height: 84rpx;
  float: right;
  line-height: 84rpx;
  text-align: center;
  font-size: 30rpx;
  color: #fff;
  border-radius: 50rpx;
  margin-top: 12rpx;
  padding-right: 10rpx;
  /* background: #f8921f; */
}
.btn_disabled {
  background: #ccc;
}
.btn_box .addBtn {
  width: 240rpx;
  height: 84rpx;
  background: #fee8ef;
  display: block;
  float: left;
  color: #ff199b;
  border-radius: 50rpx  0 0 50rpx
}
.btn_box .gobuyBtn {
  width: 240rpx;
  height: 84rpx;
  background: #fb6890;
  display: inline-block;
  border-radius: 0  50rpx 50rpx 0
}
.btn_disabled .addBtn,
.btn_disabled .gobuyBtn {
  background: #ccc;
}
.icon_box {
  width: 260rpx;
  float: left;
  padding-top: 12rpx;
}
.icon_box image {
  width: 34rpx;
  height: 38rpx;
  padding-top: 12rpx;
  display: block;
  margin: 0 auto;
}
.icon_box text {
  font-size: 22rpx;
  color: #2f2f30;
  display: block;
  text-align: center;
}
.icon_box .icon {
  width: 68rpx;
  margin: 0 auto;
  float: left;
  padding-left: 42rpx;
  position: relative;
}
.icon_box .tags {
  position: absolute;
  background: #ffffff;
  border: 1rpx solid #ec3e29;
  border-radius: 100rpx;
  font-size: 16rpx;
  color: #ec3e29;
  top: 6rpx;
  right: 0;
  width: 22rpx;
  height: 22rpx;
  text-align: center;
  line-height: 22rpx;
}

.ico_bt_btn {
  background: rgba(0, 0, 0, 0);
  line-height: 32rpx;
  padding: 0;
  font-size: 22rpx;
  position: relative;
}
.guide_info {
  background: #fff;
  padding-bottom: 20rpx;
}
.guide_text .mt10 {
  margin-top: 10rpx;
  margin-bottom: 10rpx;
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
.backTop {
  width: 84rpx;
  position: fixed;
  right: 20rpx;
  bottom: 165rpx;
  background: rgba(254, 254, 254, 0.95);
  border: 1rpx solid #cfcfcf;
  border-radius: 9rpx;
  padding-bottom: 3rpx;
  z-index: 999;
}
.backTop image {
  width: 34rpx;
  height: 34rpx;
  display: block;
  margin: 0 auto;
  padding-top: 14rpx;
}
.backTop text {
  font-size: 20rpx;
  color: #2f2f30;
  display: block;
  text-align: center;
  padding-top: 8rpx;
}
.backTop .icon-home {
  width: 41rpx;
  height: 38rpx;
  padding-top: 12rpx;
}
.backTop .home_box {
  border-top: solid 1rpx #d1d1d1;
  width: 59rpx;
  margin: 0 auto;
  margin-top: 9rpx;
}
.backTop .ico_bt_btn {
  font-size: 20rpx;
}
.shareModal {
  height: 271rpx;
  background: #fff;
  width: 750rpx;
  position: fixed;
  bottom: 0;
  z-index: 999999;
}
.share_icon {
  width: 120rpx;
  margin: 0 auto;
  float: left;
  margin-left: 134rpx;
  padding-top: 25rpx;
  margin-right: 90rpx;
}
.share_icon image {
  width: 88rpx;
  height: 88rpx;
  display: block;
  margin: 0 auto;
}
.share_icon text {
  display: block;
  font-size: 28rpx;
  color: #959598;
  text-align: center;
  margin-top: 6rpx;
}
.cancel_btn {
  width: 750rpx;
  height: 90rpx;
  background: #f2f2f2;
  position: absolute;
  bottom: 0;
  text-align: center;
  line-height: 90rpx;
  font-size: 30rpx;
  color: #2f2f30;
}
.sharePoster {
  width: 450rpx;
  height: 801rpx;
  position: fixed;

  bottom: 26%;
  left: 50%;
  z-index: 999999;
  margin-left: -225rpx;
}
.sharePoster image {
  width: 450rpx;
  height: 801rpx;
}
.shareModal .ico_bt_btn {
  float: left;
}
.shareModal .ico_bt_btn text {
  margin-top: 12rpx;
}

.white-close-img {
  width: 28rpx;
  height: 28rpx;
  position: absolute;
  right: 20rpx;
  top: 215rpx;
}
.mask_disbale {
  width: 750rpx;
  height: 271rpx;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0);
  z-index: 999999;
}
.recommend_title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #4e4e4e;
}

.recommend_list {
  width: 345rpx;
  float: left;
  background: #fff;
  font-size: 24rpx;
  color: #666;
  padding-bottom: 15rpx;
  margin: 22rpx 0 0 20rpx;
  border-radius: 14rpx;
}
.recommend_list image {
  width: 345rpx;
  height: 343rpx;
  display: block;
  border-radius: 14rpx 14rpx 0 0;
  margin-bottom: 20rpx;
}
.recommend_con:after {
  content: ".";
  width: 0;
  height: 0;
  visibility: hidden;
  display: block;
  clear: both;
  overflow: hidden;
}
.recommend_con {
  /* padding-bottom: 50rpx; */
}
.recommend_list .sku_name {
  width: 293rpx;
  margin: 0 auto;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 15rpx;
  height: 74rpx;
  font-size: 26rpx;
  color: #666;
}

.recommend_list .sku_price {
  font-size: 28rpx;
  color: #ec3e29;
  display: inline-block;
  /* font-weight: bold; */
  margin-left: 6rpx;
}
.recommend_list .font_small {
  font-size: 30rpx;
}
.recommend_list .original_price {
  font-size: 20rpx;
  color: #999;
  text-decoration: line-through;
  display: inline-block;
  margin-left: 18rpx;
}
.recommend_list .sell_number {
  text-align: right;
  font-size: 20rpx;
  color: #999;
  position: absolute;
  right: 0;
  top: 10rpx;
}
.recommend_list .price_box {
  width: 300rpx;
  margin: 0 auto;
  position: relative;
}
.recommend_box {
  margin-top: 25rpx;
}
.recommend_con_type {
  padding-bottom: 120rpx;
}
.statusText {
  height: 85rpx;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 77rpx;
  background: #f9efe3;
  text-align: center;
  line-height: 76rpx;
  color: #969699;
  font-size: 30rpx;
}
.goods_num .total_num {
  font-size: 24rpx;
  color: #969699;
  font-weight: normal;
  position: relative;
  top: -7rpx;
}
.activity_icon {
  width: 98rpx;
  height: 122rpx;
  position: fixed;
  right: 20rpx;
  bottom: 400rpx;
}
.time_begin {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/time_begin_bg.png)
    no-repeat;
  background-size: 216rpx 100rpx;
  width: 216rpx;
  height: 100rpx;
  right: 0;
  top: 0;
}
.time_begin text {
  color: #2f2f30;
  font-size: 28rpx;
  font-weight: bold;
  margin-left: 55rpx;
  display: block;
  margin-top: 12rpx;
}
.time_begin .times text {
  line-height: 38rpx;
  color: #ec3e29;
  font-size: 35rpx;
  position: absolute;
  bottom: 8rpx;
  left: 16rpx;
}
.price_con {
  width: 60%;
}
.explosive-content {
  background: #f2f2f2;
  margin-top: 20rpx;
  /* padding-bottom: 70rpx; */
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
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  margin-left: 20rpx;
  margin-top: 20rpx;
  position: relative;
  border-radius: 14rpx;
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
  line-height: 32rpx;
  display: block;
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
  bottom: 5rpx;
}
.explosiveList .goods_price {
  font-size: 42rpx;
  color: #fb6890;
  display: inline-block;
  font-weight: bold;
}
.explosiveList .font_small {
  font-size: 30rpx;
  color: #fb6890;
}
.explosiveList .original_price {
  font-size: 26rpx;
  color: #919194;
  text-decoration: line-through;
  display: inline-block;
  margin-left: 18rpx;
}
.explosiveList .sku_addCart {
  position: absolute;
  width: 64rpx;
  height: 64rpx;
  border-radius: 100rpx;
  background: #fb6890;
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
.activity_enter image {
  width: 142rpx;
  height: 133rpx;
  position: fixed;
  right: 20rpx;
  bottom: 355rpx;
  z-index: 9999;
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
  /* background: rgba(102, 102, 102, 0.63);
  border-radius: 29rpx; */
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
} */
.bottomBox{
  padding-bottom: 70rpx
}
</style>