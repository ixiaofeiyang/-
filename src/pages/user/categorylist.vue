<template>
    <view class="page ">

        <!--商品搜索-->
        <view class="categoryContent">
            <view class="searchContent" bindtap="go2searchList">
                <image src="../../images/search_img.png" class="searchImg"></image>
                <text>搜索商品</text>
            </view>
        </view>
        <view class="">
            <scroll-view class='nav_left ' scroll-y="true">
                <block wx:for="{{categoryList}}" wx:key="index">
                    <view class="nav_left_items {{curIndex==index?'active':''}}" bindtap="switchRightTab" data-index='{{index}}' data-id="{{item.id}}">{{item.name}}</view>
                </block>
            </scroll-view>
            <view class="nav_right ">
                <!--如果有数据，才遍历项-->
                <skeleton slector="skeleton" bgcolor="#fff" loading="spin" wx:if="{{showSkeleton}}"></skeleton>
                <view class="skeleton" wx:if="{{list.length>0}}">
                    <block wx:for="{{list}}" wx:key="index">
                        <view class="nav_right_items">
                            <navigator url="{{'/pages/user/goods?id=' + item.id}}" id="{{item.id}}">
                                <!--界面跳转 -->
                                <image src="{{fileserver+item.cateImg}}" class="cartImg skeleton-rect" mode="aspectFill"></image>
                                <!--已抢光(限量）-->
                                <view class="mark_img" wx:if="{{item.stock_status === 'empty'}}">
                                    <text>已抢光</text>
                                </view>
                                <block wx:else>
                                    <!--已结束（限时）-->
                                    <view class="mark_img" wx:if="{{item.start_status === 2}}">
                                        <text>已结束</text>
                                    </view>
                                </block>
                                <!--未开售-->
                                <block wx:if="{{item.start_status == 3}}">
                                    <view class="mark_bg">
                                        <text>{{item.full_start_time_str+'开售'}}</text>
                                    </view>
                                </block>
                                <view class="goods_info">
                                    <text class="goods_name  skeleton-rect">{{item.sku_name}}</text>
                                    <text class="goods_spec skeleton-rect" wx:if="{{item.sku_specification}}">{{item.sku_specification_show}}</text>
                                    <view class="priceContent">
                                        <viwe class="goods_price skeleton-rect">
                                            <text class="font_small ">¥</text>
                                            <text>{{item.price/100}}</text>
                                        </viwe>
                                        <text class="original_price  skeleton-rect">¥{{item.default_price/100}}</text>
                                    </view>
                                </view>
                            </navigator>
                            <block wx:if="{{showSkeleton}} ">
                                <view class="addCart skeleton-radius" data-id="{{item.id}}">
                                    <image src="../../images/ico_carts.png"></image>
                                </view>
                            </block>
                            <block wx:if="{{item.start_status == 3}}">
                                <view class="addCart addCart_disabled" data-id="{{item.id}}">
                                    <image src="../../images/ico_carts.png"></image>
                                </view>
                            </block>

                            <block wx:if="{{item.start_status == 1}}">
                                <block wx:if="{{item.stock_status == 'empty'}}">
                                    <view class="addCart addCart_disabled" data-id="{{item.id}}">
                                        <image src="../../images/ico_carts.png"></image>
                                    </view>
                                </block>
                                <block wx:else>
                                    <view class="addCart " data-id="{{item.id}}" catchtap="addToCart">
                                        <image src="../../images/ico_carts.png"></image>
                                    </view>
                                </block>
                            </block>
                            <block wx:if="{{item.start_status == 2}}">
                                <view class="addCart addCart_disabled" data-id="{{item.id}}">
                                    <image src="../../images/ico_carts.png"></image>
                                </view>
                            </block>
                        </view>

                    </block>
                    <!--请求中的loading-->
                    <view class="weui-loadmore" wx:if="{{isLoading}}">
                        <view class="weui-loadmore__tips weui-loadmore__tips_in-line">
                            <image src="../../images/loading_w.gif"></image>
                        </view>
                    </view>
                </view>
                <!--如果无数据，则显示数据-->
                <view class="nocate" wx:if="{{list.length==0}}">
                    <text>{{showText}}</text>
                </view>
                <!--加载更多-->
                <view class="weui-loadmore weui-loadmore_line" wx:if="{{ noMoreData }}">
                    <view class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多数据</view>
                </view>

            </view>
        </view>

        <!--用户信息授权-->
        <getuserinfo></getuserinfo>
        <!--遮罩层-->
        <view class="mask" catchtouchmove="true" wx:if="{{mask}}"></view>
        <!--自定义loading-->
        <view class="shade-loading" wx:if="{{isShowLoading}}">
            <!-- <image class="loading-icon" src="../../images/loading-icon.gif"></image> -->
            <wux-spin nested wux-class="spin" size="default" tip="加载中..." />
        </view>

    </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import moment from "moment";
import getuserinfo from "../../components/getuserinfo";
import ShopcartMixin from "../base/shopcart";
export default class Index extends auth {
  config = {
    navigationBarTitleText: "商品分类",
    usingComponents: {
      skeleton: "../../plugin/wux/skeleton/skeleton",
      "wux-spin": "../../plugin/wux/spin/index"
    }
  };
  mixins = [ShopcartMixin];
  components = {
    getuserinfo: getuserinfo
  };

  data = {
    fileserver: `${api.uploadimgFile}`, //上传图片域名
    needUserinfo: false, // 是否显示授权
    noMoreData: false, // 没有更多数据
    isLoading: false, // 是否在加载中
    page: 0, // 页数给予默认值1
    sizeIndx: 999999, //每页只显示10条数据
    allPages: 0, //总页数
    categoryList: [
      { name: "今日爆品", id: null },
      { name: "新鲜果园", id: 128 },
      { name: "蔬菜蛋品", id: 129 },
      { name: "肉禽鱼虾", id: 127 },
      { name: "低温食品", id: 130 },
      { name: "粮油调味", id: 131 },
      { name: "零食冲调", id: 134 },
      { name: "酒水乳饮", id: 135 },
      { name: "清洁护理", id: 132 },
      { name: "居家用品", id: 136 },
      { name: "纺织穿戴", id: 137 }
    ],
    goodsList: [],
    curNav: 1,
    curIndex: 0,
    listPage: 2,
    newGoodsList: [],
    cartDatas: null,
    list: [
      { id: 1, sku_name: "商品名称", sku_specification: "商品的规格规格" },
      { id: 2, sku_name: "商品名称", sku_specification: "商品的规格规格" },
      { id: 3, sku_name: "商品名称", sku_specification: "商品的规格规格" },
      { id: 4, sku_name: "商品名称", sku_specification: "商品的规格规格" },
      { id: 5, sku_name: "商品名称", sku_specification: "商品的规格规格" },
      { id: 6, sku_name: "商品名称", sku_specification: "商品的规格规格" }
    ],
    categoryid: null,
    showText: "",
    mask: false,
    explosiveList: [],
    isShowLoading: false,
    showSkeleton: true //骨架屏显示隐藏
  };
  async onLoad(options) {
    let result = await super.onLoad(options);
    this.needUserinfo = this.$parent.globalData.needUserinfo;
    this.categoryid = options.categoryid;
    this.getExplosiveList();

    this.getCategoryList(0);
    // 选中
    this.categoryList = this.categoryList || [];
    this.categoryList.map((item, index) => {
      if (item.id == this.categoryid) {
        this.curIndex = index;
      }
    });
    this.$apply();
  }
  async onShow() {
    console.log("into goods onshow function");
    this.cartDatas = wx.getStorageSync("oldCart");
    this.updateCart();
    this.$apply();
  }
  async onPullDownRefresh() {
    this.getExplosiveList();
    this.getCategoryList(0);
    wepy.stopPullDownRefresh();
  }
  //获取今日爆品分类
  async getExplosiveList() {
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/b2c/sku/listByTag?tags=explosive`
    );
    if (resultList.state !== "error") {
      this.explosiveList = this.setGoodsItem(resultList.rows) || [];
    }
    this.explosiveList.map((item, index) => {
      if (!!item.photos) {
        item["cateImg"] = item.photos.split(",")[0];
      }
      if (!!item.sku_specification) {
        try {
          let t = JSON.parse(item.sku_specification);
          item.sku_specification = t["规格"];
        } catch (ex) {}
        item.sku_specification_show = "";
        if (item.sku_specification) {
          item.sku_specification_show =
            item.sku_specification.length > 10
              ? item.sku_specification.substring(0, 10) + "..."
              : item.sku_specification;
        }
      }
    });
    if (this.categoryid) return;

    this.newGoodsList = [];
    this.list = [];

    this.explosiveList.map((item, index) => {
      this.newGoodsList.push(item);
    });

    this.showSkeleton = false;
    this.newGoodsList.map((item, index) => {
      if (index < 10) {
        this.list.push(item);
      }
    });

    // this.refreshCartAmountInGoodList();
    this.$apply();
  }

  async getCategoryList(pageIndex) {
    // wx.showLoading({ title: "加载中", mask: true });
    this.mask = true;
    this.isShowLoading = true;
    this.$apply();
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/b2c/sku/list?page=${pageIndex}&size=${
        this.sizeIndx
      }`
    );
    // wx.hideLoading();
    this.isShowLoading = false;
    this.mask = false;
    this.$apply();
    this.showText = "该分类暂无数据";

    if (resultList.state !== "error") {
      this.goodsList = resultList.rows;
      this.goodsList = this.setGoodsItem(this.goodsList) || [];

      this.goodsList.map(item => {
        if (!!item.photos) {
          item["cateImg"] = item.photos.split(",")[0];
        }
        if (!!item.sku_specification) {
          try {
            let t = JSON.parse(item.sku_specification);
            item.sku_specification = t["规格"];
          } catch (ex) {}
          item.sku_specification_show = "";
          if (item.sku_specification) {
            item.sku_specification_show =
              item.sku_specification.length > 10
                ? item.sku_specification.substring(0, 10) + "..."
                : item.sku_specification;
          }
        }
      });
    }
    if (!this.categoryid) return;
    this.newGoodsList = [];
    this.list = [];

    this.goodsList.map((item, index) => {
      if (item.categoryid_l2 == this.categoryid) {
        this.newGoodsList.push(item);
      }
    });

    this.showSkeleton = false;

    this.newGoodsList.map((item, index) => {
      if (index < 10) {
        this.list.push(item);
      }
    });

    console.log(this.newGoodsList, "this.newGoodsList");

    this.$apply();
  }
  setGoodsItem(_goodsList) {
    let goodsList = _goodsList || [];
    let _now = this.getNow();
    goodsList.map(item => {
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
        item.full_start_time_str = start_time.format("HH:mm"); //预售时间
      } else {
        if (item.stock_available < 1) {
          item.stock_status = "empty";
        } else {
          item.stock_status = "full";
        }
        item.start_status = 1; //总是进行中
      }
    });
    return goodsList;
  }
  getNow() {
    return moment();
  }
  async onReachBottom() {
    console.log("滑动到底部了");
    if (this.newGoodsList.length > this.list.length) {
      this.mask = true;
      this.isLoading = true;
      await this.getMoreList();
      this.mask = false;
      this.$apply();
    }
  }
  getMoreList() {
    this.list = [];

    let listPage =
      this.listPage * 10 > this.newGoodsList.length
        ? this.newGoodsList.length
        : this.listPage * 10;
    for (var i = 0, len = this.newGoodsList.length; i < listPage; i++) {
      this.list.push(this.newGoodsList[i]);
    }
    this.listPage++;
    if (this.newGoodsList.length > this.list.length) {
    } else {
      this.isLoading = false;
      this.noMoreData = true;
    }
    this.$apply();
  }
  /**
   * 加入购物车
   * */
  async addToCart(e) {
    wx.aldstat.sendEvent("商品分类页加入购物车点击", {});
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
    this.setCartBadgeNum();
    this.$apply();
  }
  methods = {
    go2searchList() {
      wx.navigateTo({ url: "/pages/user/searchlist" });
    },
    go2goods(e) {
      let id = e.currentTarget.id;
      console.log(e);
      wx.navigateTo({ url: `/pages/user/goods?id=${id}` });
    },
    switchRightTab(e) {
      let that = this;
      this.noMoreData = false;
      let id = e.target.dataset.id,
        index = e.target.dataset.index;
      (that.curNav = id), (that.curIndex = index);

      this.newGoodsList = [];
      this.list = [];
      this.categoryid = id;
      this.goodsList = this.goodsList || [];
      if (index == 0) {
        this.newGoodsList = this.explosiveList;
      } else {
        this.goodsList.map(item => {
          if (item.categoryid_l2 == id) {
            this.newGoodsList.push(item);
          }
        });
      }

      this.newGoodsList.map((item, index) => {
        if (index < 10) {
          this.list.push(item);
        }
      });
      if (this.list.length < 10 && this.list.length > 0) {
        this.noMoreData = true;
      }
      console.log(this.list, "this.list");
      this.$apply();
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
      });
    }
  };
}
</script>
<style>
page {
  background-color: #fff;
  width: 100%;
  overflow-x: hidden;
}
.container {
  width: 100%;
  height: 100%;
}
.nav_left {
  width: 183rpx;
  height: 1000rpx;
  /* background: #f2f2f2; */
  text-align: center;
  position: fixed;
  top: 151rpx;
  left: 0;
  z-index: 88;
}
.nav_left .nav_left_items {
  height: 86rpx;
  line-height: 86rpx;
  font-size: 30rpx;
  color: #969699;
  background: #f2f2f2;
  /* border-bottom: solid 1rpx #e6e6e6; */
}
.nav_left .nav_left_items.active {
  position: relative;
  background: #fff;
  color: #fb6890
}
.nav_left .nav_left_items.active::before {
  display: inline-block;
  width: 6rpx;
  height: 50rpx;
  background:#fb6890;
  content: "";
  position: absolute;
  top: 23rpx;
  left: 0;
}
.nav_right {
  margin-top: 151rpx;
  margin-left: 208rpx;
  height: 100%;
}

.nav_right .nav_right_items {
  width: 527rpx;
  /* margin-left: 20rpx; */
  position: relative;
  border-bottom: solid 1rpx #f4f4f4;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
}

.nav_right .nav_right_items image {
  width: 183rpx;
  height: 159rpx;
  display: inline-block;
  margin-right: 20rpx;
  overflow: hidden;
  position: relative;
  background: #f2f2f2;
}
.nav_right .nav_right_items .mark_img {
  position: absolute;
  width: 183rpx;
  height: 159rpx;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}
.nav_right .nav_right_items .mark_bg {
  position: absolute;
  width: 183rpx;
  height: 42rpx;
  top: 117rpx;
  left: 0;
  background: rgba(247, 157, 54, 0.9);
}
.nav_right .nav_right_items .mark_bg text {
  color: #fff;
  font-size: 25rpx;
  display: block;
  text-align: center;
  line-height: 45rpx;
}
.nav_right .nav_right_items .mark_img text {
  color: #fff;
  font-size: 24rpx;
  text-align: center;
  display: block;
  line-height: 166rpx;
}
.nocate {
  width: 567rpx;
  text-align: center;
  padding-top: 400rpx;
}

.nocate text {
  font-size: 28rpx;
  display: block;
  color: #bbb;
  text-align: center;
}
.categoryContent {
  /* height: 438rpx; */
  background: #fefefe;
  position: fixed;
  width: 100%;
  height: 116rpx;
  overflow: hidden;
  z-index: 66;
  top: 0;
  left: 0;
}
.searchContent {
  width: 680rpx;
  height: 74rpx;
  background: #f2f2f2;
  border-radius: 100rpx;
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  padding-left: 30rpx;
}
.searchContent text {
  font-size: 28rpx;
  color: #9c9c9c;
  text-align: center;
  display: block;
  line-height: 74rpx;
}
.searchContent .searchImg {
  width: 34rpx;
  height: 33rpx;
  position: absolute;
  top: 20rpx;
  left: 265rpx;
}
.nav_right .nav_right_items .goods_info {
  /* position: absolute;
		left: 220rpx;
		top: 22rpx; */
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  position: relative;
}
.nav_right .nav_right_items .goods_name {
  font-size: 26rpx;
  color: #2f2f30;
  font-weight: bold;
  display: block;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 36rpx;
}
.nav_right .nav_right_items .goods_spec {
  font-size: 22rpx;
  color: #9b9b9b;
  background: #f2f2f2;
  border-radius: 8rpx;
  padding: 6rpx;
  position: relative;
  top: -4rpx;
}
.priceContent {
  position: relative;
  bottom: 0;
}
.nav_right .nav_right_items .goods_price {
  font-size: 42rpx;
  color: #ec3e29;
  display: inline-block;
}
.nav_right .nav_right_items .font_small {
  font-size: 26rpx;
}
.nav_right .nav_right_items .original_price {
  font-size: 26rpx;
  color: #919194;
  text-decoration: line-through;
  margin-left: 18rpx;
  display: inline-block;
  margin-top: 4rpx;
}
.addCart {
  width: 64rpx;
  height: 64rpx;
  background: #fb6890;
  position: absolute;
  top: 50%;
  right: 10rpx;
  border-radius: 100rpx;
}
.nav_right .nav_right_items .addCart image {
  width: 36rpx;
  height: 34rpx;
  display: block;
  margin: 15rpx auto;
  background: none;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.navigator-hover {
  background: none;
}
.nav_right_items navigator {
  width: 507rpx;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
.addCart_disabled {
  background: #9c9c9c;
}
.weui-loadmore image {
  width: 96rpx;
  height: 18rpx;
  display: block;
  margin: 0 auto;
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
}
.page .weui-loadmore__tips_in-line {
  background: #fff;
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
</style>