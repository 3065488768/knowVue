<template>
<div>
  <p>???</p>
  <el-button @click="wsConnect">连接</el-button>
<!--  <el-buton @click="handleClose">断开</el-buton>-->
</div>
</template>

<script>
import { createSocket,sendWSPush,closeWs } from '../static/js/websocket.js';
export default{
    data(){
        return {

        }
    },
    methods: {
      wsConnect(){
        console.log("???")
        this.$message.success("成功点击")
        createSocket(3);
        this.getsocketData = (e) => {
          let data = e && e.detail.data
          if(data){
            // data = JSON.parse(data)
            console.log(data)
            if(data.code === 200){
              this.$message.success("当你看到这个消息说明成功了");
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
          }else{
            this.$message.error("???")
          }
        }
        window.addEventListener("onmessageWS", this.getsocketData)
      },
      handleClose(){
        let msg = { "event": "close_screen", " to_user": this.user.userId}
        sendWSPush(msg);
        closeWs()
        window.removeEventListener("onmessageWS", this.getsocketData)
      },
    }
}
</script>


<style>
.red{
    color:red;
}
</style>