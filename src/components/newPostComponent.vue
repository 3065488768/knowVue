<template>
    <div>
       
    <div id="postStyle"> 
        <el-page-header @back="goBack" content="详情页面">
        </el-page-header>
        <el-row>
            <h3>{{post.postTitle}}
              (<i class="el-icon-link"></i><span class="book" @click="toBook(post.bookId)">{{ post.bookName }}</span>)
            </h3>
            <h5>
                 作者：<span class="author">{{ post.createBy }}</span>
            </h5>
        </el-row>
        <el-row>
            <Viewer class="viewer" :tabindex="2" :sanitize="23" :value="post.postContent" :plugins="plugins" :locale="zhHans" style="min-height: 173px;"></Viewer>
            <el-row style="margin:40px 0;">
                <el-col :span="8"><div style="width:100%;height:10px;"></div></el-col>
                <el-col :span="8">
                    <el-col :span="8">
                        <p style="display: grid;justify-items: center;">
                            <i class="el-icon-present sendBlessing" @click="transferAccounts"></i>
                        </p>
                    </el-col>

                    <el-col :span="8">
                        <p style="display: grid;justify-items: center;">
                            <i class="iconfont icon-xihuan sendBlessing" :class="isLike?'fontRedColor':''" ref="likePost" @click="likeClick"></i>
                        </p>
                        <p style="text-align:center;padding-top: 8px;">
                            {{post.likeNumber}}
                        </p>
                    </el-col>

                    <el-col :span="8">
                        <p style="display: grid;justify-items: center;">
                            <i class="iconfont icon-shoucang sendBlessing" :class="isCollection?'fontRedColor':''" ref="collectionPost" @click="collectionClick"></i>
                        </p>
                        <p style="text-align:center;padding-top: 8px;">
                            {{post.collectionNumber}}
                        </p>
                    </el-col>
                </el-col>
            </el-row>

            <div style="height:15px;text-align: right;">
               <el-link type="primary" icon="el-icon-s-comment" @click="openDrawer">评论</el-link>

              <!-- 评论区 -->
              <el-drawer
                  :visible.sync="drawer"
                  :show-close="false"
                  :modal="true">

                <div slot="title">
                  <h3 style="margin: 0">评论({{commentList.length}})</h3>
                </div>

                <div id="comment">
                  <div style="position: relative">
                    <p style="text-align: left;padding-bottom: 10px;">
                      快去参与此帖的讨论吧
                    </p>
                    <p style="padding-bottom: 10px;">
                      <el-input
                          type="textarea"
                          :autosize="{ minRows: 3,maxRows:6}"
                          placeholder="评论千万条，友善第一条"
                          v-model="commentByPost"
                          >
                      </el-input>
                    </p>
                    <el-button @click="insertComment('0')">确定</el-button>
                  </div>
                  <el-divider></el-divider>
                  <div class="commentOfPost" v-show="commentLoad">
                    <div v-show="commentList.length > 0">
                      <div class="comment" v-for="(comment,index) in commentList" :key="index">
                        <el-row>
                          <el-row>
                            <el-col :span="2">
                              <img :src="require('../static/author/' + comment.comment.user.avator)" width="34px" height="34px" style="border-radius: 50%"/>
                            </el-col>
                            <el-col :span="4">
                              <div class="comment_title_1">{{comment.comment.user.nickName}}</div>
                            </el-col>
                            <el-col :span="12" style="text-align: left">
                              <div class="comment_title_1">{{comment.comment.createTime|formatDate}}</div>
                            </el-col>
                            <el-col :span="6" style="text-align: right">
                              <i class="iconfont icon-pinglun comment_title_1 comment_icon" @click="dialogVisible = true;clickedComment = comment.comment.commentId"></i>
                            </el-col>
                          </el-row>
                          <div style="margin-bottom: 10px"></div>
                          <el-row>
                            <el-col :span="2">
                              <div style="width: 100%;height: 10px;"></div>
                            </el-col>
                            <el-col :span="22" class="commentContent">
                              {{ comment.comment.content }}
                              <el-divider></el-divider>
                            </el-col>
                          </el-row>
                        </el-row>

                        <el-row v-for="(comment_1,comment_index_2) in comment.children" :key="comment_index_2" style="padding-bottom: 10px;">
                          <el-col :span="2">
                            <div style="width: 34px;height: 34px;"></div>
                          </el-col>
                          <el-col :span="22">
                            <el-row>
                              <el-col :span="2">
                                <img :src="require('../static/author/' + comment_1.comment.user.avator)" width="34px" height="34px" style="border-radius: 50%"/>
                              </el-col>
                              <el-col :span="4">
                                <div class="comment_title_1">{{comment_1.comment.user.nickName}}</div>
                              </el-col>
                              <el-col :span="18" style="text-align: left">
                                <div class="comment_title_1">{{comment_1.comment.createTime|formatDate}}</div>
                              </el-col>
                            </el-row>
                            <div style="margin-bottom: 10px"></div>
                            <el-row>
                              <el-col :span="2">
                                <div style="width: 100%;height: 10px;"></div>
                              </el-col>
                              <el-col :span="22" class="commentContent">
                                {{ comment_1.comment.content }}
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                    </div>

                    <el-dialog
                        title="提示"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose"
                        :modal="false">
                      <div>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 3,maxRows:6}"
                            placeholder="评论千万条，友善第一条"
                            v-model="commentByComment"
                        >
                        </el-input>
                      </div>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="insertComment('1'),dialogVisible = false">确 定</el-button>
                      </span>
                    </el-dialog>

                    <div v-show="commentList.length === 0">
                      <p style="font-size: 14px;text-align: center;color: red;">
                        暂无评论
                      </p>
                    </div>
                  </div>
                </div>
              </el-drawer>

              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" icon="el-icon-message">私信</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" icon="el-icon-receiving">举报</el-link>
            </div>
        </el-row> 
    </div>
    <div>
        <div class="describe">
            相似推荐
        </div>
        
        <!-- 推荐（按联系的书籍推荐） -->
        <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto;height:200px;">
            <li v-for="(recommendPost,index) in recommendPosts" :key="index" class="infinite-list-item recommended" @click="toPost(recommendPost.postId)">
                  {{ recommendPost.postTitle }}
            </li>
        </ul>
    </div>
    </div>
</template>

<script>
// 这里就是引入所有的扩展的插件
import { Viewer } from '@bytemd/vue'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import breaks from '@bytemd/plugin-breaks'
import footnotes from '@bytemd/plugin-footnotes'
import frontmatter from '@bytemd/plugin-frontmatter'
import gemoji from '@bytemd/plugin-gemoji'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import mathssr from '@bytemd/plugin-math-ssr'
import { getProcessor } from 'bytemd'
import zhHans from 'bytemd/locales/zh_Hans.json'
import gfmLocale from '@bytemd/plugin-gfm/locales/zh_Hans.json';
import mathLocale from '@bytemd/plugin-math/locales/zh_Hans.json';
import mermaidLocale from '@bytemd/plugin-mermaid/locales/zh_Hans.json';
import 'highlight.js/styles/vs.css'
// import 'juejin-markdown-themes/dist/juejin.min.css'  // 掘金风格的css文件
import 'juejin-markdown-themes/dist/channing-cyan.min.css'  // channing-cyan风格的css文件，这个确实很好看
import 'bytemd/dist/index.css' // 导入编辑器样式

const plugins = [
    // 将所有的扩展功能放入插件数组中，然后就可以生效了
    gfm({ locale: gfmLocale }),
    // highlightssr(),
    breaks(),
    highlight(),
    mermaid({ locale: mermaidLocale }),
    mathssr({ locale: mathLocale }),
    frontmatter(),
    footnotes(),
    gemoji(),
    mediumZoom(),
]

export default{
    data(){
        return{
            number: 5,
            startPage:1,
            isHave:true,
            value: '', // 获取的内容
            plugins,  // 插件
            zhHans, // 简体中文
            postId:this.$route.params.postId,
            post:{},
            isLike:false,
            isCollection:false,
            recommendPosts:[],
            drawer:false,
            commentByPost:"",
            commentByComment:"",
            dialogVisible: false,
            commentList:[],
            clickedComment:0,
            commentLoad:true,
        }
    },
    components: { Viewer },
  mounted() {
    this.getPost();
  },
  methods:{
    toPost(postId){
      this.$router.replace({
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
    load() {
      if(this.isHave){
        this.$axios({
          method:"get",
          url:"/forum/getRecommendPost",
          params:{
            postId:this.postId,
            startPage:this.startPage,
            number:this.number
          }
        }).then(res => {
          if(res.data.code === 200){
            this.isHave = res.data.data.isHave;
            for (let i = 0; i < res.data.data.postList.length; i++) {
              this.recommendPosts.push(res.data.data.postList[i]);
            }
            this.startPage++;
          }
        })
      }else{
        this.$message.error("没有更多了")
      }
      },
        goBack() {
            this.$router.back(-1);
        },
        getPost(){
            this.$axios({
              method:"post",
              url:"/forum/getPostDetails/" + this.postId,
              headers:{
                "token" : localStorage.getItem("token")
              }
            }).then(res => {
              if(res.data.code === 200){
                this.post = res.data.data.post;
                this.isLike = res.data.data.isLike;
                this.isCollection = res.data.data.isCollection;
              }
            })
        },
    transferAccounts(){
      this.$confirm('您想要支持作者,送作者1书币?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method:"post",
          url:"/user/transferAccounts",
          params:{
            userId:this.post.userId,
            currencyNumber:1
          },
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res => {
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: '支持成功!'
            });
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(error => {
          console.error(error)
        })
      }).catch(() => {});
    },
    likeClick(){
      this.$axios({
        url:"/user/likePost",
        method:"post",
        params:{
          postId:this.postId
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          if(res.data.data == "+1"){
            this.$refs.likePost.classList.add("fontRedColor");
            this.$set(this.post,0,this.post.likeNumber++);
          }else if(res.data.data == "-1"){
            this.$refs.likePost.classList.remove("fontRedColor");
            this.$set(this.post,0,this.post.likeNumber--)
          }
        }else if(res.data.code === 201){
          this.$message.error("请登录后重试");
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    collectionClick(){
      this.$axios({
        url:"/user/collectionPost",
        method:"post",
        params:{
          postId:this.postId
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          if(res.data.data == "+1"){
            this.$refs.collectionPost.classList.add("fontRedColor");
            this.$set(this.post,0,this.post.collectionNumber++)
          }else if(res.data.data == "-1"){
            this.$refs.collectionPost.classList.remove("fontRedColor");
            this.$set(this.post,0,this.post.collectionNumber--)
          }
          // this.$set(this.post,this.post.likeNumber--);
        }else if(res.data.code === 201){
          this.$message.error("请登录后重试");
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    openDrawer(){
      // 评论区域展开
      this.drawer = true;
      this.getComment();
    },
    getComment(){
      this.$axios({
        method:"post",
        url:"/forum/getComment",
        params:{
          postId :this.postId
        }
      }).then(res => {
        if(res.data.code === 200){
          this.commentList = res.data.data;
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    insertComment(type){
      let content;let commentId;
      if(type === '0'){
        if(this.commentByPost != ""){
          content = this.commentByPost;
          commentId = this.postId;
        }else{
          this.$message.error("请先输入内容再评论")
        }
      }else if(type === '1'){
        if(this.commentByComment != "" && this.clickedComment != 0){
          content = this.commentByComment;
          commentId = this.clickedComment;
        }else{
          this.$message.error("请先输入内容再评论")
        }
      }
      // this.commentLoad = false;
      this.$axios({
        method:"post",
        url:"/user/commentPost",
        params:{
          commentId:commentId,
          content:content,
          type:type
        },
        headers:{
          "token":localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          // this.commentLoad = true;
          this.$message.success(res.data.msg);
          this.getComment();
          // location.reload()
        }else if(res.data.code === 201){
          this.$message.warning("请先登录后重试");
        }
      })
    },
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
#postStyle{
    padding:20px;
}
p{
    margin: 0;
}
h3{
    text-align: center;
}
h5{
    text-align:right;
}
li{
    list-style: none;
    padding: 0;
    margin: 0;
}
ul{
    padding: 0;
    margin:0;
}
.postText{
    font-size:16px;
    line-height:40px;
    text-align: justify;
    text-indent: 2em;
}

 .el-col {
     border-radius: 4px;
 }

 .bg-purple-dark {
     background: #99a9bf;
 }

 .bg-purple {
     background: #d3dce6;
 }

 .bg-purple-light {
     background: #e5e9f2;
 }

 .grid-content {
     border-radius: 4px;
     min-height: 36px;
 }

 .recommended{
    height: 80px;
    margin:15px;
    border-radius: 5px;
    border: #d2d7dd 0.5px solid;
    cursor: pointer;
 }
 .recommended:hover{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
 }

 .describe{
    height:40px;
    background-color:#F3F3F3;
    text-align: center;
    line-height:40px;
 }

 .fontRedColor{
   color: red;
 }

.fontBlackColor{
  color: black;
}

 .sendBlessing{
    font-size: 60px;
    cursor: pointer;
 }
 .sendBlessing:hover{
    color: rgb(231, 79, 97);
 }
 .author{
    color: #409eff;
    cursor: pointer;
 }
 .author:hover{
    text-decoration: underline;
    color: rgb(238, 27, 202);
 }
 .book{
   color: #4e9bc6;
   cursor: pointer;
 }
 .book:hover{
   color: #8e44ad;
   text-decoration: #151415 underline;
 }
 #comment{
   position: relative;
   height: auto;
   width: 94%;
   margin: 0 3%;
 }

 .commentOfPost{
   padding-top: 10px;
   text-align: left;
 }
 .comment{
   width: 100%;
   padding-bottom: 15px;
 }
 .comment_1{
   position: relative;
   width: 100%;
   background: papayawhip;
 }

 .comment_2{
   position: relative;
   text-indent: 20px;
   font-size: 12px;
   line-height: 200%;
   padding-bottom: 15px;
 }
 .comment_3{
   position: relative;
   line-height: 200%;
   text-indent: 40px;
   font-size: 12px;
   padding-bottom: 15px;
 }

.comment_4{
  position: relative;
  line-height: 200%;
  font-size: 12px;
  text-indent: 60px;
}
.comment_title_1{
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color:#575555;
}
.comment_icon{
  cursor: pointer;
}
.commentContent{
  font-family: 'roboto mono', monospace;
  font-size: 14px;
  text-align: justify;
}
</style>