<template>
    <div class="forget" >
        <div class="content" v-loading="loading">
            <div class="navigation">
                <el-steps :active="active" simple>
                    <el-step title="步骤 1" icon="el-icon-ship"></el-step>
                    <el-step title="步骤 2" icon="el-icon-s-promotion"></el-step>
                    <el-step title="步骤 3" icon="el-icon-success"></el-step>
                </el-steps>
            </div>

            <div class="interface">
                <div class="template" v-show="active === 1">
                    <el-input 
                    v-model.trim="username" 
                    placeholder="请输入用户名" 
                    prefix-icon="el-icon-user"
                    @blur="checkUsername"></el-input>
                    <div class="message">{{PromptInformation}}</div>
                    <el-button-group class="email_btn" style="top:19%">
                        <el-button type="primary" icon="el-icon-arrow-left" disabled>上一步</el-button>
                        <el-button type="primary" @click="toInputEmailCode">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                    </el-button-group>
                </div>
                <div class="template" v-show="active === 2">
                    <div style="height:20px;width:100%;">
                        <el-input v-model="emailCode" 
                        placeholder="请输入验证码" 
                        prefix-icon="el-icon-key" 
                        maxlength="4"></el-input>
                        <a class="getEmailCodeStyle"  v-show="showMessage" @click="sendEmail">{{message}}</a>
                        <a class="waitEmailCodeStyle"  v-show="!showMessage">{{countdown}}后重新发送</a>
                    </div>

                    <el-button-group class="emailCode_btn">
                        <el-button 
                        type="primary" 
                        icon="el-icon-arrow-left" 
                        @click="toInputUsername">上一步</el-button>
                        <el-button 
                        type="primary" 
                        @click="toSuccess">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                    </el-button-group>
                </div>
                <div class="" v-show="active === 3">
                    <el-result 
                    icon="success" 
                    title="重置成功" 
                    subTitle="点击下方按钮前往登陆">
                        <template slot="extra">
                            <el-button type="primary" size="medium" @click="toLogin">去登录</el-button>
                        </template>
                    </el-result>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

export default{
    data(){
        return{
            active:1,
            username:"",
            email:"",
            emailCode:"",
            message:"发送验证码",
            message_flag:true,
            timer:null,
            countdown:60,
            showMessage:true,
            PromptInformation:"",
            loading:false,
        }
    },
    methods:{
        checkUsername(){
            if(this.username === ""){
                this.PromptInformation = "请输入重试";
            }else{
               axios({
                method:"get",
                url:"/verification/checkUserNameUnique",
                params:{
                    userName:this.username
                }
            }).then(res => {
                if(res.data === false){
                    this.PromptInformation = "";
                }else{
                    this.PromptInformation = "查无用户";
                }
            }).catch(error => {
                console.error(error);
            }) 
            } 
        },
        toInputEmailCode(){
            if(this.username === "" || this.username === null){
                this.$message.error("请输入内容重试")
            }else if(this.PromptInformation != ""){
                this.$message.error("请根据提示进行修改")
            }else{
               this.$axios({
                method:"post",
                url:"/verification/emailOfUserName",
                params:{
                    userName:this.username
                }
            }).then(res => {
                if(res.data.code === 200){
                    if(res.data.msg === "" || res.data.msg === null){
                        this.$message.error(res.data.msg)
                    }else{
                        this.eamil = res.data.msg;
                        this.active = 2;
                    }
                }else{
                    this.$message.error(res.data.msg)
                }
            }).catch(error => {
                console.error(error);
            }) 
            }    
        },
        countDown(){
            this.showMessage = false;
            this.message = "重新发送";
            this.timer = setInterval(() => {
                if(this.countdown > 0){
                    this.countdown --;
                }else{
                    this.showMessage = true;
                    this.countdown =  60;
                    this.timer = null;
                }
            },1000)
        },
        sendEmail(){
            if(this.eamil === ""){
                this.$message.error("邮箱为空,请输入重试")
            }else{
                this.loading = true;
                this.$axios({
                method:"get",
                url:"/verification/sendEmail",
                params:{
                    email:this.eamil
                }
            }).then(res => {
              console.log(res)
                if(res.data.code === 200){
                    this.loading = false;
                    this.$message.success(res.data.msg)
                    this.countDown();
                }else{
                    this.loading = false;
                    this.$message.error(res.data.msg);
                }
            }).catch(error => {
                this.loading = false;
                console.error(error)
            })
            }
        },
        toInputUsername(){
            this.active = 1;
        },
        toSuccess(){
            if(this.emailCode === ""){
                this.$message.warning("请输入验证码后重试")
            }else{
                this.$axios({
                    method:"post",
                    url:"/verification/resetPassWord",
                    params:{
                        userName:this.username,
                        emailCode:this.emailCode,
                        email:this.eamil,
                    }
                }).then(res =>{
                    if(res.data.code === 200){
                        this.$message.success("重置成功")
                        this.active = 3;
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }).catch(error =>{
                    console.error(error);
                })
            }
        },
        toLogin(){
            this.$router.replace("/login")
        }
    },
}
</script>


<style scoped>
.forget{
    position: fixed;
    height: 100%;
    width: 100%;
    background-image: url(../assets/img/foegetBG.png);
    background-repeat: no-repeat;
    background-clip: border-box;
    overflow: hidden;
    background-size: 100% 100%;
}
.content{
    position: absolute;
    height: 40%;
    width: 40%;
    top: 25%;
    left: 30%;
    background-color:white;
  border-radius: 10px;
    opacity: 0.95;
}
.navigation{
    position: relative;
    height: 46px;
    width: 100%;
    background-color: beige;
    border-bottom: 1px solid rgba(0, 0, 0, 0.275);

}
.interface{
    position: relative;
    height: 90%;
    width: 100%;
    /* background-color: blueviolet; */
}
.template{
    position: relative;
    height: 40%;
    width: 40%;
    left: 30%;
    top: 30%;
}
.email_btn{
    position: relative;
    top: 40%;
    left: 15%;
}

.emailCode_btn{
    position: relative;
    top:54.5%;
    left: 15%;
}
.getEmailCodeStyle{
    position: relative;
    font-size: 12px;
    color: #1999e9;
    top:-33px;
    left: 230px;
    cursor:pointer;
    width: 20px;
    text-align: center;
    z-index: 10;
}
.waitEmailCodeStyle{
    color: #767f8b;
    position: relative;
    font-size: 12px;
    top:-33px;
    left: 220px;
    cursor:no-drop;
    width: 20px;
    text-align: center;
    z-index: 10;
}
.successImg{
    position: relative;
    left: 342px;
    top: 60px;
}
.message{
    height: 30px;
    justify-items: center;
    align-items: center;
    color: red;
    font-size: 12px;
    margin-left: 5px;
}
</style>