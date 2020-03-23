import wepy from 'wepy';
import moment from 'moment'
import api from "../../config/api";
export default class Check23clockMixin extends wepy.mixin {
    data = {
        currenttime: ''
    }
    onLoad() {}
    async onShow() {
            //必须等token才去请去请求
            let counter = 0;
            while (true) {
                if (wx.getStorageSync("user:token")) {
                    break;
                } else {
                    counter++;
                    // if (counter > 60) break;
                    console.log("in check23clock,onshow, sleep " + counter);
                    await this.$parent.globalData.sleep(50);
                }
            }
            await this.getCurrentTime()
                //console.log('Check22clockMixin onshow');
            let now = moment(this.currenttime)
            let clock22 = moment({
                hour: 22
            })
            this.$parent.globalData.isShopOpen = now.isAfter(clock22)
            if (this.$parent.globalData.isShopOpen) {
                if (this.$parent.globalData.ifForceOpenShop) {

                } else {
                    wx.reLaunch({
                        url: '/pages/user/time'
                    })
                }

            }
        }
        // 获取服务器的当前时间
    async getCurrentTime() {
        let result = await this.$parent.globalData.get(
            `${api.server}/auth/currentTime`
        );
        this.currenttime = this.$parent.globalData.currenttime = result.currenttime;

        // 服务器时间 和当前时间的差值
        this.$parent.globalData.diffTime = new Date().getTime() - this.currenttime
    }
}