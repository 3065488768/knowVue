<template>
    <div id="content">
        <el-page-header @back="goBack" :content="bookDetailed.bookName" style="margin-bottom:20px;">
        </el-page-header>
        <el-row id="bookInformation">
            <el-col :span="4">
                <img :src="bookDetailed.imgUrl" class="bookCover"/>
                <el-link :type="linkValidity ? 'primary' : 'info'" style="margin-left:50px;" @click="downloadBook" :disabled="!linkValidity">{{ linkValidity ? "下载图书":"暂无链接" }}</el-link>
            </el-col>
            <el-col :span="20" style="margin-top:1rem">
                <el-descriptions :title="bookDetailed.bookName" style="width:100%;">
                    <el-descriptions-item label="类别">{{ bookType.bookTypeName }}</el-descriptions-item>
                    <el-descriptions-item label="作者">{{bookDetailed.author}}</el-descriptions-item>
                    <el-descriptions-item label="贡献者">{{ contributor }}</el-descriptions-item>
                    <el-descriptions-item label="状态"><el-tag size="small" :type="bookDetailed.status == '0' ? 'success' :''">{{bookDetailedStatus}}</el-tag></el-descriptions-item>
                    <el-descriptions-item label="引用次数">{{ references }}</el-descriptions-item>
                    <el-descriptions-item label="热度"><img src="../../assets/img/hot.png" height="10px" width="10px"/>{{bookDetailed.heatDegree}}</el-descriptions-item>
                    <el-descriptions-item label="简介">
                        <div style="height:126px;overflow: hidden;text-overflow: ellipsis;">
                        <p style="text-align:justify;">
                            {{ bookDetailed.remark }}
                        </p>  
                        </div>      
                    </el-descriptions-item>
                </el-descriptions>
                <el-row style="font-size:14px;position: absolute;right: 1rem;">
                  <el-button :type="bookDetailed.status == '0'?'primary':'info'" style="margin-top:30px;margin-bottom: 15px;" @click="readBook" :disabled="bookDetailed.status != '0'" v-if="bookDetailed.status == '0'">
                    阅读
                  </el-button>

                  <el-button :type="subscribeValidity?'info':'primary'" style="margin-top:30px;margin-bottom: 15px;" v-else-if="bookDetailed.status == '2'" @click="subscribe" >
                    {{subscribeValidity?"已订阅":"订阅"}}
                  </el-button>
                </el-row>
            </el-col>
        </el-row>

        
        <el-row id="publishingBookExcerpts">
            <el-divider content-position="left">书摘鉴赏</el-divider>
            <div style="margin-bottom:40px;"></div>
            <!-- <p style="font-weight:700;">选取规则:取其精华,去其糟粕,推陈出新,革故鼎新</p>
            <div class="divider" style="margin-top:20px;"></div> -->
            <el-row style="min-height:306px;">
            <el-row class="digest" v-for="(digest,index) in digestList" :key="index">
            <el-row class="digestStyle">
                <el-row :span="18" class="digestContent">
                  <p>{{ digest.digestContent }}</p>
                </el-row>
                <el-row :span="6" class="digestAuthor">
                    <i class="iconfont icon-xihuan iconStyle" :class="isLikeList[index] == true?'red':''" :id="'like' + index" @click="likeClick(digest.digestId,index)"></i>
                        &nbsp;<span style="height:100%;">{{ likeList[index] }}</span>&nbsp;
                    <i class="iconfont icon-shoucang iconStyle" :class="isCollectionList[index] == true?'red':''" :id="'collection' + index" @click="collectionClick(digest.digestId,index)"></i>
                    &nbsp;<span>{{ collectionList[index] }}</span>&nbsp;
                    <span style="position:absolute;right:0;top:2px;"> ——{{ authorList[index] }} {{ digest.createTime|formatDate }}</span>
                </el-row>
            </el-row>
            </el-row>
            <p :class="isCanloadMore?'loadMore':'noMore'" @click="loadMore">{{ loadMessage }}</p>
        </el-row>
    </el-row>
    </div>
</template>

<script>

export default{
    name:"bookById",
    data(){
        return{
            bookId:this.$route.params.bookId,
            bookDetailed:{},
            bookType:"",
            // 书摘数量
            digestNumber:0,
            // 引用数量
            references:0,
            // 贡献者
            contributor:"",
            start:1,
            number:5,
            digestList:[],
            authorList:[],
            likeList:[],
            collectionList:[],
            isLikeList:[],
            isCollectionList:[],
            // loadMessage:"查看更多",
            isCanloadMore:true,
            thumbsUp:"thumbsUpClicked",
            bookDetailedStatus:"正常",
            linkValidity:true,
            subscribeValidity:false,
            // reportDialogVisible:false,
            // reportList:"",
            // reportValue:{},
            // reportDialogVisible:false,
            // reportList:"",
            // reportRemark:"",
        }
    },
    mounted(){
        this.getBookDetailed();
        this.getBookDigest();
        this.getSubscribe();
    },
    methods:{
        likeClick(digestId,index){
            // 进入数据库改的问题
            this.$axios({
                method:"post",
                url:"/user/likeDigestByUser",
                params:{
                    digestId:digestId,
                    type:0
                },
                headers:{
                    token:localStorage.getItem("token")
                }
            }).then(res => {
                if(res.data.code === 200){
                    if (this.isLikeList[index]) {
                        this.$set(this.likeList, index, --this.likeList[index])
                        document.getElementById("like" + index).classList.remove("red");
                    } else {
                        this.$set(this.likeList, index, ++this.likeList[index])
                        document.getElementById("like" + index).classList.add("red");
                    }
                    this.isLikeList[index] = !this.isLikeList[index];
                }else if(res.data.code === 201){
                    this.$message.error("您未登陆，请登陆后重试")
                }else{
                  this.$message.error(res.data.msg)
                }
            }).catch(error => {
                console.error(error);
            })
        },
        collectionClick(digestId, index) {
            this.$axios({
                method: "post",
                url: "/user/likeDigestByUser",
                params: {
                    digestId: digestId,
                    type: 1
                },
                headers: {
                    token: localStorage.getItem("token")
                }
            }).then(res => {
                if (res.data.code === 200) {
                    if (this.isCollectionList[index]) {
                        this.$set(this.collectionList, index, --this.collectionList[index])
                        document.getElementById("collection" + index).classList.remove("red");
                    } else {
                        this.$set(this.collectionList, index, ++this.collectionList[index])
                        document.getElementById("collection" + index).classList.add("red");
                    }
                    this.isCollectionList[index] = !this.isCollectionList[index];
                } else if (res.data.code === 201) {
                    this.$message.error("您未登陆，请登陆后重试")
                }else{
                  this.$message.error(res.data.msg)
                }
            }).catch(error => {
                console.error(error);
            })
          
        },
        goBack(){
            // 返回页面
            this.$router.back(-1);
        },
        handleClose(done){
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        closeDialog(){
            this.viewVisible = false;
        },
        openReportDialog(){
            this.reportDialogVisible = true;
        },
        getBookDetailed(){
           this.$axios({
                method:"post",
                url:"/book/getBookDetailed/" + this.bookId,
            }).then(res => {
                 if(res.data.code === 200){
                    this.bookDetailed = res.data.data.book;
                    this.bookDetailed.imgUrl = require("@/static/img/book/" + res.data.data.book.imgUrl)
                    this.bookType = res.data.data.bookType;
                    this.digestNumber = res.data.data.digestNumber;
                    this.references = res.data.data.references;
                    this.contributor = res.data.data.contributor;
                    this.linkValidity = res.data.data.linkValidity;
                    if(res.data.data.book.status == '0'){
                        this.bookDetailedStatus = "正常";
                    } else if (res.data.data.book.status == '1') {
                        this.bookDetailedStatus = "审核中";
                    } else if (res.data.data.book.status == '2') {
                        this.bookDetailedStatus = "筹备中";
                    } else if (res.data.data.book.status == '3') {
                        this.bookDetailedStatus = "下架";
                    } else {
                        this.bookDetailedStatus = "异常";
                    }
                 }else{
                   this.$message.error(res.data.msg)
                 }
            })
        },
        getBookDigest(){
            this.$axios({
                method:"post",
                url:"/book/getBookDigest/" + this.bookId,
                params:{
                    start:this.start,
                    number:this.number,  
                },
                headers:{
                    token:localStorage.getItem("token")
                }
            }).then(res => {
                if(res.data.code === 200){
                    let digestList = res.data.data.digestList;
                    let authorList = res.data.data.authorList;
                    let likeList = res.data.data.likeList;
                    let collectionList = res.data.data.collectionList;
                    let isLikeList = res.data.data.isLikeList;
                    let isCollectionList = res.data.data.isCollectionList;
                    for(let i = 0;i<digestList.length;i++){
                        this.digestList.push(digestList[i])
                        this.authorList.push(authorList[i])
                        this.likeList.push(likeList[i])
                        this.collectionList.push(collectionList[i])
                        this.isLikeList.push(isLikeList[i])
                        this.isCollectionList.push(isCollectionList[i])
                    }
                    if (this.digestNumber < 5){
                        this.isCanloadMore = false;
                    }
                }else if(res.data.code === 201){
                    localStorage.setItem("isLogin", false);
                    this.$message.error("您未登陆，请登陆后重试")
                }else{
                  this.$message.error(res.data.msg)
                }
            })
        },
        loadMore(){
            if(this.isCanloadMore){
                // this.start = this.digestList.length;
                this.start = this.start + 1;
                this.getBookDigest();
            }
        },
        downloadBook(){
            this.$axios({
                method:"post",
                url:"/user/downloadBook",
                headers:{
                    token:localStorage.getItem("token")
                },
                params:{
                    bookId:this.bookId
                },
                responseType: 'blob'
            }).then(res => {
                const data = res.data;
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', this.bookDetailed.bookName+".pdfjs");
                document.body.appendChild(link);
                link.click();
            }
            )
        },
        readBook(){
          // 待优化
          this.$axios({
            method:"post",
            url:"/book/getBookPath",
            params:{
              bookId:this.bookId
            }
          }).then(res => {
            if(res.data.code === 200){
              window.open("/static/pdf/" + res.data.data);
            }
          })
        },
      getSubscribe(){
          this.$axios({
            method:"get",
            url:"/book/getSubscribe",
            params:{
              bookId:this.bookId
            },
            headers:{
              token:localStorage.getItem("token")
            }
          }).then(res => {
            this.subscribeValidity = res.data;
          })
      },
      subscribe(){
      //     订阅
        this.$axios({
          method:"post",
          url:"/user/subscribeBook",
          params:{
            bookId:this.bookId
          },
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res => {
          if(res.data.code === 200){
            this.subscribeValidity = res.data.data > 0;
          }
        })
      }
    },
    computed:{
        loadMessage(){
            if(this.digestNumber > this.digestList.length){
                this.isCanloadMore = true;
                return "加载更多";
            }else{
                this.isCanloadMore = false;
                return "没有更多了";
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
#content {
    padding: 10px;
    position: relative;
}
#bookInformation{
    width: 100%;
    height:17rem;
}
#publishingBookExcerpts{
    position: relative;
    width: 100%;
    margin-top:60px;
    min-height:8rem;    
}
#bookExtractDisplay{
    margin-top:40px;
    width: 100%;
    min-height:21.7rem;
}
.bookCover{
    margin: 1rem;
    position: relative;
    height:11rem;
    width:8rem;
    display: flex;
}
.digest{
    position: relative;
    margin: 20px;
    min-height: 100px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    /* background: linear-gradient(to right, rgb(96, 174, 216), rgb(220, 157, 239)); */
}
.digestContent{
    position: absolute;
    top: 0;
    height:40px;
    font-size: 15px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    line-height: 150%;
}
.digestAuthor{
   position: relative;
   font-size: 14px;
   height: 18px;
   top: 60px;
}
.digestContent p{
    text-indent: 2em;
    font-size: 15px;
    font-family:'Courier New', Courier, monospace;
}
.digestAuthor p span{
    
}
p>span {
    display: inline-block;
    vertical-align: middle;
}
p{
    margin: 0;
}
.divider{
    background-color: #DCDFE6;
    position: relative;
    display: block;
    height: 1px;
    width: 100%;
    margin-bottom: 10px;
}
.thumbsUpImg{
    top: 4px;
    position: relative;
    height: 17px;
    width: 17px;
    cursor: pointer;
}
.thumbsUpImg:hover{
    content: url(../../assets/img/thumbsUpClicking.png);
}
.collectionImg{
    top: 4px;
    position: relative;
    margin-left: 10px;
    height: 19px;
    width: 19px;
    cursor: pointer;
}
.collectionImg:hover{
    content: url(../../assets/img/collectioning.png);
}
.reportImg{
    top: 2px;
    position: relative;
    margin-left: 10px;
    height: 15px;
    width: 15px;
    cursor: pointer;
}
.reportImg:hover{
    content: url(../../assets/img/reporting.png);
}
.el-textarea__inner {
    display: block;
    height:100px;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #FFF;
    background-image: none;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
}
.digestStyle{
    margin: 10px;
    position: relative;
}
.digest:hover{
    background-color: #f2f3f6;
}
.loadMore{
    text-align: center;
    font-size: 14px;
    color: #2bace9;
    cursor: pointer;
}
.loadMore:hover{
    color:blueviolet;
}
.noMore{
    text-align: center;
    font-size: 14px;
    color: #767d81;
}
.iconStyle{
    cursor: pointer;
}
.red {
    color: red;
}
</style>