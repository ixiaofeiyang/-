import wepy from 'wepy';
import {
    getCurrentPageUrlWithArgs
} from '../../util/util'

export default class auth extends wepy.page {
    async onLoad(options) {
        if (!this.$parent.globalData.launched) {
            let counter = 0
            while (true) {
                if (!this.$parent.globalData.launched) {
                    counter++;
                    if (counter > 200) break;
                    if (counter % 4 == 0)
                        console.log('wait for appPrepare')
                    await this.$parent.globalData.sleep(50)
                } else {
                    break;
                }
            }
            console.log("while loop is over , into super auth logic")
        }
        let userinfo = this.$parent.globalData.userInfo = this.$parent.globalData.userInfo || wx.getStorageSync('user:detail') || {};
        userinfo.isRegister = !!userinfo.nickname;
        if (!userinfo.isRegister) {
            let array = this.getCurrentPages();

            var params = Object.keys(options).map(function(key) {
                return (key) + "=" + (options[key]);
            }).join("&");
            this.$parent.globalData.route = encodeURIComponent(array[array.length - 1].route + "?" + params)
            this.$parent.globalData.needUserinfo = true
            console.log("user is not register, save route and set needUserinfo = true and show user info modal");
            //return false
        }
        return true
    }
}