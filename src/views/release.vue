<template>
    <div class="details">
        <div id="head">
            <el-popconfirm title="您现在退出不会保存,确认退出?" @confirm="goBack">
            <el-button style="margin-left:10px;" slot="reference">返回</el-button>
            </el-popconfirm>
            <el-button type="primary" @click="save" style="margin-left:10px;">发布</el-button>
            <el-input type="text" placeholder="请输入标题" v-model="title" maxlength="10" style="width:400px;padding-left:20px;padding-right: 20px;;">
            </el-input>
            <el-cascader placeholder="选择绑定的书籍类型" :options="bookList" v-model="book"  filterable>
              <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
        </div>
        <Editor class="editos" :value="value" :plugins="plugins" :locale="zhHans" @change="handleChange"
            :uploadImages="uploadImage" />
        <Viewer class="viewer" :tabindex="2" :sanitize="23" :value="value" :plugins="plugins" :locale="zhHans"></Viewer>
    </div>
</template>

<script>
// 这里就是引入所有的扩展的插件
import { Editor, Viewer } from '@bytemd/vue'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import breaks from '@bytemd/plugin-breaks'
import footnotes from '@bytemd/plugin-footnotes'
import frontmatter from '@bytemd/plugin-frontmatter'
import gemoji from '@bytemd/plugin-gemoji'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import mathssr from '@bytemd/plugin-math-ssr'
// eslint-disable-next-line no-unused-vars
import { getProcessor } from 'bytemd'
import zhHans from 'bytemd/locales/zh_Hans.json'
import gfmLocale from '@bytemd/plugin-gfm/locales/zh_Hans.json';
import mathLocale from '@bytemd/plugin-math/locales/zh_Hans.json';
import mermaidLocale from '@bytemd/plugin-mermaid/locales/zh_Hans.json';
import 'highlight.js/styles/vs.css'
// import 'juejin-markdown-themes/dist/juejin.min.css'  // 掘金风格的css文件
import 'juejin-markdown-themes/dist/channing-cyan.min.css'  // channing-cyan风格的css文件，这个确实很好看
import 'bytemd/dist/index.css'
 // 导入编辑器样式

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
    mediumZoom()
]

export default {
    components: { Editor, Viewer }, // 组件注册
    data() {
        return {
            value: '', // 获取的内容
            plugins,  // 插件
            zhHans, // 简体中文
            title:"",
            bookList: [],
            book:[]
        }
    },
  mounted() {
    this.getBookClassification();
  },
  methods: {
        // 获取书写文档内容
        handleChange(v) {
            // console.warn(v)
            this.$emit("input", v)
            this.value = v
        },
        // 上传图片 点击触发上传图片事件，大家获取文件把图片上传服务器然后返回url既可
        async uploadImage(files) {
            console.log('files', files)
            return [
                {
                    title: files.map((i) => i.name),
                    url: 'http://192.168.214.144:9527/api/user/uploadOtherImg?type=1',
                    headers:{
                      token:localStorage.getItem("token")
                    }
                }
            ]
        },
        goBack(){
            this.$router.go(-1);
        },
      getBookClassification(){
          this.$axios.post("/book/getBookClassification").then(res =>{
            let books = res.data.data;
            for (let i = 0; i < books.length; i++) {
              let bookTypeName = books[i].bookTypeName;
              let bookNames = books[i].bookNames.split(",");
              let bookIds = books[i].bookIds.split(",");
              let bookByType = {
                label: '',
                value:'',
                children: [

                ]
              }
              for (let j = 0; j < bookNames.length; j++) {
                let book = {value:"指南一",label:"指南"};
                book.value = bookIds[j];
                book.label = bookNames[j];
                bookByType.children.push(book);
              }
              bookByType.label = bookTypeName;
              bookByType.value = bookTypeName;
              this.bookList.push(bookByType)
            }
          })
       },
    clearData(){
        this.value = "";
        this.title = "";
        this.book = "";
    },
        save(){
          if(this.title == "" || this.value == "" || this.book.length == 0) {
            this.$message.error("请填写相关内容重试")
          }else{
            console.log(this.book)
            const h = this.$createElement;
            this.$msgbox({
              title: '消息',
              message: h('p', null, [
                h('span', null, '此操作将上传您的内容进行审核,'),
                h('i', { style: 'color: teal' }, '审核?')
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  instance.confirmButtonText = '执行中...';
                    this.$axios({
                      method:"put",
                      url:"/user/releasePost",
                      params:{
                        postTitle:this.title,
                        postContent:this.value,
                        bookId:this.book[1],
                      },
                      headers:{
                        "token": localStorage.getItem("token")
                      }
                    }).then(res => {
                     if(res.data.code === 200){
                       this.$message.success("发表成功，请等待管理员进行审核");
                       done();
                       this.clearData();
                       // location.reload()
                     }else if(res.data.code === 201){
                       this.$message.error("请登录后重试")
                     }else if(res.data.code === 304){
                       this.$message.error("您无权访问此资源")
                     }
                      instance.confirmButtonLoading = false;
                      instance.confirmButtonText = "发表";
                    }).catch(error => {
                      console.error(error)
                    });
                } else {
                  done();
                }
              }
            }).then(action => {

            });
          }
        },
    }
}
</script>
<style lang="scss" scoped>
#head{
    height:50px;
    width:100%;
    padding-top: 10px;
}
</style>
