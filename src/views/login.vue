<template>
<div id="background">
<div :class="container" id="login-box">

<!-- 登录 -->
<div class="form-container sign-in-container"> 
    <div class="login">
        <h1 style="margin-bottom: 40px;">登录</h1>
        <el-input
        v-model.trim="userNameOfL" 
        placeholder="请输入用户名"
        prefix-icon="el-icon-user"
        minlength="4"
        maxlength="8"
        > 
        </el-input>
        <div style="margin-top:35px"></div>
        <el-input
        v-model.trim="passwordOfL" 
        placeholder="请输入密码"
        prefix-icon="el-icon-ship"
        minlength="6"
        maxlength="12"
        @keyup.enter.native="login"
        show-password> 
        </el-input>
        <div class="forget_text" @click="forgetPassword()">忘记密码</div>
        <el-button type="primary" class="btn" @click="login">登录</el-button>
    </div>
</div>

<!-- 注册 -->
<div class="form-container sign-up-container">
    <div class="register">
        <h1 style="margin-bottom: 40px;">注册</h1>
        <el-input
        v-model.trim="userNameOfR" 
        placeholder="请输入用户名"
        prefix-icon="el-icon-user"
        @blur="checkUserNameUnique()"
        minlength="4"
        maxlength="8"
        > 
        </el-input>
        <div class="message"><span>{{userNameOfRMessage}}</span></div>
        <el-input
        v-model.trim="emailOfR" 
        placeholder="请输入邮箱"
        prefix-icon="el-icon-message"
        @blur="checkEmailUnique()"
        style="width:300px"
        > 
        </el-input>
        <div class="message"><span>{{emailOfRMessage}}</span></div>
        <el-input
        v-model.trim="passwordOfR" 
        placeholder="请输入6-12位密码"
        prefix-icon="el-icon-ship"
        minlength="6"
        maxlength="12"
        @blur="checkPasswordStrength"
        show-password> 
        </el-input>
        <div class="message"><span>{{passwordOfRMessage}}</span></div>
        <el-button type="primary" class="btn" style="margin-top:0px" @click="register()">注册</el-button>
    </div>
</div>


<div class="overlay-container">
        <div class="overlay">
            <div class="overlay-panel overlay-left">
                <h1>已有账号？</h1>
                <p>请使用您的账号进行登录</p>
                <button class="ghost" @click="signIn()" >登录</button>
            </div>
            <div class="overlay-panel overlay-right">
                <h1>没有账号?</h1>
                <p>立即注册加入我们，和我们一起开始旅程吧</p>
                <button class="ghost" @click="signUp()">注册</button>
            </div>
        </div>
</div>
</div>
</div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
export default{

    data(){
        return{
            container:["container","right-panel-active"],
            userNameOfR:"",
            emailOfR:"",
            passwordOfR:"",
            userNameOfL:"",
            passwordOfL:"",
            userNameOfRMessage:"",
            emailOfRMessage:"",
            passwordOfRMessage:"",
            token:""
        }
    },
    created(){

    },
    methods:{
        signIn(){
            this.container = ["container"];
            this.emailOfR = "",
            this.passwordOfR = "",
            this.userNameOfR = "",
            this.userNameOfRMessage = "",
            this.emailOfRMessage = "",
            this.passwordOfRMessage = ""
        },
        signUp(){
            this.container = ["container","right-panel-active"];
        },
        checkUserNameUnique(){
            if(this.userNameOfR === null || this.userNameOfR === ''){
                this.userNameOfRMessage = "用户名不能为空"
            }else if(this.userNameOfR.length < 4){
                this.userNameOfRMessage = "用户名过短";
            }else{
                this.$axios.get("/verification/checkUserNameUnique",
            {
                params:{ "userName":this.userNameOfR}
            })
                .then(res => {
                if(res.data){
                    this.userNameOfRMessage = "";
                }else{
                    this.userNameOfRMessage = "用户名已存在"
                }
            }).catch( error => {
                this.userNameOfRMessage = "服务端异常";
                console.error(error)
            }) 
            }
           
        },
        checkEmailUnique(){
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if(this.emailOfR === null || this.emailOfR === ''){
                this.emailOfRMessage = "邮箱不能为空";
            }else if(mailReg.test(this.emailOfR)){
                this.$axios.get("/verification/checkEmailUnique",
                {
                params:{"email":this.emailOfR}
                })
                .then(res => {
                if(res.data){
                    this.emailOfRMessage = "";
                }else{
                    this.emailOfRMessage = "邮箱已存在";
                }
            }).catch( error => {
                this.emailOfRMessage = "服务端异常";
                console.error(error)
            })
            }else{
                this.emailOfRMessage = "格式错误"
            }
        },
        checkPasswordStrength(){
            if(this.passwordOfR.length === 0){
                this.passwordOfRMessage = "密码不能为空"
            }else if(this.passwordOfR.length < 6){
                this.passwordOfRMessage = "密码长度过短";
            }else if(this.passwordOfR.length > 12){
                this.passwordOfRMessage = "密码长度过长";
            }else{
                this.passwordOfRMessage = "";
            }
        },
        register(){
            if(this.userNameOfR === "" || this.emailOfR === "" || this.passwordOfR === ""){
                this.$message.warning("请填写信息重试")
            }else if(this.userNameOfRMessage === "" && this.emailOfRMessage == "" && this.passwordOfRMessage === ""){
                this.$axios.post("/verification/register",
                qs.stringify({
                    userName:this.userNameOfR,
                    email:this.emailOfR,
                    password:this.passwordOfR
                })).then(res => {
                    if(res.data.code === 200){
                        this.$message.success(res.data.msg)
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        });
                    }
                    this.userNameOfL = this.userNameOfR;
                    this.passwordOfL = this.passwordOfR; 
                    this.userNameOfR = "";
                    this.emailOfR = "";
                    this.passwordOfR = "";
                    this.signIn();
                }).catch(error => {
                    this.$message.error("服务端异常")
                    console.error(error)
                })
            }else{
                this.$message.error("请按提示进行错误改正")
            }
        },
        login(){
            this.$axios({
                method:"post",
                url:"/user/login",
                params:{
                    username:this.userNameOfL,
                    password:this.passwordOfL
                }
            }).then(res => {
                if(res.data.code === 200){
                    this.$store.commit("changeLogin",res.data.msg,true)
                  if(res.data.data){
                    this.open();
                  }else{
                    this.$router.replace("/")
                  }
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'warning'
                    });
                }
            }).catch(error => {
                this.$message({
                    message: error,
                    type: 'error'
                });
            })
        },
      open(){
          this.$confirm('您好本站的管理人员，选择您想要进入的页面？', '跳转提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '用户界面',
            cancelButtonText: '管理界面'
          })
              .then(() => {
                this.$router.replace("/");
              })
              .catch(action => {
                if(action == 'cancel'){
                  this.$router.replace("/backstage");
                  this.$message.success("欢迎回来，亲爱的管理")
                }
              });
      },
      forgetPassword(){
        this.$router.push("/forget")
      },
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

h1 {
    font-weight: bold;
    margin: 0;
    text-align: center;
}
p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: .5px;
    margin: 20px 0 30px;
}
span {
    font-size: 12px;
}
a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
}
input{
    width: 250px;
}
.btn{
    margin-top: 20px;
    margin-left: 100px;
}
#background{
    font-family: 'Montserrat',sans-serif;
    background-image: linear-gradient(120deg,#3498db,#8e44ad);;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
#login-box{
    display: flex;
    position: fixed;
    height: 60%;
    width: 50%;
    left: 25%;
    top: 20%;
}
.login{
    position: relative;
   
    width: 300px;
    margin: 20px;
    top: 100px;
    left: 60px;
}
.register{
    position: relative;
    width: 300px;
    margin: 20px;
    top: 100px;
    left: 60px;
}
.container {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;   

}
.message{
    height: 30px;
    justify-items: center;
    align-items: center;
    color: red;
    font-size: 14px;
    margin-left: 5px;
}
.forget_text{
    font-size:12px;
    color: rgb(0, 162, 255);
    margin-top: 10px;
    text-align: right;
    cursor: pointer;
}
.forget_text:hover{
    color: #8e44ad;
}
.errorStyle{
    border-color: red !important;
}
.form-container form {
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    justify-content: center;
    text-align: center;
}
.social-container {
    margin: 20px 0;
}

.social-container a {
    border: 1px solid #ddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
}

.social-container a:hover {
    background-color: #eee;

}

.txtb {
    border-bottom: 2px solid #adadad;
    position: relative;
    margin: 10px 0;
}

.txtb input {
    font-size: 15px;
    color: #333;
    border: none;
    width: 100%;
    outline: none;
    background: none;
    padding: 0 3px;
    height: 35px;
}

.txtb span::before {
    content: attr(data-placeholder);
    position: absolute;
    top: 50%;
    left: 5px;
    color: #adadad;
    transform: translateY(-50%);
    transition: .5s;
}
.txtb span::after {
    content: '';
    position: absolute;
    left: 0%;
    top: 100%;
    width: 0%;
    height: 2px;
    background-image: linear-gradient(120deg,#3498db,#8e44ad);
    transition: .5s;
}

.focus + span::before {
    top: -5px;
}

.focus + span::after {
    width: 100%;
}

button {
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background: #ff4b2b;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    cursor: pointer;
}

button:active {
    transform: scale(.95);
}

button:focus {
    outline: none;
}

button.ghost {
    background: transparent;
    border-color: #fff;
}

.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all .6s ease-in-out;
}

.form-container button {
    background: linear-gradient(120deg, #3498db, #8e44ad);
    border: none;
    background-size: 200%;
    color: #fff;
    transition: .5s;
}

.form-container button:hover {
    background-position: right;
}

.sign-in-container {
    left: 0;
    width: 50%;
    z-index: 2;
}
.sign-in-container form a {
    position: relative;
    left: 100px;
}
.sign-up-container {
    left: 0;
    width: 50%;
    z-index: 1;
    opacity: 0;
}
.sign-up-container button {
    margin-top: 20px;
}
.overlay-container {
    position:absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform .6s ease-in-out;
    z-index: 100;
}
.overlay {
    background-image: linear-gradient(120deg,#3498db,#8e44ad);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateY(0);
    transition: transform .6s ease-in-out;
}
.overlay-panel {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    height: 100%;
    width: 50%;
    text-align: center;
    transform: translateY(0);
    transition: transform .6s ease-in-out;
}
.overlay-right {
    right: 0;
    transform: translateY(0);
    
}

.overlay-left {
    transform: translateY(-20%);
}

.container.right-panel-active .sign-in-container {
    transform: translateY(100%);
}

.container.container.right-panel-active .overlay-container {
    transform: translateX(-100%);
}
.container.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
}
.container.container.right-panel-active .overlay {
    transform: translateX(50%);
}
.container.container.right-panel-active .overlay-left {
    transform: translateY(0);
}
.container.container.right-panel-active .overlay-right {
    transform: translateY(20%);
}
</style>