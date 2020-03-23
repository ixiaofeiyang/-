/**
 * 支付相关服务
 */

const util = require('../util/util.js');
const api = require('../config/api.js');

/**
 * 判断用户是否登录
 */
function payOrder(orderId) {
  return new Promise(function (resolve, reject) {
    let resultpay = this.$parent.globalData.get(
      `${api.server}/api/shop/pay/prepay?orderId=${this.orderId}`
    );
      console.log(resultpay)
      if (resultpay.errno === 0) {
        const payParam = resultpay.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (resultpay) {
            resolve(resultpay);
          },
          'fail': function (resultpay) {
            reject(resultpay);
          },
          'complete': function (resultpay) {
            reject(resultpay);
          }
        });
      } else {
        reject(resultpay);
      }
  });
}


module.exports = {
  payOrder,
};











