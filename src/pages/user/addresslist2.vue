<template>
    <view class="page">
        <view class="page__bd">
            <view class="search_box">
                <!--地理位置选择-->
                <view class="shop_box" bindtap="getAddressHandler" data-name="address" data-index='1'>
                    <image src="../../images/wz_img.png"></image>
                    <text>附近门店</text>
                </view>
                <!--关键词搜索选择-->
                <view class="search_input">
                    <wux-search-bar clear bind:confirm="onConfirm" bind:clear="onClear" setInputFocus="{{setInputFocus}}" placeholder="请输入门店名称" inputValue="{{inputValue}}" setInputFocus="{{setInputFocus}}" cancelText="搜索" bind:cancel="onConfirm" />
                </view>
            </view>
            <view class="shop_explain">
                <text>更改您的提货门店：</text>
                <text>您可以通过点击附近的门店，根据位置查询周围自提点，也可以直接输入门店名称搜索查找！</text>
            </view>
            <!--自提点-->
            <view class="my_address" wx:if="{{shopInfo.shop_name}}">
                <view class="address_title">
                    <text>当前自提点</text>
                </view>
                <view class="addressList">
                    <text>{{shopInfo.shop_name}}</text>
                    <text wx:if="{{shopInfo.status == 4}}">(休息中)</text>
                    <text class="tags">正在使用</text>
                    <text class="addressInfo">{{shopInfo.address}}{{shopInfo.address_detail||''}}</text>
                    <view class="address_phone">
                        <image src="../../images/phone_img.png"></image>
                        {{shopInfo.contact}}
                    </view>
                </view>
            </view>
            <!--我的历史自提点-->
            <view class="my_address" wx:if="{{histryShopInfo.length>0}}">
                <view class="address_title">
                    <text>历史自提点</text>
                </view>
                <view class="addressList" wx:for="{{histryShopInfo}}" wx:key="id" data-id="{{item.id}}" bindtap="choseHistryAddress">
                    <text>自提点：{{item.shop_name}}</text>
                    <text wx:if="{{item.status == 4}}">(休息中)</text>
                    <text class="addressInfo">{{item.address}}{{item.address_detail||''}}</text>
                    <!-- <view class="address_phone">
                        <image src="../../images/phone_img.png"></image>
                        {{item.contact}}
                    </view> -->
                </view>
            </view>
            <!--搜索到的门店列表-->
            <view class="addressBox" wx:if="{{isShopList}}">
                <view class="addressList" wx:if="{{shopList.length>0}}" wx:for="{{shopList}}" wx:key="id" data-id="{{item.id}}" bindtap="choseAddress">
                    <view class="shop_img">
                        <image src="{{fileserver+item.headerimg}}" mode="aspectFill"></image>
                    </view>
                    <view class="shop_text">
                        <text>{{item.shop_name}}</text>
                        <text class="addressInfo">{{item.address}}{{item.address_detail||''}}</text>
                    </view>
                    <view class="distance_box" wx:if="{{tags}}">
                        <text class="tags" wx:if="{{index === 0}}">推荐</text>
                        <text class="distance">{{item.distance}}m</text>
                    </view>
                </view>
                <view class="addressList" wx:if="{{shopList.length === 0}}">暂无记录</view>
                <!--加载更多-->
                <view class="weui-loadmore weui-loadmore_line" wx:if="{{ noMoreData }}">
                    <view class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多数据</view>
                </view>
                <!--请求中的loading-->
                <view class="weui-loadmore weui-loadmore_line" wx:if="{{ isLoading }}">
                    <view class="weui-loadmore__tips weui-loadmore__tips_in-line">正在加载中</view>
                </view>
            </view>

        </view>
        <!--提示框-->
        <confirm :confirmData.sync="confirmData" v-on:chooseShop="chooseShop"></confirm>
    </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import auth from "../base/auth";
import util from "../../util/util";
import confirm from "../../components/confirm";
export default class Index extends auth {
  config = {
    navigationBarTitleText: "新增自提点",
    enablePullDownRefresh: false,
    usingComponents: {
      "wux-search-bar": "../../plugin/wux/search-bar/index"
    }
  };

  components = {
    confirm: confirm
  };
  data = {
    fileserver: `${api.uploadimgFile}`,
    userInfo: {}, //用户信息
    shopList: {}, //门店列表
    noMoreData: false, // 没有更多数据
    isLoading: false, // 是否在加载中
    page: 0, // 页数给予默认值1
    sizeIndx: 10, //每页只显示10条数据
    allPages: 0,
    _shop_name: "",
    shopInfo: null, //门店信息
    newShopInfo: {},
    currNav: 0,
    tags: false,
    value: "",
    histryShopInfo: [],
    isShopList: false,
    confirmTitle: "",
    chooseid: null,
    confirmData: {},
    inputFocus: false
  };

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
    await this.getShopList(this.page, false);

    // 开始结束后设置 isLoading 为 false
    this.isLoading = false;
    this.$apply();
  }
  // 重新加载
  async reload() {
    this.noMoreData = false;
    this.page = 0;
    return await this.getShopList(this.page, true);
  }

  async onLoad(options) {
    let result = await super.onLoad(options);
    this.userInfo = this.$parent.globalData.userInfo =
      this.$parent.globalData.userInfo ||
      wx.getStorageSync("user:detail") ||
      {};
  }
  async onShow() {
    await this.getMyShopInfo();
    this.shopInfo =
      this.$parent.globalData.shopInfo || wx.getStorageSync("shopInfo");
    this.histryShopInfo = wx.getStorageSync("histryShopInfo")
      ? wx.getStorageSync("histryShopInfo")
      : this.histryShopInfo;
    console.log(this.histryShopInfo, "this.histryShopInfo");
    this.$apply();
  }
  // 获取我选择的门店
  async getMyShopInfo() {
    let myShopInfo = await this.$parent.globalData.get(
      `${api.server}/api/ec/user/getMyAddress`
    );
    if (myShopInfo.state == "error") {
      this.shopInfo = null;
    } else {
      this.shopInfo = this.$parent.globalData.shopInfo = myShopInfo;
    }
    this.$apply();
  }
  // 设置门店
  async setShopInfo() {
    let myShopInfo = await this.$parent.globalData.post(
      `${api.server}/api/ec/user/setMyAddress`,
      { address: this.shopInfo.id }
    );
    this.$apply();
  }

  //获取门店列表
  async getShopList(pageIndex) {
    this.isShopList = true;
    this.addressApi = [
      // 订单状态列表接口
      `/api/ec/b2c/shop/list?_shop_name=${this._shop_name}&page=${pageIndex}&size=${
        this.sizeIndx}`, //搜索列表Api
      `/api/ec/b2c/shop/list/nearby?latitude=${this.latitude}&longitude=${
        this.longitude
      }` //地图列表Api
    ];
    pageIndex = this.currNav === 1 ? 0 : pageIndex;
    console.log(this.sizeIndx, "this.sizeIndx");
    let resultList = await this.$parent.globalData.get(
      `${api.server}${this.addressApi[this.currNav]}`
    );
    if (resultList.state == "error") return;
    this.allPages = Math.ceil(resultList.count / this.sizeIndx);

    if (pageIndex == 0) {
      this.shopList = this.currNav === 1 ? resultList : resultList.rows;
    } else {
      //加载更多
       if(resultList.rows.length > 0 && this.shopList.length > 0 ){
        resultList.rows.map(item=>{
          this.shopList.push(item)
        })
      }
    }
    console.log(this.allPages, pageIndex);
    this.noMoreData = this.allPages === pageIndex + 1 ? true : false;
    this.$apply();
  }
  getAddressHandler() {
    let cb = () => {
      wx.chooseLocation({
        success: res => {
          console.log(res);
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.name = res.name;
          this.currNav = 1;
          this.tags = true;
          this.getShopList(0);
          this.$apply();
        }
      });
    };
    if (wx.getSetting){
      wx.getSetting({
      success(res) {
        console.log(res);
        if (res.authSetting["scope.userLocation"] == false) {
          console.log("用户肯定是之前否定过拒绝过地理位置");
          wx.openSetting();
        } else {
          cb();
        }
      }
    });
    }
  }
  onConfirm(event) {
    console.log(event);
    this._shop_name = event.detail.value;
    if (this._shop_name) {
      this.isShopList = true;
      this.currNav = 0;
      this.page = 0;
      this.allPages = 0;
      this.tags = false;
      this.getShopList(0);
    } else {
      this.isShopList = false;
    }
  }
  setNewShop(newshopinfo, id) {
    this.chooseid = id;
    this.newshopinfo = util.getItemValue(newshopinfo, this.chooseid);
    console.log(this.newshopinfo, "this.newshopinfo ");
    console.log(this.shopInfo, "this.shopInfo ");
    this.confirmData.title = "确认自提点";
    this.confirmData.address = this.newshopinfo.address;
    this.confirmData.address_detail = this.newshopinfo.address_detail;
    this.confirmData.shopName = this.newshopinfo.shop_name;
    this.$apply();
    this.$broadcast("isChooseShop");
  }
  methods = {
    chooseShop() {
      let id = this.chooseid;
      let newshopinfo = this.newshopinfo;
      let histryShopInfo = wx.getStorageSync("histryShopInfo");
      let shopInfo = this.shopInfo;
      let arry = [];
      if (histryShopInfo.length > 0) {
        histryShopInfo.map(item => {
          if (item.id !== newshopinfo.id) {
            arry.push(item);
          }
        });
      }
      if (shopInfo) {
        arry.push(shopInfo);
        wx.setStorageSync("histryShopInfo", arry);
      }
      this.shopInfo = newshopinfo
      this.$parent.globalData.shopInfo = newshopinfo;
      wx.setStorageSync("shopInfo", this.shopInfo);
      if (wx.getStorageSync("user:detail").id == -1) {
        wx.setStorageSync("shopid", this.shopInfo.id);
      }
      this.setShopInfo();
      this.$apply();
      wx.navigateBack({ delta: 1 });
    },
    choseAddress(e) {
      this.setNewShop(this.shopList, e.currentTarget.dataset.id);
    },
    choseHistryAddress(e) {
      let histryShopInfo = wx.getStorageSync("histryShopInfo");
      this.setNewShop(histryShopInfo, e.currentTarget.dataset.id);
    },
    onCancel() {
      this.shopList = [];
      this.isShopList = false;
      this.value = "";
    },
    onClear() {
      this.shopList = [];
      this.isShopList = false;
      this.value = "";
    },
    bindInput(e) {
      this._shop_name = e.detail.value;
    },
    searchShop() {
      this.getShopList(0);
      this.tags = false;
    }
  };
}
</script>
<style>
.search_box {
  padding-left: 20rpx;
  padding-top: 20rpx;
  height: 100rpx;
  background: #fff;
  font-size: 32rpx;
}
.shop_box {
  position: absolute;
  top: 25rpx;
  width: 110rpx;
  height: 80rpx;
}
.shop_box image {
  width: 36rpx;
  height: 36rpx;
  position: absolute;
  left: 20rpx;
}
.shop_box text {
  font-size: 22rpx;
  color: #f8921f;
  text-align: center;
  position: absolute;
  left: 0;
  top: 46rpx;
}
.search_input {
  position: absolute;
  width: 600rpx;
  height: 80rpx;
  background: #f2f2f2;
  border-radius: 8rpx;
  left: 132rpx;
}
.search_input image {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  left: 18rpx;
  top: 24rpx;
}
.search_input input {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  color: #9c9c9c;
  position: absolute;
  left: 58rpx;
  width: 400rpx;
}
.search_btn {
  font-size: 28rpx;
  color: #2f2f30;
  position: absolute;
  right: 20rpx;
  top: 42rpx;
}
.shop_explain {
  padding: 30rpx 20rpx 20rpx 25rpx;
  background: #fff;
  margin-bottom: 20rpx;
}
.shop_explain text {
  font-size: 22rpx;
  color: #969699;
  display: block;
  margin-bottom: 10rpx;
}
.shop_list {
  padding: 20rpx 20rpx 10rpx 20rpx;
  position: relative;
  border-bottom: solid 1rpx #f2f2f2;
}
.shop_list image {
  width: 118rpx;
  height: 118rpx;
  position: relative;
}
.shop_list .shop_info {
  position: absolute;
  left: 160rpx;
  top: 30rpx;
}
.shop_list .shop_name {
  font-size: 26rpx;
  color: #2f2f30;
  font-weight: bold;
  display: block;
}
.shop_list .shop_code {
  font-size: 22rpx;
  color: #9b9b9b;
  display: block;
  margin-top: 8rpx;
}
.addressList {
  padding: 16rpx 20rpx 30rpx 20rpx;
  border-bottom: solid 1rpx #f2f2f2;
  position: relative;
  background: #fff;
  font-size: 28rpx;
}
.addressBox {
  position: absolute;
  top: 130rpx;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  background: #fff;
}
.addressList text {
  font-size: 28rpx;
  color: #2f2f30;
  font-weight: bold;
}
.my_address .addressList .shopName text {
  display: inline-block;
}

.addressList .addressInfo {
  font-size: 24rpx;
  color: #969699;
  font-weight: lighter;
  margin-top: 6rpx;
  display: block;
}
.addressList .address_phone {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  font-size: 26rpx;
  color: #f8992d;
  font-weight: bold;
}
.addressList .address_phone image {
  width: 25rpx;
  height: 25rpx;
  position: relative;
  top: 3rpx;
}
.addressList .tags {
  width: 75rpx;
  height: 31rpx;
  text-align: center;
  line-height: 30rpx;
  display: inline-block;
  background: url(http://hjl2c.dawangtv.cn/wxa_images/tj.png) no-repeat;
  background-size: 75rpx 31rpx;
  font-size: 18rpx;
  color: #fefefe;
  position: absolute;
  top: 34rpx;
  right: 20rpx;
}
.addressList .distance {
  position: absolute;
  right: 20rpx;
  font-size: 24rpx;
  color: #ec3e29;
  top: 80rpx;
}
.addressList .tags_choose {
  background: #fefefe;
  color: #939396;
  border: 1px solid #979797;
}
.order_address .address_title {
  height: 96rpx;
  border-bottom: solid 1rpx #f2f2f2;
  line-height: 96rpx;
  font-size: 28rpx;
  color: #2f2f30;
  position: relative;
  background: #f2f2f2;
}

.order_address .address_title text {
  display: block;
  margin: 0 20rpx;
  font-size: 26rpx;
  color: #2f2f30;
  padding-left: 50rpx;
  padding-top: 5rpx;
}
.order_address .store_title {
  background: #fff;
}
.order_address .store_title text {
  padding-left: 0;
}
.order_address .address_title .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 400rpx;
}
.order_address .store_title text {
  font-size: 24rpx;
  color: #ec3e29;
}

.order_address .address_title .chooseBtn {
  position: absolute;
  top: 0;
  right: 20rpx;
  font-size: 24rpx;
  color: #5cafee;
}
.addBtn {
  font-size: 28rpx;
  color: #ffffff;
  background: #ec3e29;
  border-radius: 100rpx;
  width: 710rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  position: relative;
  bottom: -32rpx;
  left: 20rpx;
}
.order_address .icon-location {
  width: 35rpx;
  height: 35rpx;
  position: absolute;
  top: 30rpx;
  left: 20rpx;
}
.addressList .shop_img image {
  width: 115rpx;
  height: 98rpx;
  position: absolute;
}
.addressList .shop_text text {
  position: relative;
  left: 135rpx;
  width: 460rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.addressList .shop_text text:nth-child(1) {
  margin-right: 16rpx;
}
.my_address {
  width: 750rpx;
  background: #fff;
  margin-bottom: 20rpx;
}
.my_address .addressList {
  padding: 14rpx 20rpx;
  border-bottom: solid 1rpx #f2f2f2;
  position: relative;
}
.my_address .addressList text {
  font-size: 28rpx;
  color: #2f2f30;
  font-weight: bold;
}
.my_address .addressList text:nth-child(1) {
  display: inline-block;
  margin-right: 16rpx;
}
.my_address .addressList .addressInfo {
  font-size: 24rpx;
  color: #969699;
  font-weight: lighter;
  margin-top: 6rpx;
}
.my_address .addressList .address_phone {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  font-size: 26rpx;
  color: #f8992d;
  font-weight: bold;
}
.my_address .addressList .address_phone image {
  width: 25rpx;
  height: 25rpx;
  position: relative;
  top: 3rpx;
}
.my_address .addressList .tags {
  width: 86rpx;
  height: 31rpx;
  text-align: center;
  line-height: 31rpx;
  display: inline-block;
  background: #57d78a;
  border-radius: 7rpx;
  font-size: 18rpx;
  color: #fefefe;
  position: relative;
  top: -2rpx;
  right: -12rpx;
}
.my_address .addressList .tags_choose {
  background: #fefefe;
  color: #939396;
  border: 1px solid #979797;
}
.my_address .address_title {
  height: 76rpx;
  border-bottom: solid 1rpx #f2f2f2;
  line-height: 76rpx;
  font-size: 28rpx;
  color: #2f2f30;
  font-weight: bold;
}
.my_address .address_title text {
  display: block;
  padding: 5rpx 20rpx;
}

.search_input .wux-search-bar {
  background: #fff;
  padding: 0rpx;
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
  line-height: 80rpx;
  top: 0;
  padding-left: 15rpx;
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
  padding: 0 20rpx;
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