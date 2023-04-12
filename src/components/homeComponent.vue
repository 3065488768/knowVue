<template>
    <div id="homePage">
       <p class="stationStatistics">
         近日发帖数：{{postNumberOfToday}} &#12288|&#12288 站内总帖数：{{postNumber}} &#12288|&#12288 用户总数：{{userNumber}} &#12288|&#12288 书籍总数：{{bookNumber}}
       </p>
       <div style="margin-top:10px"></div>
       <el-row :gutter="1">
        <el-col :span="8">
            <div>
                <div class="stationStatistics"></div>
                <!-- 轮播图 -->
                <div>
                    <el-carousel height="216px" direction="vertical" :autoplay="false">
                        <el-carousel-item v-for="(img,index) in imgs" :key="index">
                            <img :src="img" height="100%" width="100%">
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </el-col>
        <el-col :span="16" style="padding-left:10px; border-radius: 10px;" >
            <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" style="border-radius: 5px;">
                <el-tab-pane  v-for="(label,lableIndex) in labelTitle" :label=label :key="lableIndex" :name="labelName[lableIndex]">
                    <div class="labelContent" v-loading="loading">
                       <el-row v-for="(post,index) in posts" :key="index" class="postFontSize">
                        <el-col :span="18" class="overflowStyle">
                           <span v-if="index === 0" style="color:#FE2D46">
                            {{ index+1 }}.
                           </span> 
                           <span v-else-if="index === 1" style="color:#F60">
                            {{ index+1 }}.
                           </span> 
                           <span v-else-if="index === 2" style="color:#FAA90E">
                            {{ index+1 }}.
                           </span> 
                           <span v-else style="color:#9195A3">
                            {{ index+1 }}.
                           </span>
                            <el-link type="primary" @click="toPost(post.postId)">
                                {{ post.postTitle }}
                            </el-link>
                        </el-col>
                        <el-col :span="6" style="font-size:12px;text-align: right;">
                            <span v-if="lableIndex === 0">
                                —— {{ post.createTime }}
                            </span>
                            <span v-else-if="lableIndex === 1">
                                —— {{ post.commentTime }}
                            </span>
                            <span v-else-if="lableIndex === 2">
                                <img src="../assets/img/hot.png" width="13px" height="13px" alt="热度"> {{ post.degreeOfHeat}}
                            </span>
                            <span v-else-if="lableIndex === 3">
                                <img src="../assets/img/hot.png" width="13px" height="13px" alt="热度"> {{ post.degreeOfHeat}}
                            </span>
                        </el-col>
                       </el-row>
                       <el-empty :image-size="100" v-show="posts.length === 0"></el-empty>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-col>
       </el-row>
       <div class="interlayer">
        &#12288 板块
       </div>
       <el-row>
        <el-col :span="6" v-for="(plate,index) in plates" :key="index" >
            <el-col :span="3">
                <div style="height:10px;width:100%;"></div>
            </el-col>
            <el-col :span="6" style="display: table-cell;vertical-align: middle;">
                <img :src="require('@/static/img/plate/'+plate.imgUrl)" height="80px" width="80px" @click="toPlate(plate.plateId)" style="padding-bottom:15px"/>
            </el-col>
            <el-col :span="15" :gutter="2" style="padding-bottom:10px;padding-left: 7px;padding-top:2px">
                <el-row :span="6" style="padding-bottom: 10px;">
                <p>
                    <div class="platStyle" @click="toPlate(plate.plateId)">
                        {{ plate.plateName }}
                    </div>
                </p>
                </el-row>
                <el-row :span="6" class="stationStatistics" style="padding-bottom: 12px;text-align: center;">总帖数:&#12288{{ plate.postInPlate}}(<span class="platStyle">{{ plate.postInPlateByToday }}</span>)</el-row>
                <el-row :span="6">
                <p class="stationStatistics" style="padding-bottom:10px;text-align: center;">创建日期:&#12288{{ plate.createTime|formatDate }} </p>
                </el-row>
            </el-col>
        </el-col>
       </el-row>
       <div class="interlayer">
        &#12288 书籍
       </div>
       <el-row :gutter="1">
        <el-col :span="6" v-for="book,index in books" :key="index">
            <el-col :span="3">
                <div style="height:10px;width:100%;"></div>
            </el-col>
            <el-col :span="8">
                <img :src="require('@/static/img/book/'+ book.imgUrl)" height="130px" width="100px" style="padding-bottom: 40px;" @click="toBook(book.bookId)"/>
            </el-col>
            <el-col :span="13">
                <el-row :span="8" class="bookIntroduce" style="font-size:16px;">
                    <el-tooltip :content = book.bookName placement="right" effect="light">
                    <h4 class="bookNameStyle" @click="toBook(book.bookId)">《{{ book.bookName }}》</h4>
                    </el-tooltip>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="2"><div style="height:10px;width:100%;"></div></el-row>
                <el-row :span="7" class="bookIntroduce">
                    {{ book.author }}
                </el-row>
                <el-row :span="7" class="bookIntroduce">
                    {{ book.createTime}}
                </el-row>
            </el-col>
        </el-col>
       </el-row>
       <div class="interlayer" style="margin-top:0px;">
        &#12288 书摘
       </div>
       <el-row>
        <el-collapse v-model="activeNames" @change="handleChange" style="margin-left:10px">
            <el-collapse-item v-for="(digest,index) in digests" :name="index+1" :key="index">
                <template slot="title">
                    {{digest.book_name}}&nbsp;
                    <el-tooltip placement="right" effect="light">
                        <div slot="content">
                            喜欢人数: {{ digest.likeNumber }}
                        </div>
                        <i class="header-icon el-icon-warning-outline detailedStyle" @mousemove="showDetailed"></i>
                    </el-tooltip>
                </template>
                {{ digest.digest_content }}
                <p style="text-align:right;margin-right:5px;margin-top:10px;">——{{digest.nick_name}}&#12288{{digest.create_time}}</p>
            </el-collapse-item>
        </el-collapse>
       </el-row>
    </div>
</template>
<script>

export default{
  // eslint-disable-next-line vue/multi-word-component-names
    name:"home",
    data(){
        return{
            postNumberOfToday:0,
            postNumber:0,
            userNumber:0,
            bookNumber:0,
            activeName: 'first',
            imgs:[require("../static/img/rotation/zy8yyo.jpg"),
                require("../static/img/rotation/o53gpm.jpg"),
                require("../static/img/rotation/5gwvz5.jpg"),
                require("../static/img/rotation/zyydqo.jpg"),
                require("../static/img/rotation/1pk58v.jpg")],
            posts:[],
            plates:[],
            books:[],
            digests:[],
            activeNames: 1,
            loading:false,
            labelTitle:["新鲜出炉","最新回复","本周热点","本月热点"],
            labelName:['first','second','third','fourth']
        }
    },
    mounted(){

    },
    methods:{
        handleClick(tab, event) {
        // console.log(tab, event);
      },
      toPlate(plateId){
          this.$router.push({
              name: "plate",
              params: { plateId: plateId }
          })
      },
      toPost(postId){
          this.$router.push({
              name: "post",
              params: { postId: postId }
          })
      },
      toBook(bookId){
       this.$router.push({
        name:"book",
        params:{bookId:bookId}
      })
      },
      handleChange(){

      },
      getCountNumber(){
        this.$axios({
            method:"get",
            url:"/index/getCountNumber",
        }).then(res => {
            if(res.data.code == 200){
                this.bookNumber = res.data.data.bookNumber;
                this.postNumber = res.data.data.postNumber;
                this.userNumber = res.data.data.userNumber;
                this.postNumberOfToday = res.data.data.postNumberOfToday;
            }
        }).catch(error => {
            console.error(error)
        })
      },
      getPostOfExhibition(flag){
        this.loading = true;
        this.$axios({
            method:"get",
            url:"/index/getPostOfExhibition",
            params:{
                flag:flag,
            }
        }).then(res => {
            if(res.data.code === 200){
               this.posts = res.data.data;
               this.loading = false;
            } 
        }).catch(error => {
            console.error(error);
        })
      },
      getPlateInformation(){
        this.$axios({
            method:"get",
            url:"/index/getPlateInformation",
            params:{
                
            }
        }).then(res => {
            if(res.data.code){
               this.plates = res.data.data;
            } 
        }).catch(error => {
            console.error(error);
        })
      },
      getBookOfRecommend(){
        this.$axios({
            method:"get",
            url:"/index/getBookOfRecommend",
            params:{
                
            }
        }).then(res => {
            if(res.data.code){
               this.books = res.data.data;
            } 
        }).catch(error => {
            console.error(error);
        })
      },
      getDigestOfRecommend(){
        this.$axios({
            method:"get",
            url:"/index/getDigestOfRecommend",
            params:{
                
            }
        }).then(res => {
            if(res.data.code){
               this.digests = res.data.data;
            } 
        }).catch(error => {
            console.error(error);
        })
      },
      showDetailed(){

      },
      init(){
        this.getCountNumber();
        this.getPostOfExhibition(0);
        this.getPlateInformation();
        this.getBookOfRecommend();
        this.getDigestOfRecommend();
      }
    },
    created(){
        this.init();
    },
    watch:{
        activeName(newVal,oldVal){
            if(newVal != oldVal){
                let flag;
                if(this.activeName === "first"){
                    flag = 0;
                }else if( this.activeName === "second"){
                    flag = 1;
                }else if( this.activeName === "third"){
                    flag = 2;
                }else if( this.activeName === "fourth"){
                    flag = 3;
                }
                this.getPostOfExhibition(flag)
            }
        }
    },
    filters:{
      formatDate(timeStamp){
        let dateTime = new Date(timeStamp);
        let no1new = dateTime.valueOf();
        let year = dateTime.getFullYear();
        let month = dateTime.getMonth() + 1;
        let day = dateTime.getDate();
        let hour = dateTime.getHours();
        let minute = dateTime.getMinutes();
        let second = dateTime.getSeconds();
        let now = new Date();
        let now_new = now.valueOf();
        let milliseconds = 0;
        let timeSpanStr;
        milliseconds = now_new - no1new;
        if (milliseconds <= 1000 * 60 * 1) {
          timeSpanStr = '刚刚';
        } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
          timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
          timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
          timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        } else{
          if (month < 10) month = "0" + month;
          if (day < 10) day = "0" + day;
          if (hour < 10) hour = "0" + hour;
          if (minute < 10) minute = "0" + minute;
          if (second < 10) second = "0" + second;
          if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
            // timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            timeSpanStr = year + '-' + month + '-' + day
          } else {
            // timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            timeSpanStr = year + '-' + month + '-' + day
          }
        }
        return timeSpanStr;
      }
    }
}
</script>
<style scoped>
*{
    margin: 0;
    padding:0;
}
#homePage{
    padding: 10px;
}
.stationStatistics{
    font-size: 12px;
}
.postFontSize{
    font-size: 16px;
    padding-bottom: 10px;
}
.interlayer{
    height: 40px;
    width:100%;
    background-color: rgb(139, 187, 185);
    opacity: 0.4;
    margin-top: 15px;
    margin-bottom: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    line-height: 40px;
    border:1px solid rgb(117, 161, 221)
}
img{
    cursor: pointer;
}
img:hover{
    transform: scale(1.05);
}
.detailedStyle{
    cursor:default;
}
.platStyle {
    text-align: center;
    cursor: pointer;
    color: rgb(65, 164, 217);
}
.platStyle:hover{
    color: blueviolet;
}
.bookIntroduce{
    font-size:12px;
    text-align:center;
    padding-bottom: 12px;
    padding-top:12px;
    overflow: hidden;
    white-space:nowrap;
}
.bookNameStyle{
    color: cornflowerblue;
    cursor: pointer;
}
.bookNameStyle:hover{
    color: blueviolet;
}
.labelContent{
    height:152px;
    width: 100%;
}
.el-loading-mask {
    position: absolute;
    z-index: 999;
    background-color: rgba(255,255,255,.9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity .3s;
}
.overflowStyle{
    overflow-x: hidden;
    white-space: nowrap;
    /*text-overflow: ellipsis;*/
}
.el-tabs--border-card>.el-tabs__content {
    padding: 11px;
}
</style>