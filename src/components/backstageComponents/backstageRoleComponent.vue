<template>
  <div>
    <el-table
        :data="roleList"
        style="width: 100%">
      <el-skeleton :rows="6" animated v-show="roleList.length == 0"/>
      <el-table-column
          prop="rid"
          label="编号"
          sortable
          >
      </el-table-column>
      <el-table-column
          prop="roleName"
          label="名称"
          sortable
          >
      </el-table-column>
      <el-table-column
          prop="roleDesc"
          label="描述"
          sortable>
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
              @click="handleEdit(scope.$index, scope.row)" style="margin-right: 5px;">编辑</el-button>
          <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="deleteRole(scope.row)"
          >
          <el-button
              size="mini"
              type="danger"
              slot="reference"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        title="修改"
        :visible.sync="dialogVisible"
        width="30%"
        center>
      <span>
        <el-form :model="roleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
          <el-form-item label="名称" prop="roleName">
            <el-input type="text"  v-model="roleForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="roleDesc">
             <el-input type="textarea" v-model="roleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "backstageRoleComponent",
  data(){
    return{
      roleList: [],
      roleForm:{},
      rules: {
        roleName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
      },
      dialogVisible:false,
    };
  },
  mounted() {
    this.getAllRole();
  },
  methods:{
    handleEdit(index, row) {
      this.roleForm = row;
      this.dialogVisible = true;
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    getAllRole(){
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
    updateRole(){
      this.$axios({
        method:"post",
        url:"/admin/setRole",
        params:{
          rid:this.roleForm.rid,
          roleName:this.roleForm.roleName,
          roleDesc:this.roleForm.roleDesc,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.$message.success(res.data.msg);
          this.getAllRole();
          this.dialogVisible = false;
          this.roleForm = {};
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    cancel(){
      this.dialogVisible = false;
      this.roleForm = {};
    },
    addRole(){

    },
    deleteRole(value){
      this.$axios({
        method:"post",
        url:"/admin/deleteRole",
        params:{
          roleId:value.rid,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.$message.success(res.data.msg)
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>