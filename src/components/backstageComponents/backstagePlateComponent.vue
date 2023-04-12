<template>
  <div>
    <el-table
        :data="plateList"
        stripe
        style="width: 100%">
      <el-skeleton :rows="6" animated v-show="plateList.length == 0"/>
      <el-table-column
          prop="plateId"
          label="编号"
      >
      </el-table-column>
      <el-table-column
          label="名称">
        <template slot-scope="scope">
          <div v-if="!edit[scope.$index]">
            {{scope.row.plateName}}
            <i class="el-icon-edit" @click="editPlateName(scope.$index)"></i>
          </div>
          <div v-else>
            <el-input v-model="plateNameByEdit[scope.$index]" :placeholder="scope.row.plateName" style="width: 120px"></el-input>
            <i class="el-icon-close" style="padding-left: 10px" @click="close(scope.$index)"/>
            <i class="el-icon-check" style="padding-left: 10px" @click="updatePlate(scope.$index,scope.row)"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="图片">
        <template slot-scope="scope">
          <el-popover
              placement="left"
              width="150"
              trigger="hover">
            <el-image :src="require('/src/static/img/plate/'+scope.row.imgUrl)" style="height: 150px;width: 150px;"></el-image>
            <el-link type="primary" slot="reference" style="overflow: hidden">{{ scope.row.imgUrl }}</el-link>
          </el-popover>
          <el-popover
              placement="right"
              width="150"
              trigger="click">
            <el-upload
                :action="dialogImageUrl"
                list-type="picture-card"
                :data={plateId:scope.row.plateId}
                :limit=1
                :headers="header"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          <i class="el-icon-upload" slot="reference" style="cursor: pointer;font-size:18px;padding-left: 5px"/>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
          label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime|timeFilter}}
        </template>
      </el-table-column>
      <el-table-column
          prop="heatDegree"
          label="总热度">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name: "backstagePlateComponent",
  data(){
    return{
      plateList:[],
      dialogImageUrl: 'http://localhost:9527/api/admin/uploadPlateImg',
      dialogVisible: false,
      header:{
        token:localStorage.getItem("token")
      },
      edit:[],
      plateNameByEdit:[''],
    }
  },
  mounted() {
    this.getPlateList();
  },
  methods:{
    getPlateList(){
      this.$axios({
        method:"post",
        url:"/admin/getPlateList",
        headers:{
          token:localStorage.getItem("token")
        }
    }).then(res => {
      if(res.data.code === 200){
        this.plateList = res.data.data;
        this.edit = [];
        this.plateNameByEdit = [];
        for (let i = 0; i < this.plateList.length; i++) {
          this.edit.push(false);
          this.plateNameByEdit.push('');
        }
      }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    updatePlate(index,row){
      if(this.plateNameByEdit === null || this.plateNameByEdit.length < 0){
        this.$message.warning("请输入后重试")
      }else{
        this.$axios({
          method:'post',
          url:"/admin/updatePlate",
          params:{
            plateId:row.plateId,
            plateName:this.plateNameByEdit[index]
          },
          headers:{
            token:localStorage.getItem("token")
          }
        }).then(res => {
          if(res.data.code === 200){
            this.$message.success(res.data.msg)
            this.$set(this.edit,index,false);
            this.getPlateList();
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }

    },
    close(index){
      this.$set(this.edit,index,false);
      this.$set(this.plateNameByEdit,index,'')
    },
    editPlateName(index){
      this.$set(this.edit,index,true)
    }
  },
  filters:{
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