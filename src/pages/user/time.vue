<template>
	<view class="page">
		<!-- <view class="topContent">
			<image src="../../images/banner_img2.png" class="bannerImg"></image>
		</view> -->
		<view class="end_time">
			<image src="../../images/icon_time.png"></image>
			<text>亲，乐乐购营业时间：</text>
			<view class="time_btn">00:00-22:00</view>
			<text class="small_text" bindtap='openshop'>现在是非营业时间</text>
		</view>
	</view>
</template>

<script>
	import wepy from "wepy";
	import api from "../../config/api";
	import auth from "../base/auth";
	import util from "../../util/util";
	import moment from "moment";

	export default class Index extends auth {
		config = {
			navigationBarTitleText: "乐乐购",
		};
		
		data = {
			counter: 0,
			currenttime: "",
			timer1: null,
		};
		onPullDownRefresh() {
			wepy.stopPullDownRefresh();
		}
		async onLoad(options) {
		}
		async onShow() {
            //await this.getCurrentTime();
            console.log(this.$parent.globalData.currenttime, 1111111)
			let now = moment(this.$parent.globalData.currenttime);
			let clock0 = moment({
				hour: 0
			});
			let clock22 = moment({
				hour: 22
			});
			console.log(" now.isAfter(clock0) ", now.isAfter(clock0));
			console.log("now.isBefore(clock22) ", now.isBefore(clock22));
			if (now.isAfter(clock0) && now.isBefore(clock22)) {
				wx.reLaunch({
					url: "/pages/user/index"
				});
			}
		}
		// 获取服务器的当前时间
		// async getCurrentTime() {
		// 	let result = await this.$parent.globalData.get(
		// 		`${api.server}/auth/currentTime`
		// 	);
		// 	this.currenttime = result.currenttime;
		// 	// console.log(moment(this.currenttime).format('YYYY-MM-DD HH:mm:ss'))
		// }
		methods = {
			openshop() {
				let that = this
				this.counter++;
				if (!that.timer1) {
					that.timer1 = setTimeout(() => {
						that.counter = 0;
						clearTimeout(that.timer1);
						that.timer1 = null
					}, 2000);
				}
				if (that.counter >= 7) {
					that.counter = 0;
					try {
						that.$parent.globalData.ifForceOpenShop = true
						wx.reLaunch({
							url: "/pages/user/index"
						});
					} catch (e) {
						// Do something when catch error
					}
				}
			}
		};
	}
</script>

<style>
	.topContent {
		background: #fb6890;
		height: 74rpx;
		position: fixed;
		width: 750rpx;
		z-index: 99;
	}
	.topContent .bannerImg {
		width: 457rpx;
		height: 28rpx;
		margin: 0 auto;
		display: block;
		padding-top: 20rpx;
	}
	.end_time image {
		width: 387rpx;
		height: 250rpx;
		display: block;
		margin: 0 auto;
		padding-top: 330rpx;
	}
	.end_time text {
		font-size: 34rpx;
		color: #969699;
		text-align: center;
		display: block;
		margin-top: 30rpx;
	}
	.time_btn {
		background: linear-gradient(to bottom, #fb6890, #fb777d);
		border-radius: 100rpx;
		width: 351rpx;
		height: 77rpx;
		display: block;
		margin: 20rpx auto 15rpx auto;
		text-align: center;
		font-size: 34rpx;
		color: #fdfffe;
		line-height: 77rpx;
	}
	.end_time .small_text {
		font-size: 26rpx;
		color: #969699;
	}
</style>