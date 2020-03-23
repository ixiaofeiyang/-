<template>
  <view class="page">
    <!--快递信息-->
    <view class='topExpress'>
      <view class='topExpress-left'>
        <image src='../../images/timg.jpg'></image>
      </view>
      <view class='topExpress-right'>
        <view class='topExpress-right-top'>圆通速递</view>
        <view class='topExpress-right-middle'>运单号：813291235464788594<text class="copy-btn">复制</text></view>
        <view class='topExpress-right-bottom'>官方电话 95554
          <image src="../../images/phone_img.png"></image>
        </view>
      </view>
    </view>
    <!--订单跟踪信息时间轴-->
    <view class="my-page__hd">
      <wux-steps direction="vertical">
        <repeat for="{{TransportList}}"
                key="index"
                index="index"
                item="item">
          <wux-step status="default"
                    title="{{item.title}}"
                    content="{{item.content}}"
                    icon="{{item.icon}}" iconCurrent="{{item.iconCurrent}}"></wux-step>
        </repeat>
      </wux-steps>
    </view>
  </view>
</template>
<script>
import wepy from "wepy";
import api from "../../config/api";
import log from "../../util/log";
export default class Transportinfo extends wepy.page {
  config = {
    navigationBarTitleText: "订单跟踪",
    usingComponents: {
      "wux-steps": "../../plugin/wux/steps/index",
      "wux-step": "../../plugin/wux/step/index"
    }
  };
  data = {
    TransportList: [
      {
        title: '已签收',
        content: [{ time: '2019-11-11 09:12:39', con: '您的订单已签收，如有疑问您可以联系配送员（快递员：xxxx,电话：12333333335）确认，感谢您的购物，欢迎下次光临' }],
        status: 0,
        icon: '../../images/icon-track1-disb.png',
        iconCurrent: '../../images/icon-track1.png',
      },
      {
        title: '派送中',
        content: [{ time: '2019-11-11 06:12:39', con: '您的包裹正在派送中（快递员：xxx,电话：15317765009)请耐心等待' }],
        status: 0,
        icon: '../../images/icon-track2-disb.png',
        iconCurrent: '../../images/icon-track2.png',
      },
      {
        title: '运输中',
        content: [{ time: '2019-11-11 10:41:20', con: '您的订单由发货地发往北京分拨中心' }, { time: '2019-11-11 10:25:20', con: '您的订单由发货地发往北京分拨中心' }, ],
        status: 0,
        icon: '../../images/icon-track3-disb.png',
        iconCurrent: '../../images/icon-track3.png',
      },
      {
        title: '已发货',
        content: [{ time: '2019-11-11 10:00:20', con: '您的包裹正在等待揽收' }],
        status: 0,
        icon: '../../images/icon-track4-disb.png',
        iconCurrent: '../../images/icon-track4.png',
      },
      {
        title: '已揽件',
        content: [{ time: '2019-11-11 10:00:20', con: '义务营销部快递员已揽收，联系电话：13912345678' }],
        status: 0,
        icon: '../../images/icon-track5-disb.png',
        iconCurrent: '../../images/icon-track5.png',
      },
      {
        title: '已出库',
        content: [{ time: '2019-11-11 10:00:20', con: '您的包裹已出库' }],
        status: 0,
        icon: '../../images/icon-track6-disb.png',
        iconCurrent: '../../images/icon-track6.png',
      },
      {
        title: '已下单',
        content: [{ time: '2019-11-11 10:00:20', con: '您提交了订单，正等待系统处理' }],
        status: 0,
        icon: '../../images/icon-track7-disb.png',
        iconCurrent: '../../images/icon-track7.png',
      },
    ]
  };


  methods = {};
}
</script>
<style>
.copy-btn {
  display: inline-block;
  background: #f2f2f2;
  margin-left: 40rpx;
  padding: 1rpx 8rpx;
  border-radius: 14rpx;
}
.my-page__hd {
  background: #fff;
  width: 670rpx;
  margin: 0 auto;
  border-radius: 14rpx;
  padding: 30rpx 20rpx 20rpx 20rpx;
}
.topExpress {
  width: 710rpx;
  height: 155rpx;
  background: #fff;
  margin: 20rpx auto;
  display: flex;
  border-radius: 10rpx;
}
.topExpress-left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.topExpress-right {
  font-size: 26rpx;
  color: #333;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: flex-start;
  padding: 20rpx 0;
}

.topExpress-right-middle {
  font-size: 22rpx;
}

.topExpress-right-bottom {
  font-size: 20rpx;
  color: #666;
}
.topExpress-left image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  padding: 10rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
}
.topExpress-right-bottom image {
  width: 25rpx;
  height: 25rpx;
  position: relative;
  top:6rpx;
  left: 6rpx;
}
</style>
