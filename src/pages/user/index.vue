<template>
  <view class="page">
    <view class="mark"
          wx:if="{{isShowShortcut}}"
          catchtouchmove="true"
          bindtap="closedShortcut"></view>
    <view class="content">
      <!--引导添加小程序-->
      <!-- <view class="top_btn"
            bindtap="addShortcut"
            wx:if="{{isShowAddBtn}}">
        <text>添加到我的小程序，买菜更便捷</text>
        <view class="add_btn">添加</view>
      </view> -->
      <!-- <view class="tips_img"
            wx:if="{{isShowShortcut}}"
            bindtap="closedShortcut">
        <image src="../../images/tips_img.png"></image>
      </view> -->
      <!--配送通知公告-->
      <view class="tips"
            wx:if="{{showTimeStatus}}">
        <wux-notice-bar loop
                        wux-class="notice-bar"
                        icon="http://hjl2c.dawangtv.cn/wxa_images/icon_hint.gif">
          {{SysNoticeInfo.content}}
        </wux-notice-bar>
      </view>
      <!--分享按钮-->
      <view class="top_box">
        <view class="top_shop">
          <!--门店信息-->
          <!-- <view class="shopContent">
            <image src="{{fileserver+shopInfo.headerimg}}"
                   class="shopImg"
                   wx:if="{{!!shopInfo.headerimg}}"
                   mode="aspectFill"></image>
            <image src="../../images/dian_default@2x.png"
                   class="shopImg"
                   wx:else></image>
            <view class="shopText">
              <view class="{{shopInfo.status == 4 ? 'shopName_disabled ' : 'shopName'}}">
                <text>{{shopInfo.shop_name || '暂无自提点'}}</text>
              </view>
              <view class="rest" wx:if="{{shopInfo.status == 4}}">(休息中)</view>
            </view>
          </view> -->
          <!--搜索入口-->
          <view class="categoryContent">
            <view class="searchContent"
                  bindtap="go2searchList">
              <image src="../../images/search_img.png"
                     class="searchImg"></image>
              <text>搜索商品</text>
            </view>
          </view>
        </view>
      </view>
      <!--分类图标-->
      <view class="categoryStatus">
        <wux-grids col="5"
                   bordered="{{ false }}">
          <wux-grid wx:for="{{categoryList}}"
                    wx:key="id"
                    thumb="../../images/icon_category{{index+1}}.png"
                    label="{{item.name}}"
                    bindtap="onCategoryChange({{item.id}})" />
        </wux-grids>
      </view>
    </view>

    <!--限时秒杀商品类表区-->
    <view class="seckillContent"
          wx:if="{{isSeckill}}">
      <view class="seckill_top">
        <image src="../../images/seckill_img.png"></image>
        <!--秒杀时间轴-->
        <scroll-view class="seckill_box"
                     scroll-x="true"
                     scroll-left="{{scrollLeft}}">
          <blcok wx:for="{{seckillList}}"
                 wx:key="index">
            <view class="seckill_time {{item.selected ? 'active' : ''}}"
                  bindtap="seckillTab"
                  data-time="{{item.time}}"
                  data-index="{{index}}">
              <text>{{item.timeShow}}</text>
              <text class="seckill_status"
                    wx:if="{{item.status == 1}}">已开抢</text>
              <text class="seckill_status"
                    wx:if="{{item.status == 2}}">抢购中</text>
              <text class="seckill_status"
                    wx:if="{{item.status == 3}}">即将开抢</text>
            </view>
          </blcok>
        </scroll-view>
      </view>
      <scroll-view class="seckill_con"
                   scroll-x="true">
        <!--秒杀商品列表-->
        <block wx:for="{{seckillList}}"
               wx:key="index">
          <block wx:if="{{item.selected}}">
            <view class="seckill_skuList"
                  wx:for="{{item.list}}"
                  wx:key="index">
              <navigator url="{{'/pages/user/goods?id=' + item.id}}"
                         id="{{item.id}}">
                <image src="{{fileserver+item.photos}}"></image>
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
                <!--商品名称 规格信息-->
                <view class="sku_info">
                  <text class="sku_name">{{item.sku_name_show}}</text>
                  <text class="sku_spec"
                        wx:if="{{item.sku_specification}}">{{item.sku_specification_show}}</text>
                </view>
                <!--价格信息-->
                <view class="price_content">
                  <view class="goods_price">
                    <text class="font_small">¥</text>{{item.price/100}}
                  </view>
                  <text class="original_price">¥{{item.default_price/100}}</text>
                </view>
              </navigator>
              <!--加入购物车按钮-->
              <view class="sku_addCart"
                    wx:if="{{item.isAddCart}}"
                    catchtap="addToCart"
                    data-id="{{item.id}}">
                <image src="../../images/ico_carts.png"></image>
              </view>
              <view class="sku_addCart disbale_addCart"
                    wx:if="{{!item.isAddCart}}">
                <image src="../../images/ico_carts.png"></image>
              </view>
            </view>
          </block>
        </block>
      </scroll-view>
    </view>
    <!--商品列表-->
    <view class="goodsContent">

      <!--今日爆品列表-->
      <!-- <block wx:if="{{explosiveList.length > 0}}">
        <view class="explosive_box">
          <view class="sku_box">
            <repeat for="{{explosiveList}}"
                    key="index"
                    index="index"
                    item="ittem">
              <skuitem :item="ittem"
                       :tags="tags"
                       :goToCategory="goToCategory"
                       v-on:goCategory="goCategory"
                       v-on:add2CartItem="add2CartItem"
                       v-on:cartNumDownItem="cartNumDownItem"
                       v-on:cartNumUpItem="cartNumUpItem">
              </skuitem>
            </repeat>
          </view>
        </view>
      </block> -->
      <!--分类排序商品列表-->
      <view class="category_box">
        <repeat for="{{newGoodsList}}"
                key="id"
                item="item">
          <view class="category_{{item.category_id}} {{item.items.length == 0 ? 'hidePadding' : ''}}">
          <view class="categoryName"><image src="../../images/categoryname_{{item.category_id}}.png"></image></view>
          <repeat wx:if="{{item.items.length>0}}"
                  for="{{item.items}}"
                  key="index"
                  index="index"
                  item="ittem">
            <skuitem :item="ittem"
                     v-on:add2CartItem="add2CartItem"
                     v-on:cartNumDownItem="cartNumDownItem"
                     v-on:cartNumUpItem="cartNumUpItem">
            </skuitem>
          </repeat>
          <view class="categoryNoRecord" wx:if="{{item.items.length == 0}}"><image src="../../images/icon_null.png"></image><text>该商品暂无分类</text></view>
          </view>
        </repeat>
      
      </view>
    </view>
    <!--加载更多-->
    <view class="weui-loadmore weui-loadmore_line"
          wx:if="{{ isNoMoreData }}">
      <view class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多数据</view>
    </view>
    <!--供应商入驻热线-->
    <!-- <view class="Supplier_hotline" wx:if="{{isShowHotline}}">
            <image src="../../images/supplier_phone.jpg"></image>
            <image src="../../images/supplier_phone2.png" class="supplierImg"></image>
            <image class="call_btn" src="../../images/icon_call.png" bindtap="callManagerG"></image>
            <image class="call_btn call_btn_two" src="../../images/icon_call.png" bindtap="callManagerY"></image>
            <image class="call_btn call_btn_three" src="../../images/icon_call.png" bindtap="callManagerH"></image>
            <image class="call_btn call_btn_four" src="../../images/icon_call.png" bindtap="callManagerM"></image>
        </view> -->
    <!--请求中的loading-->
    <!-- <view class="weui-loadmore"
          wx:if="{{isLoading}}">
      <view class="weui-loadmore__tips weui-loadmore__tips_in-line">
        <image src="../../images/loading.gif"></image>
      </view>
    </view> -->
    <!--返回顶部-->
    <view class="backTop"
          wx:if="{{btnTop}}"
          bindtap="goTop">
      <image src="../../images/back_top.png"></image>
      <!-- <text>顶部</text> -->
    </view>
    <!--活动入口-->
    <view class="activity_enter"
          bindtap="go2activity"
          wx:if="{{isShowActivity}}">
      <image src="../../images/activity2_img/enter_btn.gif"></image>
    </view>
    <!--用户信息授权-->
    <getuserinfo></getuserinfo>
    <!--提示框-->
    <confirm :confirmData.sync="confirmData"
             v-on:changeShop="changeShop"></confirm>
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
    <view class="publicHeight"></view>
  </view>
</template>


<script>
if (!Object.values) Object.values = o => Object.keys(o).map(k => o[k]);
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import log from "../../util/log";
import getuserinfo from "../../components/getuserinfo";
import confirm from "../../components/confirm";
import moment from "moment";
// import Check23clockMixin from "../base/check23clock";
import ShopcartMixin from "../base/shopcart";
import skuitem from "../../components/skuitem";
// import { clearInterval } from "timers";
// import { setTimeout } from "timers";
export default class Index extends auth {
  config = {
    navigationBarTitleText: "乐乐购",
    usingComponents: {
      "wux-grids": "../../plugin/wux/grids/index",
      "wux-grid": "../../plugin/wux/grid/index",
      "wux-notice-bar": "../../plugin/wux/notice-bar/index",
      "wux-spin": "../../plugin/wux/spin/index"
    }
  };
  components = {
    getuserinfo: getuserinfo,
    confirm: confirm,
    skuitem: skuitem
  };
  // mixins = [Check23clockMixin, ShopcartMixin];
    mixins = [ShopcartMixin];
  data = {
    fileserver: `${api.uploadimgFile}`, //上传图片域名
    needUserinfo: false, // 是否显示授权
    isNoMoreData: false, // 没有更多数据
    isLoading: false, // 是否在加载中
    sizeIndx: 999999, //每页只显示10条数据
    allPages: 0, //总页数
    goodsList: [], //商品列表数据
    shopInfo: null, //门店信息数据
    newShopInfo: {}, //新的自提点数据
    btnTop: true, //返回顶部标识
    scrollTop: 44, //滚动高度默认值
    userInfo: {}, //用户信息数据
    checkNeedLoginDone: false, //检查是否授权完成标识
    confirmData: {}, //弹框数据
    explosiveList: [], //今日爆品数据
    festivalList: [], //狂欢日商品数据
    categoryid: null, //分类id
    categoryStatus: false, //分类位置标识
    isShowHotline: false, //供应商服务热线显示标识
    mask: false, //遮罩层显示标识
    isShowAddBtn: true,
    showTimeStatus: false,
    categoryList: [
      {
        name: "新鲜果园",
        id: 128
      },
      {
        name: "蔬菜蛋品",
        id: 129
      },
      {
        name: "肉禽鱼虾",
        id: 127
      },
      {
        name: "低温食品",
        id: 130
      },
      {
        name: "粮油调味",
        id: 131
      },
      {
        name: "零食冲调",
        id: 134
      },
      {
        name: "酒水乳饮",
        id: 135
      },
      {
        name: "清洁护理",
        id: 132
      },
      {
        name: "居家用品",
        id: 136
      },
      {
        name: "纺织穿戴",
        id: 137
      }
    ],
    tags: true,
    newGoodsList: [],
    listPage: 0,
    isShowActivity: false, //活动开关
    openid: null, //活动接口需要传openid
    newGoodsList: [],
    giftpackNo: null,
    couponList: [],
    inviteUid: "",
    nickname: "",
    headimg: "",
    shopid: null,
    festivalTitle: "",
    isShowShortcut: false,
    isOnloadend: false, //时序标记位
    goToCategory: true, // 是否进入分类
    seckillList: [],
    currenttime: null,
    seckillTimer: null,
    scrollLeft: 0,
    seckillTabIndex: null,
    isSeckill: false,
    currenttimeTimer: null,
    cartDatas: null,
    isShowLoading: false,
    SysNoticeInfo: {},
    categoryNameHeight: 0,
    explosiveBoxHeight: 0,
    seckillBoxHeight: 0,
    festivalListHeight: 0,
    categoryNoRecordHeight: 0
  };
  async onLoad(options) {
    let result = await super.onLoad(options);
    // 引导状态
    this.isShowAddBtn = wx.getStorageSync("isShowAddBtn") ? false : true;
    console.log("this.isShowAddBtn", this.isShowAddBtn);

    // 点邀请进来的
    if (options.shareuid) {
      wx.setStorageSync("shareuid", options.shareuid);
    }
    // this.shopInfo =
    //   this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");

    // await this.getMyShopInfo();
    // console.log("进入到了商品列表页");
    // this.shopid = options.shopid == 0 ? null : options.shopid;

    // let oscenekv = decodeURIComponent(options.scene).split("&");

    // for (let item of oscenekv) {
    //   let [k, v] = item.split("=");
    //   if (k == "shopid") {
    //     this.shopid = options.shopid || v;
    //   }
    // }
    // console.log("into index oscenekv shopid", this.shopid);
    // if (this.shopid) {
    //   await this.getShopInfo(this.shopid);
    //   console.log("商品列表页 带有店铺信息 options.shopid", this.shopid);
    // }
    // if (wx.getStorageSync("user:detail").id != -1) {
    //   if (wx.getStorageSync("shopid")) {
    //     await this.setShopInfo(wx.getStorageSync("shopid"));
    //     wx.removeStorageSync("shopid");
    //   }
    // }

    this.needUserinfo = this.$parent.globalData.needUserinfo;
    // if (this.needUserinfo) {
    //   //this.$broadcast("showUserInfo");
    //   //此时不要求自提点判断
    // } else {
    //   this.checkNeedLoginDone = true;
    //   //此时需要自提点判断
    //   this.tryshowAddressModal();
    // }
    // await this.checkShopInfo();
    this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};
    this.mask = true;
    this.isShowLoading = true;
    this.$apply();
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });

    this.getSysNotice();
    await this.getRemoteShopCart();
    await this.getGoodsList();
    this.isOnloadend = true;
    this.$apply();
  }
  async tryshowAddressModal() {
    this.needUserinfo = this.$parent.globalData.needUserinfo;
    // this.shopInfo =
    //   this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");

    // this.checkShopInfo();
  }
  // checkShopInfo() {
  //   console.log("checkShopInfo");
  //   console.log(this.shopInfo, "checkShopInfo");
  //   if (!this.shopInfo && !this.shopid) {
  //     console.log("进入了", "checkShopInfo");
  //     if (
  //       wx.getStorageSync("user:detail").id == -1 &&
  //       wx.getStorageSync("shopid")
  //     ) {
  //       return;
  //     }
  //     this.confirmData.title = "温馨提示";
  //     this.confirmData.msg = "没有选择自提点，请先设置自己的自提点";
  //     this.confirmData.url = "/pages/user/addresslist";
  //     this.$broadcast("showTips");
  //   }
  // }
  async onShow() {
    // 记录服器时间
    // this.IntervalCurrenttime();
    //必须等onload干完活
    let self = this;
    let counter = 0;
    while (true) {
      if (this.isOnloadend) {
        break;
      } else {
        counter++;
        // if (counter > 60) break;
        // console.log("in to index,onshow, sleep " + counter);
        await this.$parent.globalData.sleep(50);
      }
    }

    // 秒杀时间轴商品
    if (this.isSeckill) {
      // 清轮训
      clearInterval(self.seckillTimer);
      // 轮训
      self.seckillTimer = setInterval(function () {
        self.seckillGoodsList();
      }, 1000);
    }
    console.log("终于等完onload干完活， onshow马上要干活");
    this.cartDatas = wx.getStorageSync("oldCart");
    this.shopInfo =
      this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
    this.fileserver = `${api.uploadimgFile}`;
    console.log("in onshow , checkNeedLoginDone is ", this.checkNeedLoginDone);
    this.tryshowAddressModal();
    this.refreshCartAmountInGoodList({
      force: true
    });
    this.$apply();
  }
  onHide() {
    clearInterval(this.seckillTimer);
  }
  //   onPageScroll(e) {
  //     this.btnTop = e.scrollTop > 50 ? true : false;
  //     this.$apply();
  //   }
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0
      //   duration: 100
    });
    this.$apply();
  }
  async onPullDownRefresh() {
    this.getSysNotice();
    this.checkNeedLoginDone = true;
    this.tryshowAddressModal();
    this.getGoodsList();
    this.getCurrentTime();
    wepy.stopPullDownRefresh();
  }
  // async onReachBottom() {
  //   console.log("滑动到底部了");
  //   wx.aldstat.sendEvent("首页下滑的翻页点击数", {});
  //   this.mask = true;
  //   this.isLoading = true;
  //   await this.getMoreList();
  //   this.mask = false;
  //   this.$apply();
  // }
  // IntervalCurrenttime() {
  //   let self = this;
  //   clearInterval(self.currenttimeTimer);
  //   // 获取服务器时间戳
  //   self.currenttime = this.$parent.globalData.currenttime;
  //   // 轮训
  //   self.currenttimeTimer = setInterval(function() {
  //     self.currenttime = self.currenttime + 1000;
  //   }, 1000);
  // }
  seckillGoodsList() {
    let self = this;
    let _now = this.getNow();

    // 获取当天的 年月日
    let now = moment().format("YYYY-MM-DD");
    let currIndex = 9999;

    // 设置时间轴的状态 1为已开抢 2为抢购中  3即将开始
    self.seckillList.map((item, index) => {
      item.status = moment(_now).isAfter(moment(now + " " + item.time)) ? 1 : 3;
      if (item.status == 1) {
        currIndex = index;
      }
    });

    self.seckillList.map((item, index) => {
      // 设置2抢购中状态
      item.selected = false;
      if (index == currIndex) {
        item.status = 2;
        item.selected = true;
        if (self.seckillTabIndex != null) {
          item.selected = false;
        }
      }

      // 手动切换了时间轴后 选中变为手动
      let scrollIndex = currIndex;
      if (self.seckillTabIndex != null) {
        scrollIndex = self.seckillTabIndex;
        item.selected = false;
        if (index == self.seckillTabIndex) {
          item.selected = true;
        }
      }

      // 处理商品状态
      self.setGoodsItem(item.list);
      if (item.list.length > 0) self.sortGoodsItems(item.list);
      item.list.map(iitem => {
        iitem.isAddCart = true;

        // 1、还没开始的商品 已结束的商品 不能加入购物车
        if (iitem.start_status == 2 || iitem.start_status == 3) {
          iitem.isAddCart = false;
        }

        // 2、开始的 抢光的 不能加入购物车
        if (iitem.start_status == 1 && iitem.stock_status == "empty") {
          iitem.isAddCart = false;
        }

        // 设置商品图片
        if (!!iitem.photos) {
          iitem.photos = iitem.photos.split(",")[0];
        }

        // 格式化商品规格
        if (!!iitem.sku_specification) {
          try {
            let t = JSON.parse(iitem.sku_specification);
            iitem.sku_specification = t["规格"];
          } catch (ex) { }
          iitem.sku_specification_show =
            iitem.sku_specification.length > 10
              ? iitem.sku_specification.substring(0, 10) + "..."
              : iitem.sku_specification;
        }
        if (!!iitem.sku_name) {
          iitem.sku_name_show =
            iitem.sku_name.length > 22
              ? iitem.sku_name.substring(0, 22) + "..."
              : iitem.sku_name;
        }
      });

      // 设置时间轴滚动
      // 1.时间轴小于5个时 不做滚动
      // 2.选中的为第1 2 3个时不做滚动
      if (self.seckillList.length > 4) {
        let vIndex = 0;
        if (scrollIndex > 2) {
          // 3.最后 3个的选中滚动距离一样
          vIndex =
            scrollIndex > self.seckillList.length - 4
              ? self.seckillList.length - 4
              : scrollIndex - 1;
        }
        self.scrollLeft = vIndex * 75;
      }
    });

    // 秒杀时间全部未开始
    self.seckillList.map((item, index) => {
      let timeStatus =
        self.currenttime > moment(now + " " + item.time).valueOf() ? 1 : 3;
      if (timeStatus == 3 && index == 0 && self.seckillTabIndex == null) {
        item.selected = true;
      }
    });

    self.$apply();
  }
  async getMoreList() {
    // await this.$parent.globalData.sleep(500000);
    if (this.goodsList.length > (this.listPage - 1) * 10) {
      this.newGoodsList = [];
      let listPage =
        this.listPage * 10 > this.goodsList.length
          ? this.goodsList.length
          : this.listPage * 10;
      // 将商品 分类
      for (let i in this.categoryList) {
        this.newGoodsList[i] = this.categoryList[i];
        this.newGoodsList[i]["list"] = [];
        for (var j = 0, len = this.goodsList.length; j < listPage; j++) {
          if (this.categoryList[i].id == this.goodsList[j].categoryid_l2) {
            this.newGoodsList[i]["list"].push(this.goodsList[j]);
          }
        }
      }
      // this.sortNewGoodsList();
      console.log(this.newGoodsList, "this.newGoodsList");

      this.listPage++;
    } else {
      this.isShowHotline = true;
      this.isLoading = false;
      this.noMoreData = true;
    }
    this.$apply();
  }
  // 设置门店
  // async setShopInfo(shopid) {
  //   this.shopInfo.id = shopid ? shopid : this.shopInfo.id;
  //   let myShopInfo = await this.$parent.globalData.post(
  //     `${api.server}/api/ec/user/setMyAddress`,
  //     { address: this.shopInfo.id }
  //   );
  //   this.$parent.globalData.shopInfo = this.shopInfo;
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
  //     this.shopInfoTimter = setInterval(() => {
  //       this.shopInfo = this.$parent.globalData.shopInfo = myShopInfo;
  //     }, 1000);

  //     setTimeout(() => {
  //       clearInterval(this.shopInfoTimter);
  //     }, 5000);
  //   }
  //   this.$apply();
  // }
  // 获取门店信息
  // async getShopInfo(shopid) {
  //    this.shopInfo =
  //    this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
  //   console.log(this.shopInfo, shopid, "shopid diff");
  //   if (!!this.shopInfo && this.shopInfo.id == shopid) return;
  //   let resultShopInfo = await this.$parent.globalData.get(
  //     `${api.server}/api/ec/b2c/shop/info?id=${shopid}`
  //   );
  //   if (resultShopInfo.state !== "error") {
  //     // 验证切换自提点
  //     this.newShopInfo = resultShopInfo;
  //     if (!this.shopInfo) {
  //       this.shopInfo = this.$parent.globalData.shopInfo = this.newShopInfo;
  //       this.setShopInfo(this.shopInfo.id);
  //       if (wx.getStorageSync("user:detail").id == -1) {
  //         wx.setStorageSync("shopid", this.shopid);
  //       }
  //       wx.setStorageSync("shopInfo", this.shopInfo);
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
  // }
  getNow() {
    return moment();
  }

  //获取商品列表
  async getGoodsList() {
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/b2c/sku/listfornewindex`
    );
    if (resultList.state !== "error") {
      this.seckillList = [];
      // 秒杀商品列表
      if (JSON.stringify(resultList.seckill_result) != "{}") {
        for (let i in resultList.seckill_result) {
          let arr = {
            timeShow: i.substring(0, 5),
            time: i,
            selected: false,
            list: resultList.seckill_result[i]
          };
          this.seckillList.push(arr);
        }

        if (this.seckillList.length > 0) this.isSeckill = true;

        this.seckillList.sort(function (a, b) {
          return a.time > b.time ? 1 : -1;
        });
        this.seckillGoodsList();
      } else {
        this.isSeckill = false;
      }

      // 节日商品列表
      this.festivalList = resultList.act_result;
      if (this.festivalList.length > 0) {
        this.festivalList.map(item => {
          if (item.result.length > 0) {
            item.result = this.setGoodsItem(item.result);
            item.result = this.sortGoodsItems(item.result);
          }
        });
      }

      // 今日爆款商品列表
      this.explosiveList = resultList.hot_result;
      if (this.explosiveList.length > 0) {
        this.explosiveList = this.setGoodsItem(this.explosiveList);
        this.explosiveList = this.sortGoodsItems(this.explosiveList);
      }

      // 分类商品列表
      this.goodsList = resultList.sku_result;
      // 过滤掉已结束和已抢光的商品
      this.goodsList.map(item => {
        item.items = this.setGoodsItem(item.items);
        if (item.items.length > 0) {
          item.items = this.setGoodsFilter(item.items)
        }
      })


      this.listPage = 2;

      this.newGoodsList = this.goodsList

      // 分类的排序
      // this.sortNewGoodsList();
    }
    console.log(this.newGoodsList, "this.newGoodsList");
    this.$apply();
    // wx.hideLoading();
    this.isShowLoading = false;
    this.mask = false;
    this.isNoMoreData = true;

    this.refreshCartAmountInGoodList();
    this.$apply();
  }
  // 过滤已结束和已抢光的商品
  setGoodsFilter(list) {
    let arry = []
    if (list.length > 0) {
      list.map(item => {
        if ((item.start_status == 1 && item.stock_status == "full") || item.start_status == 3) {
          arry.push(item);
        }
      })
    }
    return arry
  }
  // sortNewGoodsList() {
  //   let self = this;
  //   this.newGoodsList.map(item => {
  //     if (item.list.length > 0) {
  //       self.sortGoodsItems(item.list);
  //     }
  //   });
  // }
  sortGoodsItems(arr) {
    return arr.sort((a, b) => {
      if (a.statusOrderBy == b.statusOrderBy) {
        if (a.orderby > b.orderby) {
          return -1;
        }
        if (a.orderby < b.orderby) {
          return 1;
        }
        if (a.orderby == b.orderby) {
          return a.id < b.id;
        }
      }
      if (a.statusOrderBy < b.statusOrderBy) {
        return -1;
      }
      if (a.statusOrderBy > b.statusOrderBy) {
        return 1;
      }
      return 0;
    });
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

      // 设置排序 0为正在售卖的 1为预售 2为抢光 3为结束

      // 在售卖的
      item.statusOrderBy = 0;

      // 预售
      if (item.start_status == 3) {
        item.statusOrderBy = 1;
      }

      // 抢光
      if (item.stock_status == "empty") {
        item.statusOrderBy = 2;
      }

      // 结束
      if (item.start_status == 2 && item.stock_status == "full") {
        item.statusOrderBy = 3;
      }
    });
    return goodsList;
  }
  refreshCartAmountInGoodList(options) {
    if (this.goodsList.length > 0) {
      this.goodsList.map(item => {
        if (item.items.length > 0) {
          this.setCartAmount(item.items, options);
        }
      })
    }

    this.setCartAmount(this.explosiveList, options);
    this.festivalList.map(item => {
      if (item.result.length > 0) {
        this.setCartAmount(item.result, options);
      }
    });

    this.$apply();
  }
  setCartAmount(list, options) {
    let cartDatas = this.cartDatas || wx.getStorageSync("oldCart");
    if (!!options && options.force) {
      this.cartDatas = wx.getStorageSync("oldCart");
      cartDatas = this.cartDatas;
    }
    // console.log("in refreshCartAmountInGoodList , cart is ", cartDatas);
    if (list.length > 0 && cartDatas) {
      list.map(item => {
        item["cartAmount"] = "";
        item["cartId"] = "";
        let iitem = cartDatas[item.id];
        if (!!iitem) {
          item["cartAmount"] = iitem.amount;
          item["cartId"] = item.id;
        }
      });
    }
  }
  /**
   * 加入购物车
   * */
  async addToCart(e) {
    wx.aldstat.sendEvent("首页秒杀点击加入购物车", {});
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
  // 修改购物车中商品
  updateCart() {
    // 将购物车的id和amount存入缓存  和 首页匹配
    this.setCartBadgeNum();
    this.refreshCartAmountInGoodList();
    this.$parent.globalData.isAdding = false;
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
  methods = {
    seckillTab(e) {
      let time = e.currentTarget.dataset.time;
      this.seckillList.map(item => {
        item.selected = time == item.time ? true : false;
      });
      this.seckillTabIndex = e.currentTarget.dataset.index;
      this.seckillList = this.seckillList;

      // 设置滚动
      // 1.时间轴小于5个时 不做滚动
      // 2.选中的为第1 2 3个时不做滚动
      if (this.seckillList.length > 4) {
        // 最后 3个的选中滚动距离一样
        let vIndex = 0;
        if (this.seckillTabIndex > 2) {
          vIndex =
            this.seckillTabIndex > this.seckillList.length - 4
              ? this.seckillList.length - 4
              : this.seckillTabIndex - 1;
        }
        this.scrollLeft = vIndex * 75;
      }

      this.$apply();
    },
    goCategory(e) {
      wx.reLaunch({
        url: `/pages/user/categorylist?categoryid=${e.currentTarget.dataset.id}`
      });
    },
    add2CartItem(e) {
      this.add2CartAction(e);
    },
    cartNumDownItem(e) {
      this.cartNumDownAction(e);
    },
    cartNumUpItem(e) {
      this.cartNumUpAction(e);
    },
    opendebug() {
      this.debugcounter++;
      if (this.debugcounter == 6) {
        wx.setEnableDebug({
          enableDebug: true
        });
      }
      console.log(this.debugcounter);
      if (!this.debugcountertimer) {
        this.debugcountertimer = setTimeout(() => {
          this.debugcounter = 0;
          this.debugcountertimer = null;
          console.log("debug timer处理干净了");
        }, 2000);
      }
    },
    onCategoryChange(id) {
      // wx.aldstat.sendEvent("首页分类图标点击", {});
      // wx.reLaunch({
      //   url: `/pages/user/categorylist?categoryid=${id}`
      // });
      let that = this;
      let query = wx.createSelectorQuery();

      // 验证是否去获取模块高度
      let isGetGoodsBoxH = false
      for (let i in this.newGoodsList) {
        if (this.newGoodsList[i].items.length > 0) {
          isGetGoodsBoxH = true
          break
        }
      }

      // 验证是否去获取分类无商品的高度
      let isGetNorecordH = false
      for (let i in this.newGoodsList) {
        if (this.newGoodsList[i].items.length == 0) {
          isGetNorecordH = true
          break
        }
      }

      // 分类每个商品模块的高度
      if (isGetGoodsBoxH) {
        query.select(".category_box .goods_box").boundingClientRect();
      } else {
        query.select(".publicHeight").boundingClientRect();
      }

      query.select(".content").boundingClientRect();

      // 分类标题的高度
      query.select(".categoryName").boundingClientRect();

      // if (that.explosiveList.length > 0) query.select(".explosive_box").boundingClientRect();
      // if (that.isSeckill) query.select(".seckillContent").boundingClientRect();
      // if (that.festivalList.length > 0) query.select(".festivalList").boundingClientRect();

      // 爆品模块高度
      if (that.explosiveList.length > 0) {
        query.select(".explosive_box").boundingClientRect();
      } else {
        query.select(".publicHeight").boundingClientRect();
      }

      // 秒杀活动的模块高度
      if (that.isSeckill) {
        query.select(".seckillContent").boundingClientRect();
      } else {
        query.select(".publicHeight").boundingClientRect();
      }

      // 节日活动模块高度
      if (that.festivalList.length > 0) {
        query.select(".festivalList").boundingClientRect();
      } else {
        query.select(".publicHeight").boundingClientRect();
      }

      // 分类商品无记录的高度
      if (isGetNorecordH) {
        query.select(".categoryNoRecord").boundingClientRect();
      } else {
        query.select(".publicHeight").boundingClientRect();
      }

      query.exec(function (res) {
        // console.log('res', res)
        that.goodsHeight = res[0] ? res[0].height : 0;
        that.topHeight = res[1] ? res[1].height : 0;
        that.categoryNameHeight = res[2] ? res[2].height : 0;

        that.explosiveBoxHeight = res[3] ? res[3].height : 0;
        that.seckillBoxHeight = res[4] ? res[4].height : 0;
        that.festivalListHeight = res[5] ? res[5].height : 0;
        that.categoryNoRecordHeight = res[6] ? res[6].height : 0;


        that.shopLength = 0;
        that.categoryListLength = 0;
        that.noRecordLength = 0

        loop: for (let i in that.newGoodsList) {
          that.categoryListLength = i;
          if (id == that.newGoodsList[i].category_id) {
            break loop;
          }
          if (that.newGoodsList[i].items.length == 0) that.noRecordLength++
          that.shopLength += that.newGoodsList[i].items.length
        }

        that.shopLength = that.categoryListLength == 0 ? 0 : that.shopLength;

        that.scrollTop =
          that.topHeight +
          that.explosiveBoxHeight +
          that.shopLength * that.goodsHeight +
          that.categoryListLength * that.categoryNameHeight +
          that.seckillBoxHeight +
          that.festivalListHeight +
          that.noRecordLength * that.categoryNoRecordHeight
        wx.pageScrollTo({
          scrollTop: that.scrollTop,
          duration: 0
        });
      });
    },
    changeShop(e) {
      util.setChangeShop(e, this.confirmData);
      this.shopInfo = e
        ? this.confirmData.newShopInfo
        : this.confirmData.shopInfo;
      this.$parent.globalData.shopInfo = this.shopInfo;
      wx.setStorageSync("shopInfo", this.shopInfo);
      if (wx.getStorageSync("user:detail").id == -1) {
        wx.setStorageSync("shopid", this.shopid);
      }
      this.setShopInfo();
      this.$apply();
    },
    addShortcut() {
      this.isShowShortcut = true;
      this.mark = true;
      this.isShowAddBtn = false;
      wx.setStorageSync("isShowAddBtn", 1);
      wx.aldstat.sendEvent("首页添加小程序点击", {});
    },
    closedShortcut() {
      this.isShowShortcut = false;
      this.mark = false;
    },
    go2searchList() {
      wx.navigateTo({
        url: "/pages/user/searchlist"
      });
    },
    go2activity() {
      wx.navigateTo({
        url: "/pages/user/activity"
      });
    },
    callManagerH() {
      wx.makePhoneCall({
        phoneNumber: "15312508686"
      });
    },
    callManagerG() {
      wx.makePhoneCall({
        phoneNumber: "13585310989"
      });
    },
    callManagerY() {
      wx.makePhoneCall({
        phoneNumber: "17768397596"
      });
    },
    callManagerM() {
      wx.makePhoneCall({
        phoneNumber: "18221662390"
      });
    },
    onShareAppMessage() {
      wx.aldstat.sendEvent("首页分享按钮点击", {});
      let that = this;
      let shareName = "";
      let shopid = that.shopInfo ? that.shopInfo.id : 0;
      let userInfo = wx.getStorageSync("user:detail") || {};
      if (!!userInfo.nickname) {
        shareName = userInfo.nickname;
      }
      return {
        title: shareName + "邀请您来下单",
        path: `/pages/user/index`,
        imageUrl: "../../images/shareImg1.jpg"
      };
    }
  };
}
</script>

<style>
page {
  width: 100%;
  overflow-x: hidden;
  font-family: "微软雅黑";
}
.content {
  /* padding-bottom: 20rpx; */
  overflow: hidden;
}
.topContent {
  background: #f0533a;
  height: 74rpx;
  position: fixed;
  width: 750rpx;
  z-index: 99;
}
.topContent .bannerImg {
  width: 474rpx;
  height: 59rpx;
  margin: 0 auto;
  display: block;
  padding-top: 4rpx;
  overflow: hidden;
}
.topContent .shareImg {
  width: 36rpx;
  height: 30rpx;
  position: absolute;
  right: 84rpx;
  top: 0;
}
.topContent text {
  color: #fff;
  font-size: 26rpx;
  display: block;
  float: right;
  margin-top: -34rpx;
  margin-right: -10rpx;
}

.tips .wux-notice-bar {
  background: #fdf3e7;
  color: #ec3e29;
  font-weight: bold;
  line-height: 76rpx;
}
.shopContent {
  height: 144rpx;
  /* background: #fefefe; */
  position: relative;
  top: 74rpx;
  left: 0;
  overflow: hidden;
  margin-bottom: 95rpx;
}
.shopContent .shopImg {
  width: 105rpx;
  height: 105rpx;
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  background: #f2f2f2;
}
.shopText {
  position: absolute;
  left: 148rpx;
  top: 15rpx;
}
.shopText .shopExplain {
  font-size: 24rpx;
  color: #9c9c9c;
  display: block;
  margin-top: 5rpx;
}
.shopText .shopName_disabled text {
  font-size: 28rpx;
  color: #9c9c9c;
  margin-right: 10rpx;
  margin-top: 10rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  max-width: 170rpx;
}
.shopText .shopName_disabled {
  float: left;
}
.rest {
  float: left;
  font-size: 28rpx;
  color: #9c9c9c;
  position: relative;
  top: 8rpx;
}
.shopText .shopName text {
  font-size: 28rpx;
  color: #1f1f1f;
  display: inline-block;
  margin-right: 20rpx;
  margin-top: 10rpx;
}
.searchContent {
  width: 680rpx;
  height: 74rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 100rpx;
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  padding-left: 30rpx;
}
.searchContent text {
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  display: block;
  line-height: 74rpx;
}
.searchContent .searchImg {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  top: 30rpx;
  left: 265rpx;
}
.goodsContent {
  width: 750rpx;
  /* top: 114rpx; */
  /* margin-top: 88rpx; */
  /* margin-top: 20rpx; */
  position: relative;
}
.noData {
  text-align: center;
  position: relative;
  height: 1200rpx;
  padding: 200rpx 50rpx;
  font-size: 28rpx;
  color: #9c9c9c;
  background: #fff;
}
.ico_bt_btn {
  position: absolute;
  right: 0;
  top: 22rpx;
  border-radius: 0;
  overflow: none;
  width: 236rpx;
}
.backTop {
  width: 84rpx;
  height: 90rpx;
  position: fixed;
  right: 20rpx;
  bottom: 92rpx;
  /* background: rgba(254, 254, 254, 0.95);
  border: 1rpx solid #cfcfcf;
  border-radius: 9rpx; */
}
.backTop image {
  width: 84rpx;
  height: 90rpx;
  display: block;
   /* border-radius: 100rpx; */
  /* margin: 0 auto; */
  /* padding-top: 14rpx; */
}
.backTop text {
  font-size: 20rpx;
  color: #2f2f30;
  display: block;
  text-align: center;
  padding-top: 8rpx;
}
.activity_enter image {
  width: 142rpx;
  height: 133rpx;
  position: fixed;
  right: 20rpx;
  bottom: 210rpx;
}
.navigator-hover {
  background: none;
}
.categoryList {
  margin-top: 88rpx;
  background: #fff;
  padding-right: 20rpx;
}
.categoryFixed {
  position: fixed;
  left: 0;
  top: -20rpx;
  z-index: 88;
  width: 100%;
}
.Supplier_hotline {
  position: relative;
}
.Supplier_hotline image {
  width: 750rpx;
  height: 495rpx;
  display: block;
}
.Supplier_hotline .supplierImg {
  height: 387rpx;
  margin: 20rpx 0;
}
.Supplier_hotline .call_btn {
  width: 179rpx;
  height: 47rpx;
  position: absolute;
  top: 163rpx;
  right: 58rpx;
  display: block;
}
.Supplier_hotline .call_btn_two {
  top: 281rpx;
}
.Supplier_hotline .call_btn_three {
  top: 401rpx;
}
.Supplier_hotline .call_btn_four {
  top: 786rpx;
}
.categoryStatus .wux-grid__thumb {
  width: 90rpx;
  height: 90rpx;
  /* border-radius: 100rpx; */
}

.categoryStatus .wux-grid__label {
  color: #666;
  font-size: 24rpx;
  margin-top: 10rpx;
}
.categoryStatus .wux-grid__inner {
  padding: 14rpx 20rpx;
}
.Supplier_hotline .boss_phone {
  height: 387rpx;
  margin-top: 20rpx;
}
.activity_icon {
  width: 98rpx;
  height: 122rpx;
  position: fixed;
  right: 20rpx;
  bottom: 250rpx;
}
.weui-loadmore image {
  width: 96rpx;
  height: 18rpx;
  display: block;
  margin: 0 auto;
  padding-top: 10rpx;
}

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
}
.festival_title image {
  width: 750rpx;
  height: 230rpx;
  display: block;
  margin: 0 auto;
}
.top_btn {
  width: 710rpx;
  height: 73rpx;
  background: linear-gradient(to right, #fccc66, #f79d36);
  border-radius: 45rpx;
  margin: 20rpx;
  line-height: 76rpx;
  color: #fff;
  font-size: 26rpx;
  text-indent: 24rpx;
  position: relative;
}
.top_btn .add_btn {
  width: 130rpx;
  height: 54rpx;
  background: #fff;
  border-radius: 30rpx;
  position: absolute;
  right: 20rpx;
  top: 10rpx;
  color: #f79d36;
  font-size: 25rpx;
  line-height: 56rpx;
  text-align: center;
  text-indent: 0;
}

.top_box {
  width: 750rpx;
  height: 82rpx;
  background: linear-gradient(to bottom, #fb6890, #fb777d);
  position: relative;
  padding-bottom: 30rpx;
}
.top_banner {
  position: relative;
}
.top_banner image {
  width: 457rpx;
  height: 28rpx;
  margin-left: 100rpx;
  display: block;
  padding-top: 41rpx;
}
.top_banner .ico_bt_btn {
  width: 250rpx;
  position: absolute;
  right: 0;
  font-size: 24rpx;
  top: 5rpx;
}
.top_banner .ico_bt_btn image {
  width: 24rpx;
  height: 21rpx;
  display: inline-block;
  padding-right: 10rpx;
  position: relative;
  top: 3rpx;
}
.top_shop {
  position: relative;
  /* margin-top: 20rpx; */
  padding-bottom: 50rpx;
}
.top_shop .shopContent {
  top: 4rpx;
  width: 383rpx;
}
.top_shop .shopContent .shopImg {
  width: 54rpx;
  height: 54rpx;
  border-radius: 100rpx;
}
.top_shop .shopContent .shopText {
  left: 88rpx;
  /* width: 275rpx; */
  top: 18rpx;
}
.top_shop .shopContent .shopName text {
  font-size: 28rpx;
  color: #666666;
  font-weight: normal;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  max-width: 275rpx;
}
.top_shop .categoryContent {
  position: absolute;
  /* right: 20rpx; */
  left: 15rpx;
  top: 0;
  width: 330rpx;
}
.top_shop .searchContent {
  /* width: 230rpx; */
  width: 600rpx;
  height: 68rpx;
  padding-left: 70rpx;
}
.top_shop .searchContent .searchImg {
  left: 270rpx;
  top: 22rpx;
}
.top_shop .searchContent text {
  text-align: center;
}
.seckillContent {
  width: 750rpx;
  background: #f2f2f2;
  position: relative;
}
.seckill_top {
  position: relative;
  height: 127rpx;
  padding: 23rpx 20rpx 0 20rpx;
  background: linear-gradient(to bottom, #fff, #f2f2f2);
}
.seckill_top text {
  display: block;
  font-size: 36rpx;
  color: #666666;
  font-weight: bold;
}

.seckill_top .seckill_status {
  font-size: 24rpx;
  color: #b3b3b5;
  font-weight: normal;
  position: relative;
  top: -8rpx;
  height: 35rpx;
  line-height: 32rpx;
}
.seckill_top .seckill_time {
  width: 116rpx;
  margin-left: 25rpx;
  text-align: center;
  display: inline-block;
}
.seckill_top .active text {
  color: #ec3e29;
}
.seckill_top .active .seckill_status {
  height: 35rpx;
  background: #ec3e29;
  color: #ffffff;
  border-radius: 17rpx;
}
.seckill_top image {
  width: 82rpx;
  height: 75rpx;
  display: block;
  position: absolute;
  left: 20rpx;
}
.seckill_top .seckill_box {
  /* position: absolute;
  left: 169rpx; */
  width: 80%;
  white-space: nowrap;
  padding-left: 20%;
}
.seckill_con {
  width: 100%;
  white-space: nowrap;
  height: 494rpx;
  overflow: hidden;
  padding-bottom: 6rpx;
}
.seckill_con .seckill_skuList {
  width: 325rpx;
  height: 480rpx;
  display: inline-block;
  background: linear-gradient(to bottom, #f2f2f2, #fff);
  margin-left: 20rpx;
  position: relative;
  border-radius: 14rpx;
}
.seckill_con .seckill_skuList .sku_info {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-left: 20rpx;
  padding-right: 20rpx;
}
.seckill_con .seckill_skuList image {
  width: 325rpx;
  height: 282rpx;
  border-radius: 14rpx 14rpx 0 0;
  position: relative;
}
.seckill_con .seckill_skuList text {
  color: #2f2f30;
  font-size: 26rpx;
}
.seckill_con .seckill_skuList .sku_info .sku_name {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 36rpx;
  height: 72rpx;
  display: block;
  text-overflow: -o-ellipsis-lastline;
}
.seckill_con .seckill_skuList .sku_spec {
  background: #f2f2f2;
  font-size: 22rpx;
  padding: 5rpx;
  border-radius: 8rpx;
  color: #9b9b9b;
  position: relative;
  top: -3rpx;
  overflow: hidden;
}
.seckill_con .seckill_skuList .price_content {
  position: absolute;
  left: 20rpx;
  bottom: 4rpx;
}
.seckill_con .seckill_skuList .goods_price {
  font-size: 32rpx;
  color: #ec3e29;
  display: inline-block;
  font-weight: bold;
}
.seckill_con .seckill_skuList .font_small {
  font-size: 30rpx;
  color: #ec3e29;
}
.seckill_con .seckill_skuList .original_price {
  font-size: 24rpx;
  color: #919194;
  text-decoration: line-through;
  display: inline-block;
  margin-left: 13rpx;
}
.seckill_con .seckill_skuList .sku_addCart {
  position: absolute;
  width: 59rpx;
  height: 59rpx;
  border-radius: 100rpx;
  background: #ec3e29;
  position: absolute;
  right: 10rpx;
  bottom: 13rpx;
}
.seckill_con .seckill_skuList .disbale_addCart {
  background: #9c9c9c;
}
.seckill_con .seckill_skuList .sku_addCart image {
  width: 36rpx;
  height: 34rpx;
  display: block;
  margin: 12rpx auto;
  border-radius: 0;
}
.seckill_con .seckill_skuList .mark_img {
  position: absolute;
  width: 325rpx;
  height: 282rpx;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 14rpx 14rpx 0 0;
}
.seckill_con .seckill_skuList .mark_bg {
  position: absolute;
  width: 325rpx;
  height: 42rpx;
  top: 242rpx;
  left: 0;
  background: rgba(247, 157, 54, 0.9);
}
.seckill_con .seckill_skuList .mark_bg text {
  color: #fff;
  font-size: 25rpx;
  display: block;
  text-align: center;
  line-height: 45rpx;
}
.seckill_con .seckill_skuList .mark_img text {
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  display: block;
  line-height: 325rpx;
}
.seckill_con .seckill_skuList .tags_jrbp image {
  width: 100rpx;
  height: 70rpx;
  position: absolute;
  left: 14rpx;
  top: 13rpx;
  overflow: hidden;
  background: none;
}

.seckill_con .seckill_skuList .tags_ys image,
.seckill_con .seckill_skuList .tags_xp image {
  width: 100rpx;
  height: 42rpx;
}
.timer_box {
  position: absolute;
  left: 180rpx;
  top: 0;
  width: 570rpx;
}
.timer_box text {
  display: block;
  font-size: 36rpx;
  color: #666;
}
.tips_img image {
  width: 390rpx;
  height: 399rpx;
  position: fixed;
  z-index: 9999;
  right: 30rpx;
  top: 14rpx;
}
.mark {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
}
.sku_box {
  padding-top: 115rpx;
}
.categoryName {
  height: 103rpx;
  width: 711rpx;
  margin: 0 auto
}
.hidePadding {
  padding-top: 0;
}
.festivalList {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/festiva_title.jpg)
    no-repeat;
  background-size: 100%;
}
.explosive_box {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/hot_title.jpg) no-repeat;
  background-size: 100%;
}
.categoryName image{width: 711rpx; height: 103rpx; margin: 0 auto}
/* .category_128 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_128.jpg?)
    no-repeat;
  background-size: 100%;
} */
/* .category_127 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_127.jpg?)
    no-repeat;
  background-size: 100%;
}
.category_129 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_129.jpg?)
    no-repeat;
  background-size: 100%;
}
.category_130 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_130.jpg?)
    no-repeat;
  background-size: 100%;
}
.category_131 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_131.jpg?)
    no-repeat;
  background-size: 100%;
}
.category_132 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_132.jpg?)
    no-repeat;
  background-size: 100%;
}
.category_134 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_134.jpg?)
    no-repeat;
  background-size: 100%;
}
.category_135 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_135.jpg?)
    no-repeat;
  background-size: 100%;
}
.category_136 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_136.jpg?)
    no-repeat;
  background-size: 100%;
}
.category_137 {
  background: url(https://hjl2c.dawangtv.cn/wxa_images/categoryx_137.jpg?)
    no-repeat;
  background-size: 100%;
} */
.categoryStatus {
  padding-bottom: 10rpx;
  background: #fff;
  margin-top: 20rpx;
  padding-top: 10rpx;
  width: 726rpx;
  margin-left: 12rpx;
  margin-right: 12px;
  border-radius: 20rpx;
}
.categoryStatus .wux-grids {
  background: none;
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
}
.categoryNoRecord {
  height: 300rpx;
  text-align: center;
  background: #fff;
  font-size: 28rpx;
  color: #999;
}
.categoryNoRecord image{
  width: 175rpx;
  height: 200rpx;
  margin: 0 auto;
  padding-top: 30rpx;
  display: block;
}
.categoryNoRecord text{
  display: block;
  position: relative;
  top: -10rpx
}
.publicHeight {
  height: 0;
}
</style>