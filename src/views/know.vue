<template>
    <div>
        <el-container>
            <el-header id="head" class="fixedStyle">
                <el-menu
                :default-active="activeIndex"
                class="el-menu-demo fixedStyle"
                mode="horizontal"
                @select="handleSelect"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                >
                <el-menu-item index="1" @click="page = 0"><i class="el-icon-s-home"></i>首页</el-menu-item>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-collection"></i>书城</template>
                    <el-menu-item index="2-1" @click="page = 1"><i class="el-icon-trophy"></i>排行榜</el-menu-item>
                    <el-menu-item index="2-2" @click="page = 2"><i class="el-icon-folder"></i>书库</el-menu-item>
                    <el-menu-item index="2-3" @click="page = 5"><i class="el-icon-help"></i>求书</el-menu-item>
                </el-submenu>
                <el-menu-item index="3" @click="page = 4"><i class="el-icon-chat-line-square"></i>论坛</el-menu-item>
                </el-menu>
                <div class="avator">
                    <el-row>
                        <el-col :span="2"><div style="height:10px;width:100%"></div></el-col>
                        <el-col :span="8">
                            <img :src="require('@/static/author/' + user.avator)" class="fixedStyle avatorImg" />
                        </el-col>

                        <el-col :span="14" >
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link" style="color:white;line-height: 55px;cursor: pointer;">
                                    <span @click="toLogin" style="max-width: 18px;">{{ user.nickName }}</span>
                                    <i class="el-icon-arrow-down el-icon--right" v-show="isLogin"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" v-if="isLogin">
                                    <el-dropdown-item command = "0">个人中心</el-dropdown-item>
                                    <el-dropdown-item command = "1">切换账号</el-dropdown-item>
                                    <el-dropdown-item command = "2" divided>退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>
                </div>
            </el-header>
            <el-main id="main">
                    <div id="message">
                        <el-dropdown trigger="click" placement="top" @command="messageCommand">
                            <el-badge is-dot class="item" :hidden="reminder">
                            <el-button type="primary" id="messageButton">
                                <i class="el-icon-arrow-up el-icon--right" id="messageIcon"></i>
                            </el-button>
                            </el-badge>
                                <el-dropdown-menu slot="dropdown" >
                                <el-dropdown-item class="clearfix" command = "0">
                                    发帖
                                </el-dropdown-item>

                                <el-dropdown-item class="clearfix" command = "2">
                                    通知
                                    <el-badge class="mark" :value="repliesNumber" />
                                </el-dropdown-item>

                                  <el-dropdown-item class="clearfix" command = "1">
                                    私信
                                  <el-badge class="mark" :value="commentNumber" />
                                </el-dropdown-item>

                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>

                <div class="content" :key="appKey">
                    <router-view></router-view>
                </div>
                <el-backtop :visibility-height="60"></el-backtop>
            </el-main>
            <el-footer id="footer">
                <p>毕设项目,仅供学习参考.</p>
            </el-footer>
        </el-container>
    </div>
</template>

<script>

import { createSocket,sendWSPush,closeWs } from '../static/js/websocket.js';

export default{
    data(){
        return{
            activeIndex: "1",
            page:0,
            user:{
                userId:"",
                avator:"default.jpg",
                nickName:"去登陆",   
            },
            reminder:true,
            isLogin: localStorage.getItem("isLogin"),
            commentNumber:0,
            repliesNumber:0,
            appKey:new Date().getTime(),
        }
    },
    created(){
        // this.requestUser();
    },
    mounted(){
        //切换组件时滚动移到顶部
        this.init();
    },
    beforeDestroy(){
        if (localStorage.getItem("token") != null){
            this.handleClose();
        } 
    },
    methods:{
        toLogin(){
            if(!this.isLogin){
               this.$router.replace("/login") 
            }
        },
        handleSelect(key) {
            if(key === '1'){
                this.$router.push("/know/home")
            } else if(key === '2-1'){
                this.$router.push("/know/ranking")
            } else if (key === '2-2') {
                this.$router.push("/know/category")
            } else if (key === '2-3') {
                this.$router.push("/know/help")
            } else if (key === '3') {
                this.$router.push("/know/forum")
            }
      },
      handleCommand(command){
        if(command === "0"){
            this.activeIndex = '0';
            this.page = 3;
            this.$router.push("/know/personalData")
        }else if(command === "1"){
            this.$router.replace({path: '/login'})
        }else if(command === "2"){
            //退出登录
            localStorage.removeItem('Authorization');
            this.$store.commit("changeLogin", "")
            this.$router.push('/login');
        }
      },
      messageCommand(command){
        // 发帖、评论、回复
        if(command === "0"){
            // 需在登录的情况下进行跳转
            this.$router.push("/release")
        }
      },
      requestUser(){
          if (localStorage.getItem("Authorization") != ""){
            this.$axios({
                method:"post",
                url:"/user/getUserInfo",
                headers: {// 设置请求头
                    token: localStorage.getItem("token")
                }
            }).then(res => {
                if(res.data.code === 200){
                   this.user = res.data.data;
                   localStorage.setItem("isLogin",true);
                   this.isLogin = true;
                    this.wsConnect();
                }else{
                    localStorage.setItem("isLogin", false);
                    this.isLogin = false;
                    localStorage.removeItem("token")
                }
            }).catch(error => {
              console.log(error)
            })
          }
      },
      wsConnect(){
        createSocket(this.user.userId);
         this.getSocketData = (e) => {
            let data = e && e.detail.data
            if(data){
                data = JSON.parse(data)
                console.log(data)
                if(data.code === 200){
                    this.reminder = data.data.received;
                    if (data.data.comment){
                        this.commentNumber++;
                    }
                    if (data.data.replies){
                        this.repliesNumber++;
                    }
                }else{
                    this.$message.success(data.msg);
                    // commentNumber: "",
                    // repliesNumber: "",
                }
                let json = JSON.stringify(data)
                if(json.event == "open"){
                    let msg = { "event": "open_screen", " to_user": this.user.userId}
                    sendWSPush(msg)
                }
            }
         }
         window.addEventListener("onmessageWS", this.getSocketData)
      },
      handleClose(){
        let msg = { "event": "close_screen", " to_user": this.user.userId}
        sendWSPush(msg);
        closeWs()
        window.removeEventListener("onmessageWS", this.getSocketData)
      },
     
      init(){
        this.requestUser()
      }
    },
    watch:{
      '$route':function(newUrl,oldUrl){
        this.appKey=new Date().getTime();
      }
    },
}

//配置文件
const config = {
    pluginRootPath: 'static/live2dw/',//插件在站点上的根目录(相对路径)
    pluginJsPath: 'assets/libs/',//脚本文件相对与插件根目录路径
    pluginModelPath: 'live2d-widget-model-hijiki/assets/',//模型文件相对与插件根目录路径
    tagMode: false,//标签模式, 是否仅替换 live2d tag标签而非插入到所有页面中
    debug: true,//调试, 是否在控制台输出日志
    name: {
        canvas: 'MId'//自定义cavas标签的id（可不需要）
    },
    model: {
        jsonPath: '/live2dw/live2d-widget-model-hijiki/assets/hijiki.model.json', //主文件路径
        scale: 1,//模型与canvas的缩放
    },
    display: {
        superSample: 2, // 超采样等级
        position: 'left', //显示位置：左或右
        width: 200,// canvas的长度
        height: 250,//canvas的高度
        hOffset: 0,//canvas水平偏移
        vOffset: 0,//canvas垂直偏移
    },
    react: {//透明度条件
        opacityDefault: 1,//默认透明度
        opacityOnHover: 0.5//鼠标移上透明度
    },
    dev: {
        border: false,//在canvas周围显示边界
    },
    mobile: {
        show: true,//是否在移动设备上显示
        scale: 0.5,//移动设备上的缩放
        motion: true, // 移动设备是否开启重力感应
    },
    log: false,
    dialog: {
        enable: false,//显示人物对话框
        hitokoto: false,//使用一言API
    }
};
// eslint-disable-next-line no-undef
L2Dwidget.init(config)
</script>

<style scoped>
#head{
    background-color:#545c64;
    padding-left:19rem;
    width: 100%;
}
#main{
    background-color: #F3F3F3;
}
#footer{
    background-color: #545c64;
    color: white;
}
#footer p{
    text-align: center;
    font-size: 12px;
    line-height: 40px;
    padding-bottom: 0px;
}
.content{
    background-color: white;
    position: relative;
    margin-left: 15%;
    margin-top:70px;
    width: 70%;
    height: auto;
}
.fixedStyle{
    position: fixed;
    z-index: 2001;
}
.avator{
    position: fixed;
    height: 60px;
    width: 150px;
    right: 18.8rem;
    justify-items: center;
    align-items: center;
}
.avatorImg{
    position: relative;
    left: 0;
    border-radius: 20px;
    margin-top: 7px;
    height: 40px;
    width: 40px;
}

#releaseStyle{
    position:fixed;
}
#message{
    height: 65px;
    width: 65px;
    position: fixed;
    right: 100px;
    bottom: 100px;
    /* background-color: rgb(188, 181, 194); */
    border-radius: 50%;
}
.messageIcon{
    position: relative;
    height: 100px;
    width: 100px;
    top:30%;
    left:30%;
    font-size:25px;
}
#messageButton{
    height: 60px;
    width: 60px;
    border-radius: 50%;
}
#messageIcon{
    font-size: 20px;
    position: absolute;
    left: 25%;
    top: 32%;
}
</style>