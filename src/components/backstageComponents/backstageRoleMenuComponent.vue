<template>
  <div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%">
      <el-skeleton :rows="6" animated v-show="tableData.length == 0"/>
      <el-table-column
          prop="rid"
          label="职位id"
          >
      </el-table-column>
      <el-table-column
          prop="roleName"
          label="职位名称">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作">
        <template slot-scope="scope">
          <el-popover
              placement="left"
              width="450"
              trigger="click">
            <el-table :data="permission">
              <el-table-column property="pid" label="标志"></el-table-column>
              <el-table-column property="permissionName" label="名称"></el-table-column>
              <el-table-column property="url" label="资源路径"></el-table-column>
              <el-table-column property="createTime" label="创建时间"></el-table-column>
            </el-table>
            <el-button slot="reference" type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          </el-popover>

          <el-button type="text" size="small" style="margin-left: 5px;" @click="editClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="资源路径" :visible.sync="dialogTableVisible" style="height: auto;">
      <el-tree
          :data="menuTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultKeys"
          ref="tree"
      >
      </el-tree>
      <el-divider/>
      <div style="position: relative;height: 15px;padding-bottom: 5px">
        <el-button type="success" style="position: absolute;right: 0" @click="getCheckedNodes()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "backstageRoleMenuComponent.vue",
  data(){
    return{
      tableData: [],
      permission:[],
      dialogTableVisible:false,
      menuTree:[],
      defaultKeys:[],
      rid:0,
    }
  },
  mounted() {
    this.getAllRole();
  },
  methods:{
    handleClick(row) {
      this.getPermissionByRoleId(row.rid);
    },
    editClick(row) {
      this.rid = row.rid;
      this.getPermissionByRoleId(row.rid);
      this.getAllPermission();
      this.dialogTableVisible = true;
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
          this.tableData = res.data.data;
        }
      })
    },
    getPermissionByRoleId(roleId){
      this.$axios({
        method:"post",
        url:"/admin/getPermissionByRoleId",
        params:{
          roleId:roleId
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.defaultKeys = [];
          this.permission = res.data.data;
          for (let i = 0; i < res.data.data.length; i++) {
            this.defaultKeys.push(res.data.data[i].pid)
          }
        }
      })
    },
    getAllPermission(){
      this.$axios({
        method:"post",
        url:"/admin/getPermissionList",
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.menuTree = [];
          for (let i = 0; i < res.data.data.length; i++) {
            let template = {
              id:res.data.data[i].pid,
              label:res.data.data[i].permissionName
            }
            this.menuTree.push(template)
          }
        }
      })
    },
    getCheckedNodes(){
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      let permission = checkedNodes[0].id;
      for (let i = 1; i < checkedNodes.length; i++) {
        permission += "," + checkedNodes[1].id;
      }
      this.$axios({
        method:"post",
        url:"/admin/setRolePermission",
        params:{
          roleId:this.rid,
          permissionIds:permission,
        },
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.$message.success(res.data.msg);
        }else{
          this.$message.error(res.data.msg);
        }
        this.dialogTableVisible = false;
      })
    },
  }
}
</script>

<style scoped>

</style>