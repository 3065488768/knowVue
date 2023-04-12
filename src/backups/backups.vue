<template>
    <div id="homePage">
       <p class="stationStatistics">
        今日发帖数：{{postNumberOfToday}} &#12288|&#12288 站内总帖数：{{postNumber}} &#12288|&#12288 用户总数：{{userNumber}} &#12288|&#12288 书籍总数：{{bookNumber}}
       </p>
       <div style="margin-top:10px"></div>
       <el-row :gutter="1">
        <el-col :span="8">
            <div>
                <div class="stationStatistics"></div>
                <!-- 轮播图 -->
                <div>
                    <el-carousel height="216px" direction="vertical" :autoplay="false">
                        <el-carousel-item v-for="img,index in imgs" :key="index">
                            <img :src="img" height="100%" width="100%">
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </el-col>
        <el-col :span="16" style="padding-left:10px; border-radius: 10px;">
            <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
                <el-tab-pane label="新鲜出炉" name="first">
                    <div style="height:145px;width: 100%;">
                        <p class="stationStatistics" v-for="post,index in posts" :key="index" style="padding-bottom:12px;">
                            <span v-if="index === 0" style="color:red;">
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>
                            <span v-else-if="index < 3 & index > 0" style="color:orangered">
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>
                            <span v-else>
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span> 
                        </p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="最新回复" name="second">
                    <div style="height:145px;width: 100%;">
                        <p class="stationStatistics" v-for="post,index in posts" :key="index" style="padding-bottom:12px;">
                            <span v-if="index === 0" style="color:red;">
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>
                            <span v-else-if="index < 3 & index > 0" style="color:orangered">
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>
                            <span v-else>
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>  
                        </p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="本周热点" name="third">
                    <div style="height:145px;width: 100%;">
                        <p class="stationStatistics" v-for="post,index in posts" :key="index" style="padding-bottom:12px;">
                            <span v-if="index === 0" style="color:red;">
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>
                            <span v-else-if="index < 3 & index > 0" style="color:orangered">
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>
                            <span v-else>
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>  
                        </p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="本月热点" name="fourth">
                    <div style="height:145px;width: 100%;">
                        <p class="stationStatistics" v-for="post,index in posts" :key="index" style="padding-bottom:12px;">
                            <span v-if="index === 0" style="color:red;">
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>
                            <span v-else-if="index < 3 & index > 0" style="color:orangered">
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span>
                            <span v-else>
                                {{ index+1 }}.&#12288{{ post.postTitle }}
                            </span> 
                        </p>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-col>
       </el-row>
       <div class="interlayer">
        &#12288 板块
       </div>
       <el-row style="padding-bottom:5px;">
        <el-col :span="6" v-for="plate,index in plates" :key="index" >
            <el-col :span="4">
                <div style="height:10px;width:100%;"></div>
            </el-col>
            <el-col :span="4">
                <img :src="require('@/static/img/'+plate.imgUrl)" height="100px" width="100px" @click="toPlate(index)"/>
            </el-col>
            <el-col :span="10" :gutter="2" style="padding-bottom:5px;">
                <el-row :span="6">
                <p @click="toPlate(index)">
                    <span style="font-size:15px;padding-bottom: 5px;cursor: pointer;">{{ plate.plateName }}</span>
                    <span class="stationStatistics">({{ plate.postInPlateByToday }})</span>
                </p>
                </el-row>
                <el-row :span="6" class="stationStatistics" style="padding-bottom: 5px;">总帖数:&#12288{{ plate.postInPlate}}</el-row>
                <el-row :span="6">
                <p class="stationStatistics" style="padding-bottom:15px">创建日期:&#12288{{ plate.createTime | plateCreateTimeFilter}} </p>
                </el-row>
            </el-col>
        </el-col>
       </el-row>
       <div class="interlayer">
        &#12288 书籍
       </div>
       <el-row :gutter="1">
        <el-col :span="4" v-for="book,index in books" :key="index">
            <el-col :span="4">
                <div style="height:10px;width:100%;"></div>
            </el-col>
            <img :src="require('@/static/img/book/'+'princeling.jpg')" height="120px" width="100px" style="padding-bottom:15px" @click="toBook(index)">
        </el-col>
       </el-row>
       <div class="interlayer">
        &#12288 书摘
       </div>
       <el-row>
        <el-collapse v-model="activeNames" @change="handleChange" style="margin-left:10px">
            <el-collapse-item v-for="digest,index in digests" :name="index+1" :key="index">
                <template slot="title">
                    {{digest.book_name}}&nbsp
                    <el-tooltip placement="right" effect="light">
                        <div slot="content">
                            喜欢人数: {{ digest.likes }}
                        </div>
                        <i class="header-icon el-icon-warning-outline detailedStyle" @mousemove="showDetailed"></i>
                    </el-tooltip>
                </template>
                {{ digest.digest_content }}
                <p style="text-align:right;margin-right:5px">——{{digest.nick_name}}&#12288{{digest.create_time | digestCreateTimeFilter}}</p>
            </el-collapse-item>
        </el-collapse>
       </el-row>
    </div>
</template>
<script>
import axios from 'axios'

export default{
    name:"home",
    data(){
        return{
            postNumberOfToday:0,
            postNumber:0,
            userNumber:0,
            bookNumber:0,
            activeName: 'first',
            imgs:[require("../static/img/zy8yyo.jpg"),require("../static/img/o53gpm.jpg"),require("../static/img/5gwvz5.jpg"),require("../static/img/wallhaven-yx8lgk.png")],
            posts:[],
            plates:[],
            books:[],
            digests:[],
            activeNames: ['1']
        }
    },
    mounted(){

    },
    methods:{
        handleClick(tab, event) {
        console.log(tab, event);
      },
      toPlate(plateId){
        // 版块对于的路径进行跳转
        console.log(plateId+"toPlate")
      },
      toBook(bookId){
        console.log(bookId+"toBook()")
      },
      handleChange(){

      },
      getCountNumber(){
        axios({
            method:"get",
            url:"http://localhost:8080/api/index/getCountNumber",
            params:{

            }
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
        axios({
            method:"get",
            url:"http://localhost:8080/api/index/getPostOfExhibition",
            params:{
                flag:flag,
            }
        }).then(res => {
            if(res.data.code){
               this.posts = res.data.data;
            } 
        }).catch(error => {
            console.error(error);
        })
      },
      getPlateInformation(){
        axios({
            method:"get",
            url:"http://localhost:8080/api/index/getPlateInformation",
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
        axios({
            method:"get",
            url:"http://localhost:8080/api/index/getBookOfRecommend",
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
        axios({
            method:"get",
            url:"http://localhost:8080/api/index/getDigestOfRecommend",
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
        plateCreateTimeFilter(value) {
            return value.substring(0,10);
        },
        digestCreateTimeFilter(value){
            let value1 = value.substring(0,10);
            let value2 = value.substring(12,value.length);
            return value1 + " " + value2;
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
.interlayer{
    height: 40px;
    width:100%;
    background-color: rgb(139, 187, 185);
    opacity: 0.4;
    margin-top: 10px;
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
    transform: scale(1.1);
}
.detailedStyle{
    cursor:default;
}
</style>