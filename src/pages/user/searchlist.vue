<template>
    <view class="page">
        <!--搜索input组件-->
        <view class="search_input">
            <wux-search-bar clear bind:confirm="onConfirm" bind:clear="onClear" placeholder="请输入商品名称" inputValue="{{inputValue}}" setInputFocus="{{setInputFocus}}" cancelText="搜索" bind:cancel="onConfirm" />
        </view>
        <!--热门搜索-->
        <view class="hot_context" wx:if="{{isShow}}">
            <view class="hot_title">
                <text>热门搜索</text>
                <text wx:if="{{false}}">换一批</text>
            </view>
            <view class="hot_search">
                <text wx:for="{{searchList}}" wx:key="item" data-keyword="{{item}}" bindtap="searchHistroy">{{item}}</text>
            </view>
        </view>
        <!--搜索历史记录-->
        <view class="history_search" wx:if="{{isShow}}">
            <view class="history_title">
                <text>历史记录</text>
                <text bindtap="clearHistroy">清空历史记录</text>
            </view>
            <view class="history_context">
                <text wx:for="{{keyWord}}" wx:key="item" data-keyword="{{item}}" bindtap="searchHistroy">{{item}}</text>
            </view>
        </view>
        <!--搜索商品列表-->
        <view class="goodsContent" wx:if="{{isGoodsList}}">
            <repeat for="{{goodsList}}" key="index" index="index" item="item">
                <skuitem :item="item" v-on:add2CartItem="add2CartItem" v-on:cartNumDownItem="cartNumDownItem" v-on:cartNumUpItem="cartNumUpItem">
                </skuitem>
            </repeat>
            <!--加载更多-->
            <view class="weui-loadmore weui-loadmore_line" wx:if="{{ noMoreData }}">
                <view class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多数据</view>
            </view>
            <!--请求中的loading-->
            <view class="weui-loadmore weui-loadmore_line" wx:if="{{ isLoading }}">
                <view class="weui-loadmore__tips weui-loadmore__tips_in-line">正在加载中</view>
            </view>
            <!--没有记录-->
            <view class="weui-loadmore weui-loadmore_line" wx:if="{{goodsList.length === 0}}">
                <view class="weui-loadmore__tips weui-loadmore__tips_in-line">抱歉没有搜索“{{_sku_name}}”的相关商品</view>
            </view>
        </view>
        <!--用户信息授权-->
        <getuserinfo></getuserinfo>
    </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import util from "../../util/util";
import skuitem from "../../components/skuitem";
import ShopcartMixin from "../base/shopcart";
import getuserinfo from "../../components/getuserinfo";
import moment from "moment";
import log from "../../util/log";
export default class Searchlist extends wepy.page {
  config = {
    navigationBarTitleText: "乐乐购",
    enablePullDownRefresh: false,
    usingComponents: {
      "wux-search-bar": "../../plugin/wux/search-bar/index"
    }
  };
  components = {
    skuitem: skuitem,
    getuserinfo: getuserinfo
  };

  mixins = [ShopcartMixin];
  data = {
    needUserinfo: false, // 是否显示授权
    fileserver: `${api.uploadimgFile}`,
    noMoreData: false, // 没有更多数据
    isLoading: false, // 是否在加载中
    page: 0, // 页数给予默认值1
    sizeIndx: 10, //每页只显示10条数据
    allPages: 0,
    number: 1,
    goodsList: [], //商品列表数据
    isShopkeeper: false,
    cartDatas: {},
    checkNeedLoginDone: false,
    isGoodsList: false,
    _sku_name: "",
    loaclKeyWork: [],
    keyWord: [],
    isShow: true,
    isHaveGoods: false,
    inputValue: "",
    setInputFocus: true,
    searchList: {}
  };

  async onLoad(options) {
    let result = await super.onLoad(options);
    this.getSearchList();
    this.loaclKeyWork = wx.getStorageSync("loaclKeyWork") || [];
    this.keyWord = this.loaclKeyWork.reverse();
    this.$apply();
  }

  async onShow() {
    this.refreshCartAmountInGoodList({ force: true });
    this.$apply();
  }

  async onPullDownRefresh() {
    this.checkNeedLoginDone = true;
    this.page = 0;
    await this.reload();
    wepy.stopPullDownRefresh();
  }
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
    await this.getGoodsList(this.page, false);

    // 开始结束后设置 isLoading 为 false
    this.isLoading = false;
    this.$apply();
  }
  // 重新加载
  async reload() {
    this.noMoreData = false;
    this.page = 0;
    return await this.getGoodsList(this.page, true);
  }
  //获取热门搜索
  async getSearchList() {
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/util/getdata?key=sku_list_hot_key`
    );
    if (resultList.state !== "error") {
      this.searchList = resultList.data.split(",");
    }
    this.$apply();
  }

  //获取商品列表
  getNow() {
    return moment();
  }
  //获取skulist
  async getGoodsList(pageIndex) {
    this.isGoodsList = true;
    this.isShow = false;
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/b2c/sku/list?page=${pageIndex}&size=${
        this.sizeIndx
      }&_sku_name=${this._sku_name}`
    );
    log.info("searchList result", resultList);
    this.allPages = Math.ceil(resultList.count / this.sizeIndx);
    if (resultList.state == "error") return;

    if (pageIndex == 0) {
      this.goodsList = resultList.rows;
    } else {
      //加载更多
      this.goodsList = this.goodsList.concat(resultList.rows);
    }
    if (this.allPages === pageIndex + 1) {
      this.noMoreData = true;
    }
    let _now = this.getNow();
    this.goodsList.map(item => {
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
        item.end_time_str = start_time.add(1, "days").format("YYYY-MM-DD"); //提货时间
      } else {
        if (item.stock_available < 1) {
          item.stock_status = "empty";
        } else {
          item.stock_status = "full";
        }

        item.start_status = 1; //总是进行中
        item.start_time_str = moment(_now).format("YYYY-MM-DD"); //预售时间
        item.end_time_str = moment(_now)
          .add(1, "days")
          .format("YYYY-MM-DD"); //提货时间
      }
    });
    console.log(this.goodsList, "this is  this.goodsList");
    this.refreshCartAmountInGoodList();
  }

  refreshCartAmountInGoodList(options) {
    let cartDatas = this.cartDatas || wx.getStorageSync("oldCart");
    if (!!options && options.force) {
      this.cartDatas = wx.getStorageSync("oldCart");
      cartDatas = this.cartDatas;
    }
    console.log("in refreshCartAmountInGoodList , cart is ", cartDatas);
    if (this.goodsList.length > 0 && cartDatas) {
      this.goodsList.map(item => {
        item["cartAmount"] = "";
        item["cartId"] = "";
        let iitem = cartDatas[item.id];
        if (!!iitem) {
          item["cartAmount"] = iitem.amount;
          item["cartId"] = item.id;
        }
      });
    }
    this.$apply();
  }

  updateCart() {
    // 将购物车的id和amount存入缓存  和 首页匹配
    this.setCartBadgeNum();
    this.refreshCartAmountInGoodList();
    this.$parent.globalData.isAdding = false;
    this.$apply();
  }
  onConfirm(event) {
    wx.aldstat.sendEvent("搜索按钮点击", {});
    this._sku_name = event.detail.value;

    if (this._sku_name) {
      // 搜索过的关键词存入缓存
      let keyWord = [];

      if (this.loaclKeyWork.length > 0) {
        this.loaclKeyWork.map(item => {
          if (this._sku_name !== item) {
            keyWord.push(item);
          }
        });
      }
      keyWord.push(this._sku_name);
      this.loaclKeyWork = keyWord;
      wx.setStorageSync("loaclKeyWork", keyWord);
      this.keyWord = wx.getStorageSync("loaclKeyWork").reverse();

      this.isGoodsList = true;
      this.getGoodsList(0);
      this.$apply();
    } else {
      this.isGoodsList = false;
      this.isShow = true;
    }
  }
  methods = {
    add2CartItem(e) {
      this.add2CartAction(e);
    },
    cartNumDownItem(e) {
      this.cartNumDownAction(e);
    },
    cartNumUpItem(e) {
      this.cartNumUpAction(e);
    },
    // 历史搜索
    searchHistroy(e) {
         wx.aldstat.sendEvent("热门搜索词点击", {});
      this._sku_name = e.target.dataset.keyword;
      console.log(this._sku_name);
      this.getGoodsList(0);
      this.inputValue = this._sku_name;
    },
    // 清空历史搜索
    clearHistroy() {
      wx.setStorageSync("loaclKeyWork", []);
      this.keyWord = this.loaclKeyWork = [];
      wx.showToast({
        title: "已清空",
        icon: "none",
        duration: 2000
      });
      this.$apply();
    },

    onClear() {
      this.goodsList = [];
      this.isShow = true;
      this.isGoodsList = false;
      this.inputValue = "";
    }
  };
}
</script>
<style>
page {
  background: #fff;
}
.search_input {
  font-size: 32rpx;
}
.search_input input {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  color: #9c9c9c;
  position: absolute;
  left: 76rpx;
  width: 487rpx;
  padding-top: 18rpx;
}
.history_title,
.hot_title {
  font-size: 26rpx;
  color: #2f2f30;
  width: 710rpx;
  margin: 20rpx auto 0 auto;
  position: relative;
  font-weight: bold;
}

.history_title text:nth-child(2),
.hot_title text:nth-child(2) {
  position: absolute;
  right: 0;
  font-size: 24rpx;
  color: #666;
  font-weight: normal;
}
.history_context {
  width: 710rpx;
  margin: 0 auto;
}
.hot_context {
  margin-top: 40rpx;
  margin-bottom: 40rpx;
}
.hot_context:after {
  content: ".";
  width: 0;
  height: 0;
  visibility: hidden;
  display: block;
  clear: both;
  overflow: hidden;
}
.goodsContent {
  width: 750rpx;
  overflow-x: hidden;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  background: #f2f2f2;
}
.history_search {
  position: relative;
  z-index: 99;
}
.hot_search text,
.history_context text {
  background: #f2f2f2;
  border-radius: 6rpx;
  padding: 12rpx;
  display: block;
  float: left;
  margin-right: 20rpx;
  margin-top: 30rpx;
  font-size: 26rpx;
  color: #333333;
  line-height: 26rpx;
}
.hot_search {
  width: 710rpx;
  margin: 0 auto;
}
.search_input .wux-search-bar {
  background: #fff;
  padding-top: 20rpx;
}
.search_input .wux-search-bar__label {
  background: #eee;
  height: 80rpx;
  line-height: 80rpx;
}
.search_input .wux-search-bar__cancel {
  line-height: 80rpx;
  color: #2f2f30;
  height: 80rpx;
  font-size: 28rpx;
}
.search_input .wux-search-bar__form {
  height: 80rpx;
  border-radius: 100rpx;
  background: #eee;
}
.search_input .wux-search-bar__input {
  height: 80rpx;
}
.search_input .wux-search-bar__search {
  position: absolute;
  left: 31rpx;
  top: 26rpx;
}
.search_input .wux-search-bar__clear {
  display: none;
  position: absolute;
  top: 26rpx;
  right: 0rpx;
  padding: 0 30rpx;
  z-index: -1;
}
.search_input .wux-search-bar__text {
  display: inline-block;
  font-size: 28rpx;
  vertical-align: middle;
  margin-left: 10rpx;
  padding-top: 2rpx;
}
</style>