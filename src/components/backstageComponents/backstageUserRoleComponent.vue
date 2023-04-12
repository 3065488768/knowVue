<template>
  <div>
    <el-row>
      <el-button type="primary" style="float: left" @click="openDialog">新增</el-button>
<!--      <el-input style="float: right;width: 200px"></el-input>-->
      <el-dialog
          title="新增用户职位关系"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
      center>
        <el-row style="text-align: center">
          <span style="padding-right: 20px;">用户名</span>
          <el-select v-model="selectedUser" filterable placeholder="请选择">
            <el-option
                v-for="(user,index) in userList"
                :key="index"
                :label="user.userName"
                :value="user.userId">
            </el-option>
          </el-select>
        </el-row>
       <el-row style="margin-top: 20px;text-align: center">
         <span style="padding-right: 30px;">职位</span>
         <el-select v-model="selectedRole" filterable placeholder="请选择">
           <el-option
               v-for="(role,index) in roleList"
               :key="index"
               :label="role.roleName"
               :value="role.rid">
           </el-option>
         </el-select>
       </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="bindUserRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <el-table
        :data="userRoleList"
        style="width: 100%"
        max-height="600"
        stripe>
      <el-skeleton :rows="6" animated v-show="userRoleList.length == 0"/>
      <el-table-column
          fixed
          prop="userName"
          label="用户名"
      >
      </el-table-column>
      <el-table-column
          prop="roleName"
          label="职位"
      >
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="120">
        <template slot-scope="scope">
          <el-button
              @click.native.prevent="deleteRow(scope.$index, userRoleList)"
              type="text"
              size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "backstageUserRoleComponent",
  data(){
    return{
      userRoleList:[],
      userList:[],
      roleList:[],
      dialogVisible:false,
      selectedUser:'',
      selectedRole:''
    }
  },
  mounted() {
    this.init();
  },
  methods:{
    deleteRow(index, rows) {
      console.warn(rows[index])
      this.$axios({
        method:"post",
        url:"/admin/removeUserRoleBind",
        params:{
          userId:rows[index].userId,
          roleId:rows[index].roleId
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.$message.success("移除成功");
          rows.splice(index, 1);
        }
      })
    },
    init(){
      this.getUserList();
      this.getUserRoleList();
      this.getRoleList();
    },
    getUserRoleList(){
      this.$axios({
        method:"post",
        url:"/admin/getUserRoleList",
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.userRoleList = res.data.data;
        }
      })
    },
    getRoleList(){
      this.$axios({
        method:"post",
        url:"/admin/getRoleList",
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.roleList = res.data.data;
        }
      })
    },
    getUserList() {
      this.$axios({
        method:"post",
        url:"/admin/getUserList",
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.userList = res.data.data;
        }
      })
    },
    openDialog(){
      this.dialogVisible = true;
    },
    bindUserRole(){
      console.warn(this.selectedUser,this.selectedRole)
      this.$axios({
        method:"post",
        url:"/admin/bindUserRole",
        params:{
          userId:this.selectedUser,
          roleId:this.selectedRole,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.$message.success(res.data.msg);
          this.dialogVisible = false;
          this.getUserRoleList();
        }else{
          this.$message.error(res.data.msg);
        }
      })

    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    }
  }
}
</script>

<style scoped>

</style>