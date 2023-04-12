<template>
  <div>
    <el-table
        :data="bookList"
        style="width: 100%">
      <el-skeleton :rows="6" animated v-show="bookList.length == 0"/>
      <el-table-column
          prop="bookId"
          label="编号"
          >
      </el-table-column>
      <el-table-column
          prop="bookName"
          label="名称">
      </el-table-column>
      <el-table-column
          prop="status"
          >
        <template slot="header" slot-scope="scope">
          <template>
            <el-dropdown @command="changeStatus">
              <span class="el-dropdown-link">
                状态<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command=-1>全部</el-dropdown-item>
                <el-dropdown-item command=0>正常</el-dropdown-item>
                <el-dropdown-item command=1>待审核</el-dropdown-item>
                <el-dropdown-item command=2>筹备中</el-dropdown-item>
                <el-dropdown-item command=3>下架</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </template>
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status === '0' ? 'success' :'warning' "
              disable-transitions>
            {{scope.row.status|statusFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="author"
          label="作者">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          sortable
          >
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更改时间"
          sortable
          >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 30px;padding-bottom: 30px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="filterCriteria.startPage"
          :page-size="18"
          layout="prev, pager, next, jumper"
          :total="maxNumber"
          style="margin-left: 40%"
          background>
      </el-pagination>
    </div>

    <el-drawer
        title="更改书籍"
        :visible.sync="drawer"
        direction="rtl"
        size="500px"
        :before-close="handleClose">
      <div>
        <div style="margin: 0px 20px">
          <el-form ref="form" :model="form" label-width="80px" label-position="top">
              <el-image :src="require('/src/static/img/book/' + form.imgUrl)"
                        style="height: 240px;width: 180px;margin-left: 30%;background-color: #99a9bf">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
              </el-image>
            <el-form-item label="书籍名称">
              <el-input v-model="form.bookName"></el-input>
            </el-form-item>
            <el-form-item label="书籍类型">
              <el-select  v-model="form.bookTypeId" placeholder="请选择书籍类型" style="width: 100%">
                <el-option :label="bookType.bookTypeName" :value="bookType.bookTypeId" v-for="(bookType,index) in bookTypeList" :key="index+1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="书籍状态">
              <el-select v-model="form.status" placeholder="请选择书籍状态" style="width: 100%">
                <el-option label="正常" value="0"></el-option>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="筹备中" value="2"></el-option>
                <el-option label="下架" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="form.author"></el-input>
            </el-form-item>
            <el-form-item label="贡献人">
              <el-input v-model="nickName" disabled></el-input>
            </el-form-item>
            <el-form-item label="书籍路径" v-if="bookPathUrlList.length > 0">
              <el-select  v-model="validPath" placeholder="请选择书籍路径" style="width: 100%">
                <el-option :label="bookPathUrl.path" :value="bookPathUrl.path" v-for="(bookPathUrl,index) in bookPathUrlList" :key="index+1"></el-option>
              </el-select>
              <el-link type="primary" @click="showBook">预览</el-link>
            </el-form-item>
            <el-form-item label="简介">
              <el-input type="textarea" v-model="form.remark" height="300px" autosize></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel">取消</el-button>
              <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-drawer>
    <el-row>
      <el-dialog :title="form.bookName" :visible.sync="dialogBookVisible" :modal="false" style="height: 700px;">
        <iframe :src="'/static/pdf/'  + validPath" style="position: relative;width: 100%;height: 700px;"></iframe>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "backstageBookComponent",
  data(){
    return{
      bookList: [],
      filterCriteria:{
        bookType:0,
        status:-1,
        order:0,
        startPage:1,
        startTime:'',
        endTime:'',

      },
      dialogBookVisible:false,
      nickName: "",
      maxNumber:0,
      drawer:false,
      form: {
        "imgUrl": "2c5a89b1-aa08-4868-b73a-e70da08f9d35.jpg",
      },
      bookTypeList:[],
      bookPathUrlList:[],
      validPath:"",
      value:-1,
    }
  },
  mounted() {
    this.getBookList();
    this.getBookTypeList();
  },
  methods:{
    handleEdit(index, row) {
      this.drawer = true;
      this.form = this.bookList[index];
      this.getNickNameById();
      this.getBookPath(this.bookList[index].bookId)
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    getBookList() {
      this.$axios({
        method:"get",
        url:"/book/getBookByCondition",
        params:{
          bookType:this.filterCriteria.bookType,
          status:this.filterCriteria.status,
          order:this.filterCriteria.order,
          startPage:this.filterCriteria.startPage,
          startTime:this.filterCriteria.startTime,
          endTime:this.filterCriteria.endTime,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.bookList = res.data.data.books;
          this.maxNumber = res.data.data.size;
        }
      })
    },
    getBookTypeList(){
      this.$axios({
        method:"get",
        url:"/book/getBookType",
      }).then(res => {
        if(res.data.code === 200){
          this.bookTypeList = res.data.data;
        }
      })
    },
    getBookPath(bookId){
      this.$axios({
        method:"post",
        url:"/admin/getBookPath",
        params:{
          bookId:bookId
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.bookPathUrlList = res.data.data;

          for (let i = 0; i < this.bookPathUrlList.length; i++) {
            if(this.bookPathUrlList[i].status === "0"){
              this.validPath = this.bookPathUrlList[i].path;
              break;
            }
          }
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.filterCriteria.startPage = val;
      this.getBookList();
      console.log(`当前页: ${val}`);
    },
    filterTag(value, row){
      console.warn(value);
      this.filterCriteria.status = value;
      // if(this.value != value){
      //   this.getBookList();
      //   this.value = value;
      // }
      return row.status === value;
    },
    changeStatus(command){
      this.filterCriteria.status = command;
      this.getBookList();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done();
            this.form = {
              "imgUrl": "2c5a89b1-aa08-4868-b73a-e70da08f9d35.jpg",
            }
          })
          .catch(() => {});
    },
    sortTable(a,b){
      console.warn(a)
      console.log(b)
    },
    onSubmit() {
      this.drawer = false;
      this.setBook();
    },
    showBook(){
      this.dialogBookVisible = true;
    },
    onCancel(){
      this.drawer = false;
      this.form = {
        "imgUrl": "2c5a89b1-aa08-4868-b73a-e70da08f9d35.jpg",
      }
    },
    setBook(){
      console.warn(this.form)
      this.$axios({
        method:"post",
        url:"/admin/setBook",
        params:{
          bookId:this.form.bookId,
          bookName:this.form.bookName,
          bookTypeId:this.form.bookTypeId,
          status:this.form.status,
          author:this.form.author,
          remark:this.form.remark,
          bookPath:this.validPath,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.$message.success(res.data.msg)
          this.form = {
            "imgUrl": "2c5a89b1-aa08-4868-b73a-e70da08f9d35.jpg",
          };
          this.getBookList();
        }else{
          this.$message.error("更改失败")
        }
      })
    },
    getNickNameById(){
      this.$axios({
        method:"post",
        url:"/verification/getNickNameById",
        params:{
          userId:this.form.contributor
        }
      }).then(res =>{
        if(res.data.code == 200){
          this.nickName = res.data.msg;
        }else{
          this.nickName = this.form.constructor;
        }
      })
    }
  },
  watch:{

  },
  filters:{
    statusFilter(val){
      switch (val){
        case '0':
          return "正常";
        case '1':
          return "待审核";
        case '2':
          return "筹备中";
        case '3':
          return "下架";
      }
    }
  }
}
</script>

<style scoped>

</style>