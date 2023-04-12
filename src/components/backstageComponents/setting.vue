<template>
  <div>
    <el-table
        :data="parameter"
        stripe
        style="width: 100%">
      <el-table-column
          prop="parameterId"
          label="编号">
      </el-table-column>

      <el-table-column
          prop="remark"
          label="备注">
      </el-table-column>

      <el-table-column
        label="数量">
        <template slot-scope="scope">
          <div v-if="!edit">
            {{ scope.row.number }}
            <i class="el-icon-edit" @click="changeEdit(scope.$index, scope.row)" style="cursor: pointer"/>
          </div>
          <div v-else>
            <el-input-number v-model="num" @change="handleChange" :min="1" :max="20" label="描述文字" size="mini"></el-input-number>
            <i class="el-icon-check" style="padding-left: 20px;cursor: pointer" @click="updateSetting(scope.row)"/>
          </div>
        </template>

    </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "setting",
  data(){
    return{
      parameter:[],
      edit:false,
      num: 10
    }
  },
  mounted() {
    this.getSystemParameter();
  },
  methods:{
    getSystemParameter(){
      this.$axios({
        method:"post",
        url:"/admin/getSystemParameter",
        headers:{
          token:localStorage.getItem("token")
        }
      }).then(res => {
        if(res.data.code === 200){
          this.parameter = res.data.data;
        }
      })
    },
    handleChange(value) {
      console.log(value);
    },
    changeEdit(index, row){
      this.num = row.number;
      this.edit = true;
    },
    updateSetting(row){
      if(row.number != this.num){
        this.$axios({
          method:"post",
          url:"/admin/setSystemParameter",
          params:{
            id:row.parameterId,
            number:this.num
          },
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res => {
          if(res.data.code === 200){
            this.$message.success(res.data.msg)
            this.getSystemParameter();
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }else{
        this.$message.success("更改成功")
      }
      this.edit = false;
    }
  }
}
</script>

<style scoped>

</style>