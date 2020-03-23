<template>
    <view  wx:if="{{couponModal}}">
        <view class="coupon-layer"></view>
        <view class="coupon-modal">
            <view class="title-box">
                <image src="../images/activity/modal_head_img_1.png" class="coupon-modal-bg"></image>
                 <image src="../images/activity/modal_title_img.png" class="coupon-modal-title"></image>
            </view>
            <view class="coupon-list">
                <view class="overflow">
                    <view class="weui-flex activity_coupon_list" wx:for="{{couponData}}">
                        <image src="../images/activity/coupon_bg.jpg" class="coupon_bg_bg"></image>
                        <view class="left-box ">
                            ￥<text class="fs-72">{{item.value / 100}}</text>
                        </view>
                        <view class="weui-flex__item">
                            <view class="coupon_name">{{item.title}}</view>
                            <view class="">有效期 : 3日有效</view>
                        </view>
                    </view>
                </view>
                <button class='sumbit' bindtap="closeCouponModal">确定</button>
            </view>
        </view>
    </view>
</template>

<script>
    import wepy from "wepy";
    import api from "../config/api";
    export default class coupon extends wepy.component {
        data = {
            couponModal:false
        };
        props = {
            couponData: {
                type: Object,
                default: "none"
            }
        };
        events = {
            isCouponModal: async $event => {
                this.couponModal = true;
                this.$apply();
            },
            isCloseModal: async $event => {
                this.couponModal = false;
                this.$apply();
            }
        };
        closeModal() {
            this.couponModal = false
        }
        methods = {
            closeCouponModal(){
                this.closeModal()
                this.$emit("closeCoupon");
                this.$apply();
            }
        };
    }
</script>

<style>
    .coupon-modal {
		z-index: 1000;
		position: fixed;
		width: 570rpx;
		height: 820rpx;
		top: 50%;
		/* margin-top: -410rpx; */
		left: 50%;
		/* margin-left: -290rpx; */
      -webkit-transform: translateX(-50%) translateY(-50%);
	}
	.coupon-layer {
		position: fixed;
		top: 0px;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		z-index: 999;
	}
    .title-box{
        position: relative;
        height: 250rpx;
    }
    .coupon-modal-title{
        width: 332rpx;
		height: 89rpx;
        position: absolute;
        bottom: -45rpx;
        left: 50%;
        /* margin-left: -115rpx; */
        z-index: 999;
         -webkit-transform: translateX(-50%);
    }
	.coupon-modal .coupon-modal-bg {
		width: 570rpx;
		height: 250rpx;
		position: absolute;
		bottom: 0px;
         left: 50%;
        margin-left: -285rpx
       
	}
	.coupon-modal .coupon-list {
		position: relative;
		background: #ffffff;
		border-radius: 10rpx;
        border: 7rpx solid #f8d84f;
		padding:30rpx;
        padding-top: 60rpx;
	}
	.coupon-modal .coupon_bg_bg{
		width:100%;
		height: 104rpx;
		position: absolute;
		top:0px;
		left:0px
	}
	.coupon-modal .activity_coupon_list{
        height: 108rpx;
        line-height: 108rpx;
       color:#ffffff;
        margin-bottom: 10rpx;
		position: relative;
    }
	.coupon-modal .coupon-list button {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background: #d75428;
		border-radius: 100rpx;
		text-align: center;
		display: block;
		color: #fefefe;
		font-size: 26rpx;
		margin-top: 24rpx;
	}
	.coupon-modal .left-box{
        width:126rpx;
        text-align: center;
		z-index: 99;
		border-right:2rpx solid #ffffff;
		line-height: 108rpx;
    }
	 .fs-72{
        font-size: 72rpx;
    }
    .fs-38{
        font-size: 38rpx;
    }
	.coupon-modal .activity_coupon_list .weui-flex__item{
		z-index: 100;
		line-height: 30rpx;
		font-size:24rpx;
		padding-left: 20rpx;
        color:#ffffff
	}
	.coupon-modal .coupon_name{
        font-size: 34rpx;
        padding-top:20rpx;
        padding-bottom: 15rpx;
    }
</style>
