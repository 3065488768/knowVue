<template>
    <div id="content">
        <el-row id="criteria">
            <h4 style="text-align:center;">
                求索,探知
                <el-tooltip placement="right" effect="light">
                    <div slot="content">
                        填写您想要的资料的信息进行提交，管理员会第一时间帮您处理
                    </div>
                    <i class="header-icon el-icon-warning-outline detailedStyle" @mousemove="showDetailed"></i>
                </el-tooltip>
            </h4>
            <el-divider></el-divider>
            
            <el-row id="formStyle">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="书籍名称" prop="bookName">
                        <el-input v-model="form.bookName"></el-input>
                    </el-form-item>

                    <el-form-item label="作者名称" prop="author">
                        <el-input v-model="form.author"></el-input>
                    </el-form-item>

                    <el-form-item label="书籍类别" prop="bookType">
                      <el-select v-model="form.bookTypeId" filterable placeholder="请选择">
                        <el-option
                            v-for="(bookType,index) in bookTypes"
                            :key="index"
                            :label="bookType.bookTypeName"
                            :value="bookType.bookTypeId">
                        </el-option>
                      </el-select>
                    </el-form-item>

                  <el-form-item label="书籍备注">
                    <el-input type="textarea" placeholder="请输入内容" v-model="form.remark" maxlength="50" show-word-limit>
                    </el-input>
                  </el-form-item>

                    <el-form-item label="书籍封面">
                      <el-upload
                          class="upload-demo"
                          drag
                          ref="upload"
                          accept="jpg/png"
                          :limit="1"
                          :data="form"
                          :action="action"
                          :headers="headers"
                          :on-preview="handlePreview"
                          :on-exceed="handleExceed"
                          :on-success="handleSuccess"
                          :on-error="handleError"
                          :before-upload="beforeUpload"
                          :on-change="handleChange"
                          :file-list="imgList"
                          :auto-upload="false"
                          multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                      </el-upload>
                    </el-form-item>

<!--                    <el-form-item label="自动发帖">-->
<!--                        <el-switch v-model="form.postOrNot"></el-switch>-->
<!--                    </el-form-item>-->
                    <!-- 待添加帖子同步创建 -->
                    <div style="margin-top:28px"></div>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" style="margin-left:33%">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            
        </el-row>
    </div>
</template>

<script>
 export default {
    data() {
      return {
          form: {
              bookName: '',
              author: '',
              bookTypeId: "",
              postOrNot: true,
              isHaveMoney:false,
              Money:0,
              //备注
              remark:"",
          },
          rules: {
              bookName: [
                  { required: true, message: '请输入书籍名称', trigger: 'blur' },
                //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ],
              author: [
                  { required: true, message: '请输入作者名称,这样可以提高我们寻找书籍的效率', trigger: 'blur' }
              ],
          },
        bookTypes: '',
        imgList:[],
        action:this.$store.state.url + "/user/uploadImg",
        headers:{
          token:localStorage.getItem("token")
        }
      };
    },
    
    methods: {
      getBookType(){
        this.$axios({
          method:"get",
          url:"/book/getBookType"
        }).then(res => {
          if(res.data.code == 200){
            this.bookTypes = res.data.data;
          }else{
            this.$message.error("拉取书籍类型失败"+res.data.msg)
          }
        })
      },
      showDetailed(){

      },
      onSubmit(){
        if(this.checkForm() && this.imgList.length === 1){
          this.$refs.upload.submit();
          this.$message.success("创建成功");
        }else{
          this.$message.error("创建失败");
        }
      },
      handlePreview(file) {
        this.$message.warning("此文件已上传",file.name)
      },
      handleExceed(){
        this.$message.warning("您上传的文件已达到上限")
      },
      handleSuccess(response, file, fileList){
        this.$message.success(file.name+response.msg)
      },
      handleError(err, file, fileList){
        this.$message.error(file.name+response.data.msg)
      },
      beforeUpload(file,fileList){
        console.log("???")
      },
      handleChange(file,fileList){
          // 检验form是否符合要求
        if(this.checkForm()){
          let type = file.name.split(".").slice(-1)[0].toLowerCase()
          const isIMAGE = type === 'jpg' || type === 'png';
          console.log(isIMAGE)
          const isLt1M = file.size / 1024  < 500;
          if (!isIMAGE) {
            this.$message.error('上传文件只能是jpg/png格式!');
            this.$refs.upload.handleRemove(file,fileList);
          }else if (!isLt1M) {
            this.$message.error('上传文件大小不能超过 500kb!');
            this.$refs.upload.handleRemove(file,fileList);
          }
          return isIMAGE && isLt1M;
        }else{
          this.$message.error("抱歉您的文件不符合要求,请检查文件类型和必填项")
          this.$refs.upload.handleRemove(file,fileList);
        }
        return false;
      },
      checkForm(){
        let rule = this.form;
        if(rule.bookName != "" && rule.author != "" && rule.bookTypeClicked != ""){
          return true;
        }
        return false;
      }
    },
   mounted() {
      this.getBookType();
   }
 }
</script>

<style scoped>
#content {
  padding: 10px;
  min-height: 747px;
}
#criteria{
    height: auto;
    width: 100%;
}
#formStyle{
    position:relative;
    display: flex;
    left: 33%;
    width: 33%;
    justify-content: center;
    
}
.el-select {
    display: inline-block;
    position: relative;
    width: 100%;
}
</style>