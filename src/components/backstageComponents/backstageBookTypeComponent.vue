<template>
  <div>
    <el-table
        :data="bookTypeList"
        stripe
        style="width: 100%">
      <el-skeleton :rows="6" animated v-show="bookTypeList.length == 0"/>
      <el-table-column
          prop="bookTypeId"
          label="编号"
          >
      </el-table-column>
      <el-table-column
          prop="bookTypeName"
          label="名称"
          >
      </el-table-column>
      <el-table-column
          label="版块">
        <template slot-scope="scope">
          {{bookTypePlate[scope.$index].plateName}}
        </template>
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer
        title="更改类型"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleClose">
      <div style="padding: 0px 20px">
        <el-form label-position="top" label-width="80px" :model="form">
          <el-form-item label="名称">
            <el-input v-model="form.bookTypeName"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="form.plateId" placeholder="请选择" style="width: 100%">
              <el-option
                  v-for="(plate,index) in plateList"
                  :key="index"
                  :label="plate.plateName"
                  :value="plate.plateId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button @click="updateBookType">提交</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "backstageBookTypeComponent",
  data(){
    return{
      bookTypeList:[],
      plateList:[],
      bookTypePlate:[],
      drawer:false,
      form:{
        bookTypeId:0,
        bookTypeName:"",
        plateId:"",
      },
    }
  },
  mounted() {
    this.getPlateByRanking();
    this.getBookTypeList();
  },
  methods:{
    getBookTypeList(){
      this.$axios({
        method:'get',
        url:"/book/getBookType"
      }).then(res =>{
        if(res.data.code === 200){
          this.bookTypeList = res.data.data;
          this.bookTypePlate = [];
          for (let i = 0; i < this.bookTypeList.length; i++) {
            for (let j = 0; j < this.plateList.length; j++) {
              if(this.bookTypeList[i].plateId === this.plateList[j].plateId){
                this.bookTypePlate.push(this.plateList[j])
              }
            }
          }
        }
      })
    },
    getPlateByRanking(){
      this.$axios({
        method:'get',
        url:"/forum/getPlateByRanking"
      }).then(res =>{
        if(res.data.code === 200){
          this.plateList = res.data.data;
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {});
    },
    handleEdit(index, row) {
      this.form.bookTypeId = row.bookTypeId;
      this.form.bookTypeName = row.bookTypeName;
      this.form.plateId = row.plateId;
      this.drawer = true;
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.deleteBookType(row.bookTypeId);
      console.log(index, row);
    },
    updateBookType(){
      console.warn(this.form);
      this.$axios({
        method:"post",
        url:"/admin/updateBookType",
        params:{
          bookTypeId:this.form.bookTypeId,
          bookTypeName:this.form.bookTypeName,
          plateId:this.form.plateId
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.drawer = false;
          this.$message.success(res.data.msg);
          this.form = {
            bookTypeId:0,
            bookTypeName:"",
            plateId:"",
          };
          this.getBookTypeList();
        }
      })
    },
    deleteBookType(bookTypeId){
      this.$axios({
        method:"post",
        url:"/admin/deleteBookType",
        params:{
          bookTypeId:bookTypeId,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.getBookTypeList();
        }else{
          this.$message.error(res.data.msg);
        }
      })
    },
  }
}
</script>

<style scoped>

</style>