<template>
  <div>
    <el-table
        :data="postList"
        style="width: 100%">
      <el-skeleton :rows="6" animated v-show="postList.length == 0"/>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div style="padding: 20px 60px;border: #8e44ad solid 1px">
            <Viewer class="viewer" :tabindex="2" :sanitize="23" :value="props.row.postContent" :plugins="plugins" :locale="zhHans" style="min-height: 173px;"></Viewer>
          </div>
          <div style="padding: 20px">
            <span v-if="props.row.status === '1' || props.row.status === '2'">
              <el-button type="success" @click="updatePostStatus(props.row.postId,0)" style="margin-right: 20px;">过!</el-button>
              <el-popover
                  placement="right"
                  width="400"
                  trigger="click"
                  v-model="visible">
                <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
                <template style="padding:20px">
                   <el-form ref="form" :model="form" label-width="80px">
                      <el-form-item label="原因">
                        <el-select v-model="form.type" placeholder="请选择原因类型">
                          <el-option label="政治原因" value="0"></el-option>
                          <el-option label="色情" value="1"></el-option>
                          <el-option label="违法" value="2"></el-option>
                          <el-option label="低俗" value="3"></el-option>
                          <el-option label="赌博" value="4"></el-option>
                           <el-option label="谣言" value="5"></el-option>
                        </el-select>
                      </el-form-item>
                       <el-form-item label="备注">
                         <el-input type="textarea" v-model="form.message"></el-input>
                       </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="updatePostStatus(props.row.postId,-1)">确认</el-button>
                        <el-button @click="visible=false">取消</el-button>
                      </el-form-item>
                   </el-form>
                </template>
                <el-button type="danger" slot="reference">不过!</el-button>
              </el-popover>
            </span>
            <span v-else>
              <el-button type="warning" @click="updatePostStatus(props.row.postId,3)">停用</el-button>
              <el-button type="danger" @click="updatePostStatus(props.row.postId,4)">删除</el-button>
              <el-button type="primary" @click="updatePostType(props.row.postId,2)">设为精华</el-button>
              <el-button type="primary" @click="updatePostType(props.row.postId,3)">设为置顶</el-button>
            </span>
          </div>

        </template>
      </el-table-column>
      <el-table-column
          label="帖子编号"
          prop="postId"
      width="100px">
      </el-table-column>
      <el-table-column
          label="帖子标题"
          prop="postTitle"
          width="200px">
      </el-table-column>
      <el-table-column
          label="版块"
          prop="plateName">
      </el-table-column>
<!--      0-普通帖子 1-精华帖  2-求助帖 3-置顶帖-->
      <el-table-column
          label="帖子类型">
        <template slot-scope="scope">
          {{ scope.row.postType|postTypeFilter }}
        </template>
      </el-table-column>
<!--      0-正常 1-审核中 2-待审核 3-停用 4-删除 5-草稿-->
      <el-table-column
          label="状态">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              状态<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">正常</el-dropdown-item>
              <el-dropdown-item command="1">待审核</el-dropdown-item>
              <el-dropdown-item command="2">已驳回</el-dropdown-item>
              <el-dropdown-item command="3">停用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==='0'?'success':''">
          {{ scope.row.status|statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="关联书籍"
          prop="bookName">
      </el-table-column>
      <el-table-column
          label="创建人"
          prop="createBy">
      </el-table-column>
      <el-table-column
          label="创建时间"
          >
        <template slot-scope="scope">
          {{scope.row.createTime|timeFilter}}
        </template>
      </el-table-column>
      <el-table-column
          label="更新时间"
         >
        <template slot-scope="scope">
          {{scope.row.updateTime}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="filter.startPage"
        :page-size="postList.length"
        layout="total, prev, pager, next"
        :total="size">
    </el-pagination>
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

export default {
  name: "backstagePostComponent",
  data(){
    return{
      value: '', // 获取的内容
      plugins,  // 插件
      zhHans, // 简体中文
      postList: [],
      filter:{
        status:'1',
        orderBy:'1',
        postType:'0',
        startPage:1
      },
      size:0,
      form:{
        type:"",
        message:""
      },
      visible:false,
    }
  },
  components: { Viewer },
  mounted() {
    this.getPostList();
  },
  methods:{
    getPostList(){
      this.$axios({
        method:"post",
        url:"/admin/getPostList",
        params:{
          status:this.filter.status,
          orderBy:this.filter.orderBy,
          postType:this.filter.postType,
          startPage:this.filter.startPage,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res =>{
        if(res.data.code === 200){
          this.postList = res.data.data.postList;
          console.warn(this.postList)
          this.size = res.data.data.size;
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.filter.startPage = val;
      this.getPostList();
      console.log(`当前页: ${val}`);
    },
    handleCommand(command) {
      this.filter.status = command;
      this.getPostList();
    },
    updatePostStatus(postId,status){
      this.$axios({
        method:"post",
        url:"/admin/updatePostStatus",
        params:{
          postId:postId,
          status:status,
          reasonType:this.form.type,
          reasonContent:this.form.message
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.$message.success("修改成功")
        }
        this.form = {
          type:"",
          message:""
        };
        this.visible=false;
      })
    },
    updatePostType(postId,type){
      this.$axios({
        method:"post",
        url:"/admin/updatePostStatus",
        params:{
          postId:postId,
          type:type,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.$message.success("修改成功")
        }
      })
    }
  },
  filters:{
    postTypeFilter(val){
      switch (val){
        case '0': return "普通帖";
        case '1': return "精华帖";
        case '2': return "求助帖";
        case '3': return "置顶帖";
        default:
          return val;
      }
    },
    statusFilter(val){
      switch (val){
        case '0': return "正常";
        case '1': return "审核中";
        case '2': return "已驳回";
        case '3': return "停用";
        case '4': return "删除";
        default:
          return val;
      }
    },
    timeFilter(val){
        let val1 = val.substring(0,10)
        let val2 =val.substring(11,19)
        return val1 + " " + val2;
    }
  }
}
</script>

<style scoped>

</style>