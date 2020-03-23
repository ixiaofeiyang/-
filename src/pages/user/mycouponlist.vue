<template>
    <view class="page">
        <view class="weui-navbar">
            <block wx:for="{{tabs}}" wx:key="*this">
                <view id="{{index}}" class="weui-navbar__item {{activeIndex == index ? 'weui-bar__item_on' : ''}}" @tap="tabClick">
                    <view class="weui-navbar__title">{{item}}</view>
                </view>
            </block>
        </view>
        <view class="weui-tab__panel">
            <view class="prl-20">
                <block wx:if="{{couponList[activeIndex].length > 0}}">
                    <view class="weui-flex" wx:for="{{couponList[activeIndex]}}">
                        <view class=" {{couponState == 1?'coupon-num':''}}">
                            ￥<text  class="money">{{item.Coupon.coupon_value/100}}</text>
                        </view>
                        <view class="weui-flex__item">
                            <view>{{item.Coupon.name}}</view>
                            <view class="fs-20 color-9">有效期 : {{item.begin_time}} - {{item.end_time}}</view>
                        </view>
                        <view class="right-border">
                            <block wx:if="{{couponState == 1}}">
                                <text class="text-c employ-btn" bindtap="goIndex">立即使用</text>
                            </block>
                            <block wx:elif="{{couponState == 2}}">
                                <text class="text-c employ-btn failure-bg">已使用</text>
                            </block>
                            <block wx:else>
                                <text class="text-c employ-btn failure-bg">已失效</text>
                            </block>
                        </view>
                    </view>
                </block>
                <block wx:else>
                    <view class="text-align-center no-data-page">     
                        <view>暂无优惠券</view>
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
    import wepy from "wepy";
    import api from "../../config/api";
    import auth from "../base/auth";
    import util from "../../util/util";
    export default class Index extends auth {
        config = {
            navigationBarTitleText: "乐乐购",
             enablePullDownRefresh: false
        };
        components = {};
        data = {
            tabs: ["可使用", "已使用","已失效"],
            activeIndex: 0,
            couponList: {},
            couponState: 1,
            page: 0, // 页数给予默认值1
            count:0,//总条数
            noMoreData: false, // 没有更多数据
            isLoading: false, // 是否在加载中
            openid:null
        };
        methods = {
            async tabClick(e) {
                this.activeIndex = e.currentTarget.id
                // status=1 =>可使用优惠券状态1=>可使用 0=>无效券 2=>已使用
                if(this.activeIndex == 0){
                    this.couponState = 1
                }else if(this.activeIndex == 1){
                    this.couponState = 2
                }else{
                    this.couponState = 0
                }
                //防止重复请求接口
                if (this.couponList[this.activeIndex]) {
                    return
                }
                this.getList()
                this.$apply();
            },
            goIndex(){
                wx.reLaunch({
                    url: 'index'
                })
            }
        }
        async onLoad(options) {
            let userInfo = this.$parent.globalData.userInfo =
                this.$parent.globalData.userInfo ||
                wx.getStorageSync("user:detail") || {};
            if (userInfo.passport) {
                let info = userInfo.passport
                info.map(item => {
                    if (item.appid == api.appid) {
                        this.openid = item.identifier
                    }
                })
            } else {
                this.openid = wx.getStorageSync("user:openid")
            }
            this.getList();
        }
        async getList() {
            let res = await this.$parent.globalData.get(`${api.server}/api/coupon/list?status=${this.couponState}&size=100&page=${this.page}&uid=${this.openid}`);
            let datas = res.rows;
            if (res.count > 0) {
                datas.map(item => {
                    let begin_time = item.begin_time.split(" ")[0].replace(/-/g,'.')
                    let end_time = item.end_time.split(" ")[0].replace(/-/g,'.')
                    item.begin_time = begin_time
                    item.end_time = end_time
                })
                datas.sort(function(a,b){
                    var value1 = a.Coupon.coupon_value,
                        value2 = b.Coupon.coupon_value;
                    return value2 - value1;
                });
                
                this.couponList[this.activeIndex] = datas;
            } else {
                this.couponList[this.activeIndex] = ''
            }
            this.$apply();
        }
    }
</script>

<style>
    page {
        background: #fafafa;
    }
    .weui-navbar {
        border-bottom: 0px
    }
    .weui-navbar__item.weui-bar__item_on,.coupon-num {
        color: #FF3300
    }
    .weui-bar__item_on:after {
        content: " ";
        position: absolute;
        right: 50%;
        margin-right: -22rpx;
        width: 45rpx;
        bottom: 23rpx;
        height: 4rpx;
        background-color: #FF3300;
        border-radius: 4rpx;
    }
    .weui-flex {
        padding: 0px 20rpx;
        background: #ffffff;
        border-radius: 6rpx;
        font-size: 32rpx;
        align-items: center;
        margin-bottom: 20rpx;
        box-shadow: 0px 2rpx 8rpx 0 #dddddd;
        color:#2F2F30
    }
    .weui-flex__item {
        padding: 0px 30rpx;
    }
    .money {
        font-size: 76rpx;
        /* padding-left: 10rpx; */
    }
    .fs-48 {
        font-size: 48rpx;
    }
    .white-txt {
        color: white
    }
    .text-c {
        text-align: center
    }
    .fs-20 {
        font-size: 20rpx;
    }
    .color-9 {
        color: #969696
    }
    .prl-20 {
        padding: 0px 20rpx;
    }
    .employ-btn {
        background: #EC3E29;
        border-radius: 100rpx;
        width: 140rpx;
        height: 48rpx;
        line-height: 48rpx;
        color: #fafafa;
        font-size: 24rpx;
        display: inline-block
    }
    .right-border {
        height: 178rpx;
        align-items: center;
        padding: 0px 20rpx 0px 40rpx;
        border-left: 2rpx dashed #d8d8d8;
        line-height: 178rpx;
    }
    .failure-bg {
        background-color: #989898;
    }
    .no-data-page {
        color: #999999;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center
    }
</style>