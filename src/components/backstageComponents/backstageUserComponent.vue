<template>
<div>
  <el-table
      :data="tableData"
      max-height="700"
      ref="userTable"
      @selection-change="handleSelectionChange"
      stripe>
    <el-skeleton :rows="6" animated v-show="tableData.length == 0"/>
    <el-table-column
        type="selection"
        width="55">
    </el-table-column>
    <el-table-column
        prop="userId"
        label="用户id">
    </el-table-column>
    <el-table-column
        prop="userName"
        label="用户名">
    </el-table-column>
    <el-table-column
        prop="nickName"
        label="昵称">
    </el-table-column>
    <el-table-column
        prop="email"
        label="邮箱">
    </el-table-column>
    <el-table-column
        prop="status"
        :filters="[{ text: '正常', value: '0' }, { text: '禁用', value: '1' }]"
        :filter-method="filterStatus"
        label="状态">
      <template slot-scope="scope">
        <el-tag
            :type="scope.row.status === '0' ? 'success' : 'warning'"
            :filter-method="filterStatus"
            disable-transitions>{{scope.row.status === '0'?'正常':'禁用'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
        prop="createIp"
        label="ip地址">
    </el-table-column>
    <el-table-column
        prop="createTime"
        label="创建时间"
        sortable>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">启用</el-button>
        <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">禁用</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  name: "backstageUserComponent",
  data(){
    return{
      tableData: [],
      multipleSelection: []
    }
  },
  methods:{
    getUserList(){
      this.$axios({
        method:"post",
        url:"/admin/getUserList",
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.tableData = res.data.data;
        }
      })
    },
    updateUser(flag,userId){
        this.$axios({
          method:"post",
          url:"/admin/setUserStatus",
          params:{
            flag:flag,
            userId:userId
          },
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res => {
          if(res.data.code === 200){
            this.$message.success(res.data.msg);
            this.getUserList();
          }else{
            this.$message.error(res.data.msg)
          }

        })
    },
    // 启用
    handleEdit(index, row) {
      console.log(index, row);
      if(this.tableData[index].status != '0'){
        this.updateUser('0',this.tableData[index].userId)
      }else{
        this.$message.warning("请勿重复操作")
      }
    },
    // 禁用
    handleDelete(index, row) {
      console.log(index, row);
      if(this.tableData[index].status != '1'){
        this.updateUser('1',this.tableData[index].userId)
      }else{
        this.$message.warning("请勿重复操作")
      }
    },
    filterStatus(value, row){
     return row.status === value;
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    }
  },
  mounted() {
    this.getUserList();
  }
}
</script>

<style scoped>

</style>