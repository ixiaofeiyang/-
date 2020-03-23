import wepy from 'wepy';
import moment from 'moment'
import api from "../../config/api";
if (!Object.entries) {
    Object.entries = function(obj) {
        console.log('into rewrite object entry')
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}
export default class ShopcartMixin extends wepy.mixin {
    data = {
        cartDatas: {},
        _iscartupdated: false,
        _interval1: null,
        _lastcartupdatetime: null,
    }
    async onShow() {
        let counter = 0;
        while (true) {
            if (this.$parent.globalData.isSavingCart) {
                counter++;
                if (counter > 200) break;
                if (counter % 4 == 0) console.log("wait for isSavingCart");
                await this.$parent.globalData.sleep(50);
            } else {
                break;
            }
        }
    }
    async forceSaveCart() {

        this.$parent.globalData.isSaving4TabChange = true;
        //console.log("isSaving4TabChange is ", true)
        await this.saveCart({
            force: true
        });
        this.$parent.globalData.isSaving4TabChange = false;
        //console.log("isSaving4TabChange is ", false)
    }
    async onHide() {
        console.log("into minin onhide function")
        await this.forceSaveCart()
    }
    onLoad() {
        console.log("into mixin shopcart onload")
        clearInterval(this._interval1);
        this._interval1 = setInterval(() => {
            this.saveCart();
        }, 2000);
        this.$apply();
    }
    watch = {
        async cartDatas(newValue, oldValue) {
            this._iscartupdated = true;
            this._lastcartupdatetime = new Date().getTime();
            this.$apply();
            console.log(`cartDatas value: ${oldValue} -> ${newValue}`);
        }
    };
    async getRemoteShopCart() {
        let resultList = await this.$parent.globalData.get(
            `${api.server}/api/ec/b2c/cart/mylist?page=0&size=999999`
        );
        console.log(resultList);
        if (resultList.state !== "error") {
            //wx.setStorageSync("cart", resultList.rows);
            let cartDatas = {};
            resultList.rows.forEach(element => {
                if (!!element.Sku)
                    cartDatas[element.Sku.id] = {
                        amount: element.amount
                    };
            });
            
            let nowCart = JSON.parse(JSON.stringify(cartDatas));
            wx.setStorageSync("oldCart", nowCart);
            this.cartDatas = cartDatas;
            this.setCartBadgeNum();
            this.$apply();
        }
    }
    setCartBadgeNum() {
        let amount = this.getCartAmount();
        if (amount > 0) {
            wx.setTabBarBadge({
                index: 2,
                text: amount.toString()
            })
        } else {
            wx.removeTabBarBadge({
                index: 2
            })
        }
    }
    getCartAmount() {
        let cartDatas = this.cartDatas
        let cartAmount = 0
        if (cartDatas && Object.keys(cartDatas).length > 0) {
            Object.values(cartDatas).map(item => {
                cartAmount += item.amount
            })
        }
        return cartAmount
            /*
		console.log("into update Cart badge num, the cart is ", cartDatas)
		wx.setTabBarBadge({
			index: 1,
			text: cartAmount.toString()
		})
		wx.removeTabBarBadge({ index: 1 })
		*/
    }
    add2CartAction(e) {
        this.needUserinfo = this.$parent.globalData.needUserinfo
        if (this.needUserinfo) {
            this.$broadcast("showUserInfo");
            return;
        }
        if (this.$parent.globalData.isAdding) {
            return;
        }
        this.$parent.globalData.isAdding = true
        let item = e.target.dataset;
        this.cartDatas = this.cartDatas || {};
        let cartDatas = this.cartDatas;
        if (item.stock < 1) {
            wx.showToast({
                title: "库存不足",
                icon: "none",
                duration: 2000
            });
            return false;
        }
        item.cartAmount = 1;
        cartDatas[item.skuid] = cartDatas[item.skuid] || {
            amount: 0
        };
        cartDatas[item.skuid].amount = cartDatas[item.skuid].amount + 1;
        this.updateCart();
    }
    cartNumDownAction(e) {
        let id = e.currentTarget.dataset.id;
        console.log('into cart num down the id is', id)
        let cartDatas = this.cartDatas;
        for (let [key, item] of Object.entries(cartDatas)) {
            if (id.toString() === key.toString()) {
                if (item.amount <= 0) {
                    item.cartAmount = 0;
                } else {
                    item.amount = item.amount - 1;
                    this.updateCart();
                }
                break;
            }
        }
    }
    cartNumUpAction(e) {
        let id = e.currentTarget.dataset.id;
        let cartDatas = this.cartDatas;
        console.log("cartNumUp", id);
        for (let [key, item] of Object.entries(cartDatas)) {
            if (id.toString() === key.toString()) {
                item.amount = item.amount + 1;
                this.updateCart();
                break;
            }
        }
    }
    async saveCart(options) {
        //console.log('into regular save cart process, this.iscartupdated  is ', this._iscartupdated)
        //这里拿到最后更新时间
        let now = new Date().getTime();
        let lastcartupdatetime = this._lastcartupdatetime;
        if (!!options && options.force) {
            //do nothing
        } else {
            if (now - lastcartupdatetime < 2000) {
                return;
            }
            if (!this._iscartupdated) {
                return;
            }
        }
        this.$parent.globalData.isSavingCart = true;
        let storageCart = wx.getStorageSync("oldCart");
        let nowCart = JSON.parse(JSON.stringify(this.cartDatas));
        //console.log("storageCart is ", storageCart)
        //console.log("nowCart is ", nowCart)

        let diff = {};
        for (let [k, v] of Object.entries(nowCart)) {
            if (!storageCart[k]) {
                diff[k] = v;
                continue;
            }
            if (storageCart[k].amount !== v.amount) {
                diff[k] = v;
            }
        }
        console.log("diff is ", diff);
        let all = [];
        for (let [k1, v1] of Object.entries(diff)) {
            all.push({
                skuid: k1,
                amount: v1.amount
            });
        }
        if (all.length > 0) {
            console.log("really update cart");
            let result = this.$parent.globalData.post(
                `${api.server}/api/ec/b2c/cart/set`, {
                    cart_list: all
                }
            );
            console.log(result);
        }
        wx.setStorageSync("oldCart", nowCart);
        if (lastcartupdatetime == this._lastcartupdatetime) {
            this._iscartupdated = false;
        }
        this.$parent.globalData.isSavingCart = false;
    }
    methods = {
        testmixinfn1() {
            console.log("into test mixin fn1")
        },
        add2Cart(e) {
            this.add2CartAction(e)
        },
        // 购物车减
        cartNumDown(e) {
            this.cartNumDownAction(e)
        },
        // 购物车加
        cartNumUp(e) {
            this.cartNumUpAction(e)
        },
    }
}