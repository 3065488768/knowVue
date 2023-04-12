<template>
    <div style="background-color:#F3F3F3">
        <p id="headText">
            {{ SystemTime }}
        </p>
        <el-row style="height:140px;">
            <el-col :span="6"  class="borderStyle" >
                <el-row :span="2" >
                    <el-divider><h5>新鲜出炉</h5></el-divider>
                </el-row>
                <el-row :span="2"><div style="height:10px;width:100%"></div></el-row>
                <el-row :span="4" v-for="post,index in newPosts" :key="index">
                    <el-col :span="1"><div style="height:10px;width:100%;"></div></el-col>
                    <el-col :span="1" class="postStyle">{{ index+1 }}.</el-col>
                    <el-col :span="16">
                        <el-popover
                        placement="right"
                        title=""
                        width="200"
                        trigger="hover"
                        >
                        <div>
                           <div class="detailedTitleStyle " >
                            {{ post.postTitle }}
                           </div>
                           <div class="detailedContentStyle ">
                            热度:&nbsp;{{ post.degreeOfHeat }}
                           </div>
                           <div class="detailedContentStyle ">
                            createTime:&nbsp;{{ post.createTime | createTimeFilter}}
                           </div>
                        </div>
                        <p slot="reference" class="postStyle"  @click="toPost(post.postId)">{{ post.postTitle }}</p>
                    </el-popover>
                    </el-col>
                    <el-col :span="1"><div style="height:10px;width:100%;"></div></el-col>
                    <el-col :span="5">
                        <el-popover
                        placement="right"
                        title=""
                        width="200"
                        trigger="hover">
                        <div>
                            <div class="personalInformation">
                                <img src="../static/author/dog.jpg" height="40px" width="40px">
                                <p>{{ post.nickName }}</p>
                            </div>
                            <div class="personalFunctions">
                                <el-button type="primary" @click="followClick" :class="followMessage===true?'followOfSuccess':''" plain>{{followMessage===true?"已关注":"关注"}}</el-button>
                                <el-button type="primary" plain>发消息</el-button>
                            </div>
                        </div>
                        <p slot="reference" class="authorStyle">{{ post.nickName }}</p>
                    </el-popover>
                    </el-col>
                </el-row>
                <el-empty :image-size="70" v-show="newPosts.length === 0"></el-empty>
            </el-col>

            <el-col :span="6" class="borderStyle">
               
                <el-row :span="2">
                    <el-divider><h5>炙手可热</h5></el-divider>
                </el-row>
                <el-row :span="2"><div style="height:10px;width:100%"></div></el-row>
                <el-row :span="4" v-for="(post,index) in hotPostsLastThreeDays" :key="index">
                    <el-col :span="1"><div style="height:10px;width:100%;"></div></el-col>
                    <el-col :span="1" class="postStyle">{{ index+1 }}.</el-col>
                    <el-col :span="16">
                        <el-popover
                        placement="right"
                        title=""
                        width="200"
                        trigger="hover"
                        >
                        <div>
                           <div class="detailedTitleStyle ">
                            {{ post.postTitle }}
                           </div>
                           <div class="detailedContentStyle ">
                            热度:&nbsp;{{ post.degreeOfHeat }}
                           </div>
                           <div class="detailedContentStyle ">
                            createTime:&nbsp;{{ post.createTime | createTimeFilter }}
                           </div>
                        </div>
                        <p slot="reference" class="postStyle" @click="toPost(post.postId)">{{ post.postTitle }}</p>
                    </el-popover>
                    </el-col>
                    <el-col :span="1"><div style="height:10px;width:100%;"></div></el-col>
                    <el-col :span="5">
                        <el-popover
                        placement="right"
                        title=""
                        width="200"
                        trigger="hover">
                        <div>
                            <div class="personalInformation">
                                <img src="../static/author/dog.jpg" height="40px" width="40px">
                                <p>{{ post.nickName }}</p>
                            </div>
                            <div class="personalFunctions">
                                <el-button type="primary" @click="followClick" :class="followMessage===true?'followOfSuccess':''" plain>{{followMessage===true?"已关注":"关注"}}</el-button>
                                <el-button type="primary" plain>发消息</el-button>
                            </div>
                        </div>
                        <p slot="reference" class="authorStyle">{{ post.nickName }}</p>
                    </el-popover>
                    </el-col>
                </el-row>
                <el-empty :image-size="70" v-show="hotPostsLastThreeDays.length === 0"></el-empty>
            </el-col>

            <el-col :span="6" class="borderStyle">
                <el-row :span="2">
                    <el-divider><h5>风靡一时</h5></el-divider>
                </el-row>
                <el-row :span="2"><div style="height:10px;width:100%"></div></el-row>
                <el-row :span="4" v-for="(post,index) in hotPostsLastSevenDays" :key="index">
                    <el-col :span="1"><div style="height:10px;width:100%;"></div></el-col>
                    <el-col :span="1" class="postStyle">{{ index+1 }}.</el-col>
                    <el-col :span="16">
                        <el-popover
                        placement="right"
                        title=""
                        width="200"
                        trigger="hover"
                        >
                        <div>
                           <div class="detailedTitleStyle " >
                            {{ post.postTitle }}
                           </div>
                           <div class="detailedContentStyle ">
                            热度:&nbsp;{{ post.degreeOfHeat }}
                           </div>
                           <div class="detailedContentStyle ">
                            createTime:&nbsp;{{ post.createTime | createTimeFilter }}
                           </div>
                        </div>
                        <p slot="reference" class="postStyle" @click="toPost(post.postId)">{{ post.postTitle }}</p>
                    </el-popover>
                    </el-col>
                    <el-col :span="1"><div style="height:10px;width:100%;"></div></el-col>
                    <el-col :span="5">
                        <el-popover
                        placement="right"
                        title=""
                        width="200"
                        trigger="hover">
                        <div>
                            <div class="personalInformation">
                                <img src="../static/author/dog.jpg" height="40px" width="40px">
                                <p>{{ post.nickName }}</p>
                            </div>
                            <div class="personalFunctions">
                                <el-button type="primary" @click="followClick" :class="followMessage===true?'followOfSuccess':''" plain>{{followMessage===true?"已关注":"关注"}}</el-button>
                                <el-button type="primary" plain>发消息</el-button>
                            </div>
                        </div>
                        <p slot="reference" class="authorStyle">{{ post.nickName }}</p>
                    </el-popover>
                    </el-col>
                </el-row>
                <el-empty :image-size="70" v-show="hotPostsLastSevenDays.length === 0"></el-empty>
            </el-col>

            <el-col :span="6">
                <el-row :span="2">
                    <el-divider><h5>掇菁撷华</h5></el-divider>
                </el-row>
                <el-row :span="2"><div style="height:10px;width:100%"></div></el-row>
                <el-row :span="4" v-for="(post,index) in essencePost" :key="index">
                    <el-col :span="1"><div style="height:10px;width:100%;"></div></el-col>
                    <el-col :span="1" class="postStyle">{{ index+1 }}.</el-col>
                    <el-col :span="16">
                        <el-popover
                        placement="right"
                        title=""
                        width="200"
                        trigger="hover"
                        >
                        <div>
                           <div class="detailedTitleStyle" >
                            {{ post.postTitle }}
                           </div>
                           <div class="detailedContentStyle ">
                            热度:&nbsp;{{ post.degreeOfHeat }}
                           </div>
                           <div class="detailedContentStyle ">
                            createTime:&nbsp;{{ post.createTime | createTimeFilter }}
                           </div>
                        </div>
                        <p slot="reference" class="postStyle" @click="toPost(post.postId)">{{ post.postTitle }}</p>
                    </el-popover>
                    </el-col>
                    <el-col :span="1"><div style="height:10px;width:100%;"></div></el-col>
                    <el-col :span="5">
                        <el-popover
                        placement="right"
                        title=""
                        width="200"
                        trigger="hover">
                        <div>
                            <div class="personalInformation">
                                <img src="../static/author/dog.jpg" height="40px" width="40px">
                                <p>{{ post.nickName }}</p>
                            </div>
                            <div class="personalFunctions">
                                <el-button type="primary" @click="followClick" :class="followMessage===true?'followOfSuccess':''" plain>{{followMessage===true?"已关注":"关注"}}</el-button>
                                <el-button type="primary" plain>发消息</el-button>
                            </div>
                        </div>
                        <p slot="reference" class="authorStyle">{{ post.nickName }}</p>
                    </el-popover>
                    </el-col>
                </el-row>
                <el-empty :image-size="70" v-show="essencePost.length === 0"></el-empty>
            </el-col>
        </el-row>
        <el-row>
           <el-divider></el-divider>
           <div style="height:10px;background-color:#F3F3F3;"></div>
        </el-row>
        <el-row >
            <el-col :span="18" id="postContent">
                <el-row :span="2">
                    <div style="width:100%;height:32px;margin-top: 10px;margin-left:5px;font-size: 14px;;">
                        筛选
                    <!-- 多选，进行类型的选择 -->
                    <div style="width:160px;height:10px;display: inline-block;">
                    <el-select v-model="plateClicked" multiple collapse-tags style="margin-left: 20px;" placeholder="请选择类型" size="small" @change="getPostsOfCondition">
                        <el-option v-for="(item,index) in options" :key="index" :label="item.plateName" :value="item.plateId"></el-option>
                    </el-select>
                    </div>
                    
                    <!-- 单选，进行排序的选择 -->
                    <div style="width:150px;height:10px;display: inline-block;padding-left: 15px;;">
                    <el-select v-model="orderBy" placeholder="请选择排序条件" style="padding-left:5px;" size="small" @change="getPostsOfCondition">
                        <el-option v-for="(item,index) in sortCriteria" :key="index" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
                    </div>

                    <div style="width:180px;height:10px;display: inline-block;padding-left: 20px;;">
                        <el-input placeholder="请输入查找的内容" prefix-icon="el-icon-search" v-model="titleOrContent" size="small" @blur="getPostsOfCondition"></el-input>
                    </div>
                    
                    <div style="width:300px;height:10px;display: inline-block;padding-left: 80px;;">
                        查询范围 :
                        &nbsp
                        <el-radio v-model="radio" label="1">标题</el-radio>
                        &nbsp
                        <el-radio v-model="radio" label="2">内容</el-radio>
                        &nbsp
                        <el-radio v-model="radio" label="3">标题和内容</el-radio>
                    </div>
                    </div>
                </el-row> 
                
               <el-row>
                <div style="padding:15px;padding-top: 10px;min-height: 500px;">  
                    <div class="post" v-for="(post,index) in Posts" :key="index">
                        <el-col :span="2">
                            <img :src="require('../static/author/'+post.avator) " height="50px" width="50px" style="border-radius:50%;padding-left: 10px;padding-top: 12px;">
                        </el-col>
                        <el-col :span="22">
                            <el-row :span="8">
                                <p style="padding-top:10px;" @click="toPost(post.postId)">{{ post.postTitle }}({{ post.postType | postTypeFilter}})</p>
                            </el-row>
                            <el-row>
                                <div style="height:20px;width:100%;"></div>
                            </el-row>
                            <el-row :span="6" style="font-size:14px">
                                <el-col :span="11">
                                    {{ post.createBy }} | {{post.plateName}} | 
                                    <i class="iconfont icon-chakan"></i>
                                    {{ post.accessNumber }} | 
                                    <i class="iconfont icon-pinglun"></i>
                                    {{ post.commentNumber }}
                                </el-col>
                                <el-col :span="9">
                                <div style="height:10px;width:100%;"></div>
                                </el-col>
                                <el-col :span="4" style="text-align:right;">
                                    {{ post.createTime | createTimeFilter }}
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-divider></el-divider>
                    </div>
                    <el-empty :image-size="100" v-show="Posts.length == 0"></el-empty>
                </div>
                <div class="block">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                        :page-sizes="[15, 20, 25, 30]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
                        :total="countPostsNumber">
                    </el-pagination>
                </div>
               </el-row>
            </el-col>

            <el-col :span="6">
                <div class="rankingStyle">
                    <div :class="listStyle === true ? 'listStyleFixed' :'listStyleUnfixed'" class="listStyle">
                        <el-row style="padding:5px;">
                            <el-row :span="12" style="min-height: 300px;">
                                <el-row :span="6" class="rankingTitle">
                                      <p>
                                    热门板块榜
                                     <el-tooltip placement="right" effect="light">
                                    <div slot="content">
                                        根据板块内的总热度进行排行
                                    </div>
                                    <i class="header-icon el-icon-warning-outline detailedStyle" @mousemove="showDetailed"></i>
                                </el-tooltip>
                                </p>
                                </el-row>
                                <el-row :span="5" v-for="(plate, index) in plateByRanking" :key="index" class="rankingContent">
                                    <el-col :span="2">
                                        <div style="height:10px"></div>
                                    </el-col>
                                    <el-col :span="2" >
                                        {{ index+1 }}.
                                    </el-col>
                                    <el-col :span="15">
                                        {{ plate.plateName }}
                                    </el-col>
                                    <el-col :span="4" style="font-size:12px;">
                                        <img src="../assets/img/hot.png" height="12px" width="12px"/> &nbsp;{{ plate.heatDegree }}
                                    </el-col>
                                    <el-col :span="1">
                                        <div style="height:10px"></div>
                                    </el-col>
                                </el-row>
                            </el-row>
                            <el-row :span="12" style="min-height:300px">
                            <el-row :span="6" class="rankingTitle">
                                <p>
                                    高能用户榜
                                    <el-tooltip placement="right" effect="light">
                                        <div slot="content">
                                            <p>根据综合得分进行排行(<span style="font-size:12px;">被收藏的帖子数量*3+被点赞的帖子数量*2+被访问的帖子数量*1</span>)</p>
                                        </div>
                                        <i class="header-icon el-icon-warning-outline detailedStyle" @mousemove="showDetailed"></i>
                                    </el-tooltip>
                                </p>
                            </el-row>
                            <el-row :span="5" v-for="user, index in userOfRanking"  :key= "index" class="rankingContent">
                                <el-col :span="2">
                                    <div style="height:10px"></div>
                                </el-col>
                                <el-col :span="2">
                                    {{ index+1 }}.
                                </el-col>
                                <el-col :span="15">
                                    {{ user.nickName }}
                                </el-col>
                                <el-col :span="4" style="font-size:12px;">
                                    <img src="../assets/img/scoreNumber.png" height="12px" width="12px" /> &nbsp;{{ user.scoreNumber }}
                                </el-col>
                                <el-col :span="1">
                                    <div style="height:10px"></div>
                                </el-col>
                            </el-row>
                            </el-row>
                        </el-row>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from 'axios';
import $ from 'jquery'
export default{
    data(){
        return{
            timer:null,
            scroll:'',
            SystemTime:new Date(),
            newPosts:[],
            hotPostsLastThreeDays:[],
            hotPostsLastSevenDays:[],
            essencePost:[],
            followMessage:false,
            count: 15,
            loading: false,
            Posts:[],
            currentPage: 1,
            listStyle:true,
            plateClicked:'',
            orderBy:0,
            sortCriteria:[{label:'默认',value:0},
                { label: '时间', value: 1 },
                { label: '热度', value: 2 },
                { label: '相关性', value: 3 },
            ],
            radio:'1',
            titleOrContent:'',
            options:[],
            countPostsNumber:400,
            plateByRanking:[],
            userOfRanking:[]
        }
    },
    created(){
        this.dateCalculation();
        // this.init();
    },
    mounted(){
        this.init();
        window.addEventListener('scroll', this.getScroll)
    },
    beforeDestroy(){
        this.timer = null;
        window.removeEventListener('scroll', this.getScroll)
    },
    methods:{
      showDetailed(){

      },
      toPost(postId){
        this.$router.push({
          name: "post",
          params: { postId: postId }
        })
      },
        dateCalculation(){
          this.timer = setInterval(() => {
          let timeDate = new Date();
          let year = timeDate.getFullYear();
          let mounth = timeDate.getMonth() + 1;
          let day = timeDate.getDate();
          let hours = timeDate.getHours();
          hours = hours >= 10 ? hours : "0" + hours;
          let minutes = timeDate.getMinutes();
          minutes = minutes >= 10 ? minutes : "0" + minutes;
          let seconds = timeDate.getSeconds();
          seconds = seconds >= 10 ? seconds : "0" + seconds;
          let week = timeDate.getDay();
          let weekArr = [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
          ];
 		  this.SystemTime = `${year}/${mounth}/${day} ${hours}:${minutes}:${seconds} ${weekArr[week]}`
        },1000)
        },
        // 检索页面展示的帖子 i对应后端参数
        getPost(i){
            this.$axios({
                method:"get",
                url:"/forum/getSimplePostAndAuthor",
                params:{
                    flag:i
                }
            }).then(res => {
                if(res.data.code === 200){
                if(i === 0){
                    this.newPosts = res.data.data;
                }else if(i === 1){
                    this.hotPostsLastThreeDays = res.data.data;
                }else if(i === 2){
                    this.hotPostsLastSevenDays = res.data.data;
                }else if(i === 3){
                    this.essencePost = res.data.data;
                }
                }
                
            })
        },
        handleSizeChange(val){
            this.count = val;    
            this.getPostsOfCondition();
            //回到顶部
            document.documentElement.scrollTop = 0; 
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getPostsOfCondition();
            document.documentElement.scrollTop = 0;  
        },
        getPlate(){
            this.$axios({
                method:"get",
                url:"/index/getPlateInformation",
                params:""
            }).then(res => {
                let plate = res.data.data;
                if(res.data.code === 200){
                    this.options = plate;
                }  
            }).catch(error => {
                console.error(error);
            })
        },
        getPlateByRanking(){
            this.$axios({
                method: "get",
                url: "/forum/getPlateByRanking",
                params: ""
            }).then(res => {
                if (res.data.code === 200) {
                    this.plateByRanking = res.data.data;
                }
            }).catch(error => {
                console.error(error);
            })
        },
        getUserOfRanking(){
            this.$axios({
                method: "get",
                url: "/forum/getUserOfRanking",
                params: ""
            }).then(res => {
                if (res.data.code === 200) {
                    this.userOfRanking = res.data.data;
                }
            }).catch(error => {
                console.error(error);
            })
        },
        // 根据筛选条件进行检索帖子
        getPostsOfCondition(){
        // console.log((this.currentPage-1) * this.count)
            this.$axios({
                method:"get",
                url:"/forum/getExhibitionPost",
                params:{
                    parameter: this.titleOrContent,
                    type:this.radio,
                    // 加入分隔符，不然后端int数组接收为空
                    plateId: this.plateClicked.join(","),
                    postType:'3',
                    begin:this.currentPage,
                    number:this.count,
                    rankType:this.orderBy,
                }
            }).then(res => {
                this.countPostsNumber = res.data.data.size;
                this.Posts = res.data.data.list;
            }).catch(error => {
                console.log(error)
            })
        },
        //设置滑块的外容器大小与左边内容大小相同
        setDivHeight(){
            $(".rankingStyle").height($("#postContent").height() + 2);
        },
        followClick(){
             this.followMessage = !this.followMessage;
        },
      init(){
          this.getPost(0);
          this.getPost(1);
          this.getPost(2);
          this.getPost(3);
          this.getPlate();
          // this.getPostsOfCondition();
          this.getPlateByRanking();
          this.getUserOfRanking();
      },
      getScroll(){
          this.setDivHeight();
          // 滚动条距文档顶部的距离
          let scrollTop =
              window.pageYOffset ||
              document.documentElement.scrollTop ||
              document.body.scrollTop;
          // 滚动条滚动的距离
          let scrollStep = scrollTop - this.oldScrollTop;
          // 更新——滚动前，滚动条距文档顶部的距离
          this.oldScrollTop = scrollTop;
          //变量windowHeight是可视区的高度
          let windowHeight =
              document.documentElement.clientHeight || document.body.clientHeight;
          //变量scrollHeight是滚动条的总高度
          let scrollHeight =
              document.documentElement.scrollHeight || document.body.scrollHeight;

            //滚动条到底部的条件
            // if (scrollTop + windowHeight == scrollHeight) {
            //     console.log("header  你已经到底部了");
            // }
            // if (scrollStep < 0) {
            //     console.log("header 滚动条向上滚动了！");
            // } else {
            //     console.log("header  滚动条向下滚动了！");
            // }
            // if (scrollTop <= 0) {
            //     console.log("header 到了最顶部")
        //     // }
          let height = $("#postContent").height();
          if (scrollTop > (height-610)){
            this.listStyle = false; 
          }else{
            // alert("?")
            this.listStyle = true;
          }
      },
    },
    computed:{

    },
    watch:{
        radio(newVal,oldVal){
            if(newVal != oldVal){
                this.getPostsOfCondition();
            }
        },
        plateClicked(newVal,oldVal){
            this.getPostsOfCondition();
        }
    },
    filters:{
        createTimeFilter(timeStamp) {
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
                if(month < 10) month = "0" + month;
                if(day < 10) day = "0" + day;
                if(hour < 10) hour = "0" + hour;
                if(minute < 10) minute = "0" + minute;
                if(second < 10) second = "0" + second;
               if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
                timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            } else {
                timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            } 
            } 
            return timeSpanStr;
        },
      postTypeFilter(postType){
          // console.log(postType)
          if(postType === '0'){
            return "普通";
          }else if(postType === '1'){
            return "精华";
          }else if(postType === '2'){
            return "求助";
          }else if(postType === '3'){
            return "置顶";
          }
      }
    },
}
</script>

<style scoped>
*{
    padding: 0;
    margin: 0;
}
#headText{
    font-size: 14px;
    color: rgb(167, 163, 163);
    padding: 15px;
    text-align: right;
}
h3{
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 5px;
}
h5{
    text-align: center;
    padding-bottom: 5px;
    background-color:#F3F3F3;
}
.postStyle{
    font-size: 12px;
    text-align: left;
    padding-bottom: 10px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
}
.authorStyle{
    font-size: 12px;
    text-align: left;
    padding-bottom: 10px;
    cursor: pointer;
    color: rgb(104, 99, 99);
    white-space: nowrap;
    overflow: hidden;
}
.detailedTitleStyle{
    font-weight: 900;
    font-size: 10px;
    font-family:Georgia, 'Times New Roman', Times, serif;
    padding-bottom: 4px;
}
.detailedContentStyle{
    font-size: 8px;
    padding-bottom: 2px;
}

.personalInformation img{
    border-radius: 50%;
    margin-left: 40%;
}
.personalInformation p{
    text-align: center;
}
.personalFunctions{
    margin-top: 10px;
}

.personalFunctions button{
    height: 20px;
    width: 60px;
    margin-left: 10px;
}
.followOfSuccess{
    background-color: rgb(0, 162, 255);
    color: white;
}
.postDiv{
    margin-bottom: 10px;
}
.postDiv a{
    text-decoration: none;
}
.postDiv a:hover{
    text-decoration: solid;
    color: blueviolet;
}
.postDiv span:hover{
    color: blue;
    text-decoration: solid;
    cursor: pointer;
}
.postDiv:hover{
    background-color: rgba(226, 232, 232, 0.896);
}
.postStyle:hover{
    color: orangered;
}
.authorStyle:hover{
    color: red;
}
.borderStyle{
    /* border: 0px dashed rgb(204, 199, 199); */
    /* border-color: rgb(204, 199, 199); */
    border-top: 0px;
    border-bottom: 0px;
    border-left: 0px;
    border-right: 1px;
    border-style: dashed;
    height:140px;
    border-color: rgb(193, 187, 187);
}
.postExhibition{
    height: 100px;
    background-color: rgb(128, 211, 165);
}
.listStyleFixed{
    background-color: rgb(242, 236, 236);
    position: fixed;
}
.listStyle{
    height: 598px;
    width: 327px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border: 1px solid #c7c1c1;
    border-left: 0px solid white;
}
/* 指定的的样式，静态样式 */
.listStyleUnfixed{
    background-color: rgb(242, 236, 236);
    position: absolute;
    bottom: 0px;
}
.post{
    height: 80px;
    width: 100%;
    background-color: rgb(242, 236, 236);
    /* margin-bottom: 10px; */
}
.post:hover{
    background-color: rgb(198, 187, 187);
    cursor: pointer;
}
#postContent{
    background-color: rgb(242, 236, 236);
    border: 1px solid #c7c1c1;
    min-height: 600px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
.rankingStyle{
    width: 100%;
    min-height: 600px;
    background-color: #F3F3F3;
    position: relative;
}
.rankingTitle{
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 20px;
}
.rankingContent{
    font-size: 14px;
    padding-bottom: 20px;
    /* background-color: aqua; */
    max-width: 265px;
    max-height:300px;
    margin-left:8%;
}
</style>