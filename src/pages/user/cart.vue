<template>
  <view class="page">
    <view class="page__bd">
      <!--购物车暂无商品提示-->
      <view class="no-cart-tips"
            wx:if="{{cartList2.length <= 0}}">
        <!-- <view class="topContent">
          <image src="../../images/banner_img2.png"
                 class="bannerImg"></image>
        </view> -->
        <view class="{{cartIcon?'pt_30':''}}">
          <image src="../../images/ico-cart.png"
                 class="icon-cart" />
          <text>去添加点什么吧</text>
        </view>
      </view>

      <view class="topContent"
            wx:if="{{cartList2.length > 0}}">
        <!-- <image src="../../images/banner_img2.png"
               class="bannerImg"></image> -->
        <text class="editCart"
              bindtap="cartEdit">{{cartEditText}}</text>
      </view>
      <view class="cartContent_bg"
            wx:if="{{cartList2.length > 0}}"></view>
      <!--购物车商品列表-->
      <view class="cartContent">
        <view wx:if="{{cartList2.length > 0}}">
          <view class="cartList"
                wx:for="{{cartList2}}"
                wx:key="id"
                wx:if="{{item.amount > 0 }}">
            <view class="checkbox  {{item.checked ? 'checked' : ''}}"
                  bindtap="checkedItem"
                  data-id="{{item.id}}"
                  data-item-index="{{index}}"></view>
            <image src="{{fileserver+item.cartImg}}"
                   class="cartImg"
                   mode="aspectFill"></image>
            <view class="goods_info">
              <text class="goods_name">{{item.Sku.sku_name}}</text>
              <text class="goods_spec"
                    wx:if="{{item.Sku.sku_specification}}">{{item.Sku.sku_specification_show}}</text>
              <view class="priceContent">
                <text class="goods_price">
                  <text class="font_small">¥</text>{{item.Sku.price/100}}</text>
                <text class="original_price">¥{{item.Sku.default_price/100}}</text>
              </view>
            </view>
            <view class="choose_num">
              <image data-id="{{item.Sku.id}}"
                     bindtap="cartNumDown"
                     src="../../images/down_img.png"></image>
              <input value="{{item.amount}}"
                     class="number"
                     disabled="true"
                     type="number" />
              <image data-id="{{item.Sku.id}}"
                     bindtap="cartNumUp"
                     src="../../images/up_img.png"></image>
            </view>
          </view>
        </view>
        <!--购物车失效商品列表-->
        <view class="cartList_disbale"
              wx:if="{{cartListInvalid.length > 0}}">
          <view class="cartList_title">
            <text class="title_fl">已失效商品 ({{cartListInvalid.length}})</text>
            <text class="title_rl"
                  bindtap="delInvalid">删除已失效物品</text>
          </view>
          <view class="cartList"
                wx:for="{{cartListInvalid}}"
                wx:key="id">
            <view class="checkbox">失效</view>
            <image src="{{fileserver+item.cartImg}}"
                   class="cartImg"
                   mode="aspectFill"></image>
            <view class="goods_info">
              <text class="goods_name">{{item.Sku.sku_name}}</text>
              <text class="goods_spec"
                    wx:if="{{item.Sku.sku_specification}}">{{item.Sku.sku_specification_show}}</text>
              <view class="priceContent">
                <text class="goods_price"><text class="font_small">¥</text>{{item.Sku.price/100}}</text>
                <text class="original_price">¥{{item.Sku.default_price/100}}</text>
              </view>
            </view>
            <view class="choose_num"><text>{{item.amount}}</text></view>
          </view>
        </view>
        <view class="explosive-content clearfloat" wx:if="{{explosiveList.length > 0}}">
          <view class="explosive_title">爆品推荐</view>
          <view class="explosiveList" wx:for="{{explosiveList}}" wx:key="index">
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
        <!--底部 全选 总价 下单按钮-->
        <view class="cart-bottom">
          <view class="checkbox {{checkedAllStatus ? 'checked' : ''}}"
                bindtap="checkedAll">全选</view>
          <view class="total">合计:
            <!-- <text class="red">¥{{totalPrice/100}}</text> -->
            <text class="font_small">¥</text>
            <text class="font_big">{{totalPrice/100}}</text>
          </view>
          <view class="checkout"
                bindtap="deleteCart"
                wx:if="{{isEditCart}}">删除所选</view>
          <view class="checkout"
                bindtap="go2checkoutOrder"
                wx:if="{{!isEditCart}}">结算</view>
        </view>
      </view>

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
                tip="加载中..." />
    </view>

    <!--下单时商品确认提示-->
    <confirm :confirmData.sync="confirmData"></confirm>
     <!--用户信息授权-->
    <getuserinfo></getuserinfo>
  </view>
</template>
<script>
if (!Object.values) Object.values = o => Object.keys(o).map(k => o[k]);
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import moment from "moment";
import getuserinfo from "../../components/getuserinfo";
import log from "../../util/log";
import confirm from "../../components/confirm";
import Check23clockMixin from "../base/check23clock";
import ShopcartMixin from "../base/shopcart";
export default class Cart extends auth {
  config = {
    navigationBarTitleText: "购物车",
    usingComponents: {
      "wux-spin": "../../plugin/wux/spin/index"
    }
  };
  components = {
    confirm: confirm,
    getuserinfo: getuserinfo
  };
  mixins = [Check23clockMixin, ShopcartMixin];
  data = {
    needUserinfo: false, // 是否显示授权
    skuIds: null,
    shopId: null,
    cartIds: null,
    isEditCart: false,
    cartEditText: "编辑",
    checkedAllStatus: false,
    allPages: "", // 总页数
    currentPage: 0, // 当前页数  默认是0
    sizeIndx: 99999, //每页只显示10条数据
    loadMoreData: "加载更多……",
    hideBottom: true, //隐藏加载更多
    number: 1,
    totalPrice: 0, //合计总价格
    cartList: [],
    cartList2: [],
    isShowLoading: false,
    mask: false,
    fileserver: `${api.uploadimgFile}`, //上传图片域名
    confirmData: {}, //弹框数据
    explosiveList: [],
    cartListInvalid: [],
    cartIcon: true
  };

  async onLoad(options) {
    let result = await super.onLoad(options);
    this.shopid = this.$parent.globalData.shopInfo
      ? this.$parent.globalData.shopInfo.id
      : "";

    this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};
    this.getExplosiveList();
  }

  async onShow() {
    // wx.showLoading({ title: "购物车正在更新" });
    this.mask = true;
    this.isShowLoading = true;
    this.$apply();
    console.log(
      this.$parent.globalData.isSavingCart,
      "this.$parent.globalData.isSavingCart"
    );
    // 处理 先保存成功购物车后在拉取 购物车数据
    clearInterval(this.timer);
    this.timer = setInterval(async () => {
      if (!this.$parent.globalData.isSavingCart) {
        clearInterval(this.timer);
        await this.getMyCartList(0);
        // wx.hideLoading();
        this.isShowLoading = false;
        this.mask = false;
        this.$apply();
      }
    }, 50);

    this.$apply();
  }
  /**
   * 获取店铺列表
   * @param pageIndex 当前页数
   * */
  async getMyCartList(pageIndex) {
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/b2c/cart/mylist?page=${pageIndex}&size=${
      this.sizeIndx
      }`
    );

    this.allPages = Math.ceil(resultList.count / this.sizeIndx);
    if (resultList.state == "error") {
      return;
    }
    if (pageIndex == 0) {
      this.cartList = resultList.rows;
      if (this.cartList.length > 0) {
        this.cartList.map(item => {
          if (!!item.Sku && !!item.Sku.photos) {
            item["cartImg"] = item.Sku.photos.split(",")[0];
          }
        });
      }
      this.currentPage = 1;
    } else {
      //加载更多
      console.log("加载更多");
      let tempArray = this.cartList;
      tempArray = tempArray.concat(resultList.rows);
      this.allPages = resultList.count;
      this.cartList = tempArray;
      this.hideBottom = true;
    }
    let cartDatas = {};
    // 默认选中状态
    if (this.cartList.length > 0) {
      this.cartList.map(item => {
        console.log("item. is ", item);
        if (!!item.Sku) {
          try {
            let t = JSON.parse(item.Sku.sku_specification);
            item.Sku.sku_specification = t["规格"];
          } catch (ex) { }
          if (!!item.Sku.sku_specification) {
            item.Sku.sku_specification_show =
              item.Sku.sku_specification.length > 10
                ? item.Sku.sku_specification.substring(0, 10) + "..."
                : item.Sku.sku_specification;
          }
          if (item.amount !== undefined && item.amount > 0)
            cartDatas[item.Sku.id] = Object.assign(item, { checked: true });
        }
        //item["checked"] = true;
      });
    }
    this.isEditCart = false;
    this.checkedAllStatus = true;
    this.cartEditText = "编辑";

    // 更新购物总价
    let nowCart = JSON.parse(JSON.stringify(cartDatas));
    this.cartDatas = cartDatas;
    this.cartList2 = Object.values(cartDatas);

    // 处理购物车商品
    let cartListArry = []
    this.cartListInvalid = []
    if (this.cartList2.length > 0) {
      this.cartList2.map(item => {
        let _now = this.getNow();

        // 没有下架
        if (item.Sku.status) {
          // 限时的
          if (item.Sku.is_time_limited) {
            let start_time = moment(item.Sku.start_time);
            // //1、进行中 2、已结束 3、还未开始
            if (moment(_now).isBefore(item.Sku.start_time)) {
              this.cartListInvalid.push(item)
            } else if (
              moment(_now).isAfter(item.Sku.start_time) &&
              moment(_now).isBefore(item.Sku.end_time)
            ) {
              // 进行中的 库存是否为0
              if (item.stock_available < 1) {
                this.cartListInvalid.push(item)
              } else {
                cartListArry.push(item)
              }
            } else {
              this.cartListInvalid.push(item)
            }
          } else {
            // 限量的
            if (item.Sku.stock_available > 0) {
              cartListArry.push(item)
            } else {
              this.cartListInvalid.push(item)
            }
          }
        } else {
          // 已下架
          this.cartListInvalid.push(item)
        }
      })
    }
    this.cartList2 = cartListArry
    // todo 模拟失效商品
    // this.cartListInvalid = this.cartList2
    wx.setStorageSync("oldCart", nowCart);
    this.updateCart();
    this.$apply();
  }

  // 下拉刷新
  async onPullDownRefresh(e) {
    // 处理 先保存成功购物车后在拉取 购物车数据
    clearInterval(this.timers);
    this.timers = setInterval(async () => {
      if (!this.$parent.globalData.isSavingCart) {
        clearInterval(this.timers);
        await this.getMyCartList(0);
        wx.stopPullDownRefresh();
        this.$apply();
      }
    }, 500);
    this.getExplosiveList();
    
  }

  // 计算合计
  calcToalPrice() {
    this.totalPrice = 0;
    for (let item of Object.values(this.cartList2)) {
      if (item.checked) {
        this.totalPrice += item.Sku.price * item.amount;
      }
    }
    console.log("合计是:", this.totalPrice);
    this.$apply();
  }

  // 全选
  checkedAll() {
    this.checkedAllStatus = this.checkedAllStatus ? false : true;
    if (this.cartList.length > 0) {
      this.cartList.map(item => {
        item.checked = this.checkedAllStatus ? true : false;
      });
    }
    this.calcToalPrice();
  }

  async addToCart(e) {
    wx.aldstat.sendEvent("购物车爆品推荐点击加入购物车", {});
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
    this.$parent.globalData.isSavingCart = true;
    console.log('this.$parent.globalData.isSavingCart', this.$parent.globalData.isSavingCart)

    // 处理 先保存成功购物车后在拉取 购物车数据
    clearInterval(this.timers);
    this.timers = setInterval(async () => {
      if (!this.$parent.globalData.isSavingCart) {
        clearInterval(this.timers);
        await this.getMyCartList(0);
        this.$apply();
      }
    }, 500);

    // this.getMyCartList(0);
    this.$apply();
  }

  // 修改购物车中商品

  updateCart() {
    // 将购物车的id和amount存入缓存  和 首页匹配
    this.setCartBadgeNum(this.cartDatas);
    this.calcToalPrice();
    let AllAmount = 0;
    for (let i in this.cartDatas) {
      AllAmount += this.cartDatas[i].amount;
    }
    this.cartList2 = AllAmount == 0 ? [] : this.cartList2;
    this.$apply();
  }

  // 删除购物车商品
  async deleteCart() {
    let self = this;
    //验证有没有选中商品
    this.checkCart();
    if (!this.cartIds) {
      wx.showToast({
        title: "请选择要删除的商品",
        icon: "none",
        duration: 2000
      });
      return false;
    }

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

    this.$apply();
  }
  // 清空失效的购物车商品
  async delInvalid() {
    let self = this;

    this.cartIds = "";
    this.cartListInvalid.map(item => {
      this.cartIds += item.id + ",";
    });
    this.cartIds = this.cartIds.substring(0, this.cartIds.length - 1);

    wx.showModal({
      title: "系统提示",
      content: "确认要删除失效商品吗?",
      success(res) {
        if (res.confirm) {
          self.goToDeleta();
        } else if (res.cancel) {
          return false;
        }
      }
    });
    this.$apply();
  }

  //删除购物车商品
  async goToDeleta() {
    let result = await this.$parent.globalData.post(
      `${api.server}/api/ec/b2c/cart/delete`,
      { ids: this.cartIds }
    );
    if (result.state === "success") {
      wx.showToast({
        title: "删除成功",
        duration: 2000
      });
      this.getMyCartList(0);
    } else {
      wx.showToast({
        title: result.errorMsg,
        duration: 2000
      });
    }
  }

  // 验证有没有选中商品
  checkCart() {
    this.cartIds = "";
    this.skuIds = "";
    this.cartList2.map(item => {
      if (item.checked && item.amount > 0) {
        this.cartIds += item.id + ",";
        this.shopId = item.shopid;
        this.skuIds += item.skuid + ",";
      }
    });
    this.cartIds = this.cartIds.substring(0, this.cartIds.length - 1);
    this.skuIds = this.skuIds.substring(0, this.skuIds.length - 1);
  }

  // 结算
  async go2checkoutOrder() {
    wx.aldstat.sendEvent("购物车结算按钮点击", {});
    this.checkCart();
    if (!this.cartIds) {
      wx.showToast({
        title: "请选择要结算的商品",
        icon: "none",
        duration: 2000
      });
      return false;
    }
    console.log("强制保存购物车");
    await this.saveCart({ force: true });
    console.log("强制保存购物车。。。成功");
    // wx.showLoading({ title: "准备中" });
    if (this.isShowLoading) return;
    this.mask = true;
    this.isShowLoading = true;
    this.$apply();

    console.log("睡1秒");
    await this.$parent.globalData.sleep(1000);
    console.log("睡醒，开始checkout");
    let result = await this.$parent.globalData.post(
      `${api.server}/api/ec/b2c/cart/checkout`,
      { skuids: this.skuIds }
    );
    log.info("this is checkout Order ", result);

    if (result.state == "error") {
      this.confirmData.title = "温馨提示";
      this.confirmData.msg = result.errorMsg.replace(/,/g, "\n");
      this.$broadcast("showTips");
      log.setFilterMsg(this.confirmData.msg);
      // wx.hideLoading();
      this.isShowLoading = false;
      this.mask = false;
      this.$apply();
      return;
    }
    // wx.hideLoading();

    wx.navigateTo({
      url:
        "/pages/user/checkout?skuids=" + this.skuIds + "&shopid=" + this.shopId
    });
    this.isShowLoading = false;
    this.mask = false;
    this.$apply();
  }

  // 编辑
  cartEdit() {
    this.isEditCart = this.isEditCart ? false : true;
    this.cartEditText = this.isEditCart ? "完成" : "编辑";
    this.checkedAllStatus = this.isEditCart ? false : true;
    if (this.cartList.length > 0) {
      this.cartList.map(item => {
        item.checked = this.isEditCart ? false : true;
      });
    }
    // 更新购物总价
    this.calcToalPrice();
  }
  //获取今日爆品分类
  async getExplosiveList() {
    let resultList = await this.$parent.globalData.get(
      `${api.server}/api/ec/b2c/sku/listByTag?tags=explosive`
    );
    if (resultList.state !== "error") {
      if (resultList.rows.length > 0) {
        this.explosiveList = this.setGoodsItem(resultList.rows) || [];

        this.cartIcon = this.explosiveList.length > 0 ? true : false


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


  methods = {
    // 选中或取消
    checkedItem(e) {
      let id = e.currentTarget.dataset.id;
      let checkedNum = 0;
      if (this.cartList.length > 0) {
        this.cartList.map(item => {
          if (id === item.id) {
            item.checked = item.checked ? false : true;
          }
          if (item.checked) {
            checkedNum = checkedNum + 1;
          }
        });
      }
      // 全选状态
      this.checkedAllStatus =
        checkedNum === this.cartList.length ? true : false;

      // 更新购物总价
      this.calcToalPrice();
    }
  };
}
</script>
<style>
.topContent {
  background: linear-gradient(to bottom, #fb6890, #fb777d);
  height: 74rpx;
  position: fixed;
  width: 750rpx;
  z-index: 9999;
}
.topContent .bannerImg {
  width: 457rpx;
  height: 28rpx;
  margin: 0 auto;
  display: block;
  padding-top: 25rpx;
}
.topContent .editCart {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  font-size: 28rpx;
  color: #fff;
}
.cartContent_bg {
  height: 62rpx;
  background: #fb777d;
  position: relative;
  top: 74rpx;
}
.cartContent {
  position: relative;
}
.cartList {
  width: 730rpx;
  /* height: 180rpx; */
  background: #fefefe;
  margin: 12rpx 10rpx 20rpx 10rpx;
  border-radius: 12rpx;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  padding: 25rpx 0px 25rpx 0px;
}
.cartList .cartImg {
  width: 164rpx;
  height: 164rpx;
  margin: 0px 20rpx 0px 58rpx;
  /* position: absolute;
		left: 60rpx;
		top: 20rpx; */
}
.cartList .chooseImg {
  width: 28rpx;
  height: 28rpx;
  position: absolute;
  top: 76rpx;
  left: 16rpx;
}
.cartList .checkbox {
  /* float: left; */
  height: 38rpx;
  width: 38rpx;
  /* margin: 73rpx 0 0 14rpx; */
  background: url(http://hjl2c.dawangtv.cn/wxa_images/choose_img.png) no-repeat;
  background-size: 38rpx;
  position: absolute;
  top: 50%;
  margin-top: -19rpx;
  left: 14rpx;
}
.cartList .goods_info {
  /* position: absolute;
		left: 220rpx;
		top: 22rpx; */
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-right: 20rpx;
}
.cartList .goods_name {
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
  margin-top: -4rpx;
}
.cartList .goods_spec {
  font-size: 22rpx;
  color: #9b9b9b;
  background: #f2f2f2;
  border-radius: 8rpx;
  padding: 6rpx;
}
.priceContent {
  /* margin-top: -10rpx; */
  line-height: 40rpx;
  position: absolute;
  bottom: 15rpx;
}
.cartList .goods_price {
  font-size: 44rpx;
  color: #fb6890;
  display: inline-block;
}
.cartList .font_small {
  font-size: 26rpx;
}
.cartList .original_price {
  font-size: 26rpx;
  color: #919194;
  text-decoration: line-through;
  margin-left: 18rpx;
  display: inline-block;
}
.cartList .choose_num {
  /* width: 195rpx; */
  height: 54rpx;
  position: absolute;
  right: 20rpx;
  bottom: 17rpx;
}
.cartList .choose_num image {
  width: 45rpx;
  height: 45rpx;
  display: block;
  float: left;
  margin-top: 2rpx;
}
.cartList .choose_num .number {
  display: block;
  float: left;
  width: 111rpx;
  height: 45rpx;
  line-height: 40rpx;
  text-align: center;
  font-size: 32rpx;
  color: #2f2f30;
}
.cart-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 88rpx;
  width: 100%;
  background: #fff;
  display: flex;
  border-bottom: solid 1rpx #dedede;
  z-index: 999;
  padding-top: 10rpx
}
.cart-bottom .checkbox {
  height: 38rpx;
  padding-left: 60rpx;
  line-height: 38rpx;
  margin: 28rpx 10rpx 0 20rpx;
  background: url(http://hjl2c.dawangtv.cn/wxa_images/choose_img.png) no-repeat;
  background-size: 38rpx;
  font-size: 26rpx;
  color: #9b9b9b;
}
.cart-bottom .checkbox.checked,
.cartList .checkbox.checked {
  background: url(http://hjl2c.dawangtv.cn/wxa_images/choose_img_checked.png)
    no-repeat;
  background-size: 38rpx;
}
.cart-bottom .total {
  height: 40rpx;
  flex: 1;
  margin-right: 40rpx;
  font-size: 26rpx;
  color: #2f2f30;
  text-align: right;
}
.cart-bottom .total text {
  color: #fb6890;
}
.cart-bottom .font_big {
  font-size: 44rpx;
  font-weight: bolder;
  position: relative;
  top: 7rpx;
  margin-left: 3px;
}
.cart-bottom .delete {
  height: 100rpx;
  width: 180rpx;
  text-align: center;
  line-height: 100rpx;
  font-size: 29rpx;
  background: #ff6434;
  color: #fff;
}
.cart-bottom .checkout {
  height: 78rpx;
  width: 265rpx;
  text-align: center;
  line-height: 78rpx;
  font-size: 28rpx;
  background: linear-gradient(to bottom, #fb6890, #fb777d);
  color: #fff;
  border-radius:50rpx ;
  /* margin-top: 5rpx; */
  margin-right: 10rpx
}
.no-cart-tips .icon-cart {
  width: 248rpx;
  height: 248rpx;
  display: block;
  margin: 0 auto;
  padding-top: 360rpx;
}
.no-cart-tips .pt_30 .icon-cart {
  padding-top: 190rpx;
}
.no-cart-tips text {
  display: block;
  width: 248rpx;
  height: 29rpx;
  line-height: 29rpx;
  text-align: center;
  font-size: 29rpx;
  color: #999;
  margin: 0 auto;
}
.shadeView {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: 100%;
  display: flex;
  justify-content: center;
}
.shade-loading {
  width: 300rpx;
  height: 300rpx;
  margin-top: 400rpx;
  text-align: center;
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
}
/* .shade-loading {
  width: 260rpx;
  height: 300rpx;
  display: block;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  top: 60%;
  margin-left: -130rpx;
  z-index: 999999;
} */
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
.cartList_disbale {
  background: #fff;
  border-radius: 12rpx;
  width: 730rpx;
  margin: 0 auto;
  /* margin-bottom: 35rpx; */
}
.cartList_disbale .cartList_title {
  position: relative;
  font-size: 28rpx;
  width: 730rpx;
  height: 78rpx;
  top: 30rpx;
}
.cartList_disbale .cartList_title .title_fl {
  position: absolute;
  left: 30rpx;
  font-weight: bold;
}
.cartList_disbale .cartList_title .title_rl {
  position: absolute;
  right: 30rpx;
  color: #ec3e29;
  font-size: 24rpx;
  top: 8rpx;
}
.cartList_disbale .cartList .choose_num {
  width: 166rpx;
  text-align: center;
  font-size: 32rpx;
  color: #979797;
}
.cartList_disbale .cartList .goods_name {
   color: #999
}
.cartList_disbale .cartList .goods_price {
  color: #8a8a8a;
}

.cartList_disbale .cartList .checkbox {
  width: 33rpx;
  height: 56rpx;
  line-height: 28rpx;
  text-align: center;
  background: #c9c9c9;
  border-radius: 4rpx;
  color: #fff;
  left: -7rpx;
  font-size: 20rpx;
}
.cartList_disbale .cartList {
  width: 684rpx;
  /* height: 180rpx; */
  background: #fefefe;
  margin: 0rpx auto;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  padding: 25rpx 0;
  border-bottom: solid 1rpx #f2f2f2;
  border-radius: 0;
}

.cartList_disbale .cartList .cartImg {
  width: 164rpx;
  height: 164rpx;
  margin: 0px 20rpx 0px 34rpx;
}
.explosive-content {
  background: #f2f2f2;
  margin-top: 20rpx;
  padding-bottom: 35rpx;
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
.pt_30 {
  padding-bottom: 100rpx;
}
</style>