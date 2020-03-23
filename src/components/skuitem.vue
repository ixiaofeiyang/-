<template>
  <!--商品展示-->
  <view class="goods_box">
    <view class="goodsList">
      <navigator url="{{'/pages/user/goods?id=' + item.id}}"
                 id="{{item.id}}">
        <image src="{{fileserver+item.headimg}}" mode="aspectFill"></image>
        <!--今日爆品标签-->
        <view class="tags_jrbp"
              wx:if="{{item.tagsFirst == '今日爆品'}}">
          <image src="../images/tags_jrbp.png"></image>
        </view>
        <!--新品标签-->
        <view class="tags_jrbp tags_xp"
              wx:if="{{item.tagsFirst == '新品'}}">
          <image src="../images/tags_xp.png"></image>
        </view>
        <!--预售标签-->
        <view class="tags_jrbp tags_ys"
              wx:if="{{item.tagsFirst == '预售'}}">
          <image src="../images/tags_ys.png"></image>
        </view>
        <!--已抢光(限量）-->
        <view class="mark_img"
              wx:if="{{item.stock_status === 'empty'}}">
          <image src="../images/sell_all.png" />
          </image>
        </view>
        <block wx:else>
          <!--已结束（限时）-->
          <view class="mark_img"
                wx:if="{{item.start_status === 2}}">
            <image src="../images/sell_end.png"></image>
          </view>
        </block>
        <view class="skuinfo">
          <text class="goods_name">{{item.sku_name}}</text>
           <text class="goods_spec">{{item.sku_specification}}</text>
          <!-- <text class="presell_time">预售时间： {{item.start_time_str}}</text>
              <text class="presell_time">提货时间： {{item.end_time_str}}</text> -->
          <!-- <text class="total_num">累计销量 {{item.sold_quantity}} 份</text> -->
          <!-- <block wx:if="{{item.user_purchase_limit<=0}}">
                  <block wx:if="{{item.is_quantity_limited}}">
                      <view class="sell_num">已售
                          <text class="red">{{item.sold_quantity_today}}</text> 份 / 限量 {{item.quantity_limit}} 份 </view>
                  </block>
                  <block wx:else>
                      <view class="sell_num">已售
                          <text class="red">{{item.sold_quantity_today}}</text> 份 </view>
                  </block>
              </block>
              <block wx:else>
                  <view class="sell_num">限购
                      <text class="red"> {{item.user_purchase_limit}} </text>份 / 已售
                      <text class="red">{{item.sold_quantity_today}}</text> 份</view>
              </block> -->
          <view class="price_content">
            <view class="goods_price">
              <text class="font_small">¥</text>{{item.price/100}}
            </view>
            <text class="original_price">¥{{item.default_price/100}}</text>
          </view>
        </view>
      </navigator>
      <view class="goToCategory"
            wx:if="{{goToCategory}}">
        <view class="add_cart"
              data-id="{{item.categoryid_l2}}"
              bindtap="goCategory"
              wx:if="{{item.Category2.category_name}}">
          <text>进入{{item.Category2.category_name}}</text>
          <image src="../images/icon_category.png"></image>
        </view>
      </view>
      <!--加购物车-->
      <view class="cartContent">
        <!-- --<text > {{item.start_status }} {{!item.cartAmount }}</text>-- -->
        <!--!item.cartAmount-->
        <block wx:if="{{item.start_status == 3}}">
          <text class="add_cart disabled">{{item.full_start_time_str+'开售'}}</text>
        </block>
        <block wx:if="{{item.start_status == 2}}">
          <block wx:if="{{item.stock_status == 'empty'}}">
            <text class="add_cart disabled">已抢光</text>
          </block>
          <block wx:else>
            <text class="add_cart disabled">已结束</text>
          </block>
        </block>
        <block wx:if="{{item.start_status == 1}}">
          <block wx:if="{{item.stock_status == 'empty'}}">
            <text class="add_cart disabled">已抢光</text>
          </block>
          <block wx:else>
            <block wx:if="{{!item.cartAmount}}">
              <text class="add_cart"
                    data-skuid="{{item.id}}"
                    data-spuid="{{item.spuid}}"
                    data-stock="{{item.stock_available}}"
                    bindtap="add2CartItem">加购物车</text>
            </block>
            <block wx:else>
              <view class="choose_num"
                    wx:if="{{item.cartAmount}}">
                <image src="../images/down_img.png"
                       data-id="{{item.cartId}}"
                       bindtap="cartNumDownItem"></image>
                <input value="{{item.cartAmount}}"
                       class="number"
                       disabled="true"
                       type="number" />
                <image src="../images/up_img.png"
                       data-id="{{item.cartId}}"
                       bindtap="cartNumUpItem"></image>
              </view>
            </block>
          </block>
        </block>
      </view>
    </view>
    <!--end class cartContent -->
  </view>
</template>
<script>
import wepy from "wepy";
import api from "../config/api";
export default class skuitem extends wepy.component {
  props = {
    item: {
      type: Object,
      default: "none"
    },
    tags: {
      type: Boolean
    },
    goToCategory: {
      type: Boolean
    }
  };

  data = {
    fileserver: `https://llg2c.yunxiaoxin.net`
  };
  methods = {
    goCategory(e) {
      wx.aldstat.sendEvent("点击进入对应分类", {});
      this.$emit("goCategory", e);
    },
    add2CartItem(e) {
      wx.aldstat.sendEvent("点击商品加入购物车", {});
      this.$emit("add2CartItem", e);
    },
    cartNumDownItem(e) {
      this.$emit("cartNumDownItem", e);
    },
    cartNumUpItem(e) {
      this.$emit("cartNumUpItem", e);
    }
  };
}
</script>
<style>
.goodsList {
  position: relative;
  background: #fefefe;
  /* height: 659rpx; */
  overflow: hidden;
  width: 710rpx;
  margin: 0 auto 0 auto;
  border-radius: 20rpx;
  overflow-x: hidden;
  height: 280rpxx;
}
.goodsList image {
  width: 220rpx;
  height: 220rpx;
  display: block;
  overflow: hidden;
  background: #fff;
  float: left;
  padding: 10rpx 10rpx 10rpx 20rpx;
  margin-top: 13rpx;
}
.goodsList .mark_img {
  background: rgba(0, 0, 0, 0.7);
  width: 730rpx;
  height: 410rpx;
  position: absolute;
  top: 0;
  left: 0;
}
.goodsList .mark_img image {
  width: 207rpx;
  height: 180rpx;
  display: block;
  margin: 115rpx auto;
  background: none;
}
.goodsList .goods_name {
  font-size: 30rpx;
  color: #2f2f30;
  /* font-weight: bold; */
  display: block;
  margin-top: 15rpx;
  height: 88rpx;
  overflow: hidden;
}
.goodsList .goods_spec{
  font-size: 22rpx;
  color: #666;
  background: #f2f2f2;
  border-radius:20rpx ;
  padding: 5rpx 15rpx;
  
}
.goodsList .presell_time {
  display: block;
  font-size: 24rpx;
  color: #f8921f;
  line-height: 36rpx;
  margin-left: 20rpx;
  width: 280rpx;
}
.goodsList .sell_num {
  font-size: 28rpx;
  color: #2f2f30;
  position: absolute;
  right: 20rpx;
  top: 490rpx;
}
.goodsList .total_num {
  font-size: 24rpx;
  color: #8c8c8f;
  position: absolute;
  right: 20rpx;
  top: 530rpx;
}
.goodsList .red {
  color: #ec3e29;
}
.goodsList .price_content {
  position: relative;
  

}
.goodsList .goods_price {
  font-size: 58rpx;
  color: #fb6890;
  display: inline-block;
  font-weight: bold;
}
.goodsList .font_small {
  font-size: 30rpx;
  position: relative;
  bottom: 4rpx
}
.goodsList .original_price {
  font-size: 26rpx;
  color: #919194;
  text-decoration: line-through;
  display: inline-block;
  margin-left: 18rpx;
}
.goodsList .commission_price {
  font-size: 28rpx;
  color: #2f2f30;
  display: inline-block;
  margin-left: 28rpx;
}
.cartContent {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  width: 150rpx;
  height: 54rpx;
}
.goodsList .add_cart {
  width: 150rpx;
  height: 54rpx;
  line-height: 54rpx;
  background: linear-gradient(to right, #fb6890, #fb777d);
  border-radius: 100rpx;
  text-align: center;
  display: block;
  color: #fefefe;
  font-size: 26rpx;
}

.goodsList .goToCategory .add_cart {
  width: 244rpx;
  background: #f8921f;
  margin-left: 20rpx;
  position: relative;
  text-align: left;
  text-indent: 20rpx;
  margin-bottom: 20rpx;
}
.goodsList .goToCategory image {
  width: 44rpx;
  height: 31rpx;
  position: absolute;
  right: 16rpx;
  top: 12rpx;
  background: none;
}
.goodsList .disabled {
  background: #9c9c9c;
}
.choose_num {
  width: 201rpx;
  height: 54rpx;
}

.choose_num .number {
  display: block;
  float: left;
  width: 60rpx;
  height: 45rpx;
  line-height: 40rpx;
  text-align: center;
  font-size: 32rpx;
  color: #2f2f30;
}
.tags_jrbp image {
  width: 132rpx;
  height: 94rpx;
  position: absolute;
  left: 25rpx;
  top: 26rpx;
  overflow: hidden;
  background: none;
}

.tags_ys image,
.tags_xp image {
  width: 131rpx;
  height: 56rpx;
}
.goods_box {
  padding-top: 20rpx;
  

}
.skuinfo{
  float: left;
  margin-left: 20rpx;
  margin-right: 20rpx;
  padding: 10rpx 0;
  width: 420rpx;
}
.choose_num image {
  width: 45rpx;
  height: 45rpx;
  display: block;
  float: left;
  margin-top: 2rpx;
  background: none;
  padding: 0
}
</style>
