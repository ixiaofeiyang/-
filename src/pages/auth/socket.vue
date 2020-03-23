<template>
<view class="page">
    <view style="margin:60px 0">
        <view class="zan-btns">
            <button class="zan-btn zan-btn--primary" bindtap="agree"> 确认登陆 </button>
        </view>    
    </view>
</view>

</template>
<script>
    import wepy from 'wepy'
    import config from '../../config/api'
    import socketio from '../../util/socketmp'

    export default class loginPc extends wepy.page {
        
        config = {"navigationBarTitleText": "socket"}

        components= {
        }

        data = {
            key: ''
        }
        
        async onLoad(options) {
            
            const chat = socketio('ws://io.yunxiaoxin.com')
            chat.on('connect', data => {
                chat.emit('authentication', { token: `${this.$parent.globalData.token}`,client: 'wxapp' });
            })

            chat.on('authenticated', function (authMsg) {
                console.log(authMsg)
                if(authMsg=="success"){
                    chat.emit('join', { roomid: 'courseid001' });//发送加入事件
                }else if(authMsg=="error"){
                    console.error('======auth error 用户信息错误')
                }else{
                    console.error("socket 异常")
                }
            });

            chat.on('m:sys', data => {
                console.log("加入 room success",data)
            })

        }

        methods = {
        }
    }
</script>
