<template>
    <div id="content">
        <el-row id="criteria">
          <h4 style="text-align:center;">知著论坛图书库</h4>
          <el-link type="primary" class="solicitationBook" @click="solicitationRequest">赚取书币</el-link>
          <el-dialog
              title="进行书籍文件的上传，赚取书币!"
              :visible.sync="solicitationFormVisible"
              width="30%"
              center>
            <el-row>
              <!--选择上传的书籍名称-->
              <div style="position: relative;left: 14%">
                <div style="padding-bottom: 20px">书籍名称：</div>
                <el-select v-model="bookData.bookId"  placeholder="请选择" style="width: 360px">
                  <el-option
                      v-for="(book,index) in missBook"
                      :key="index"
                      :label="book.bookName"
                      :value="book.bookId">
                  </el-option>
                </el-select>
                <div style="margin-top:20px">
                  pdf文件
                </div>
                <div style="margin-top:20px;">
                  <!--上传文件-->
                  <div>
                    <el-upload
                        class="upload-demo"
                        drag
                        ref="upload"
                        accept="application/pdf"
                        :limit="1"
                        :data="bookData"
                        :action="action"
                        :headers="headers"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-exceed="handleExceed"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :before-upload="beforeUpload"
                        :on-change="handleChange"
                        :file-list="fileList"
                        :auto-upload="false"
                        multiple>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                      <div class="el-upload__tip" slot="tip">只能上传application/pdf文件，且不超过100mb</div>
                    </el-upload>
                  </div>
                </div>
              </div>
            </el-row>

            <span slot="footer" class="dialog-footer">
              <el-button @click="solicitationFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="uploadBook">提 交</el-button>
            </span>
          </el-dialog>
          <el-divider></el-divider>
          <el-col class="criteria">
            <el-row :span="9">
              <el-col :span="1">
                <div class="criteriaTitle">
                  类别 <img src="../../assets/img/arrowOfRight.png" height="12px" width="12px"/>
                </div>
              </el-col>
              <el-col :span="23">
                <el-col :span="2" v-for="(bookType,index) in bookTypes" :key="index">
                  <div :class="bookTypeClass === index?'typeClicked':''" class="typeDiv" @click="typeClick(index)">{{ bookType.bookTypeName }}</div>
                </el-col>
              </el-col>
            </el-row>

            <div style="margin-top:10px"></div>
            <el-row :span="9">
              <el-col :span="1">
                <div class="criteriaTitle">
                  状态 <img src="../../assets/img/arrowOfRight.png" height="12px" width="12px"/>
                </div>
              </el-col>
              <el-col :span="23">
                <el-col :span="2">
                  <div class="typeDiv" :class="statusClass === 0?'typeClicked':''" @click="statusClick(0)">正常</div>
                </el-col>
                <el-col :span="2">
                  <div class="typeDiv" :class="statusClass === 1?'typeClicked':''"  @click="statusClick(1)">筹措中</div>
                </el-col>
              </el-col>
            </el-row>

            <div style="margin-top:10px"></div>
            <el-row :span="9">
              <el-col :span="1">
                <div class="criteriaTitle">
                  排序 <img src="../../assets/img/arrowOfRight.png" height="12px" width="12px"/>
                </div>
              </el-col>
              <el-col :span="23">
                <el-col :span="2">
                  <div :class="orderClass === 0?'typeClicked':''" class="typeDiv"  @click="orderClick(0)">默认</div>
                </el-col>
                <el-col :span="2">
                  <div :class="orderClass === 1?'typeClicked':''" class="typeDiv"  @click="orderClick(1)">最新</div>
                </el-col>
                <el-col :span="2">
                  <div :class="orderClass === 2?'typeClicked':''" class="typeDiv"  @click="orderClick(2)">最热</div>
                </el-col>
              </el-col>
            </el-row>

            <div style="margin-top:10px"></div>
            <el-row :span="9">
              <el-col :span="1">
                <div class="criteriaTitle" style="padding-top:10px">
                  时间 <img src="../../assets/img/arrowOfRight.png" height="12px" width="12px"/>
                </div>
              </el-col>
              <el-col :span="23">
                <el-date-picker
                    v-model="dateTime"
                    type="date range"
                    align="center"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :editable = false>
                </el-date-picker>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row :gutter="22" v-loading="loading" style="height:800px;">
          <el-col :span="4" v-for="(book,index) in bookByScreen" :key="index" class="bookStyle">
            <img :src="require('@/static/img/book/'+book.imgUrl)" height="180px" width="120px" @click="toBook(book.bookId)"/>
            <el-tooltip :content = book.bookName placement="right" effect="light">
              <p class="bookNameStyle" @click="toBook(book.bookId)">《{{book.bookName}}》</p>
            </el-tooltip>
            <el-tooltip :content = book.author placement="right" effect="light">
              <p class="bookAuthorStyle">{{ book.author }}</p>
            </el-tooltip>
          </el-col>
          <el-empty :image-size="200" v-show="total === 0"></el-empty>
        </el-row>
        <div style="margin-top:20px;"></div>
        <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="18"
        :hide-on-single-page="false"
        @current-change="handleCurrentChange"
        style="margin-left: 40%;">
        </el-pagination>
    </div>
</template>

<script>

   export default{
    data(){
        return{
          bookTypes:[{bookTypeId:0,bookTypeName:"全部"}],
          dateTime:[],
          bookByScreen:[],
          bookTypeClass:0,
          statusClass:0,
          orderClass:0,
          loading:false,
          total:0,
          pageOfNow:1,
          solicitationFormVisible:false,
          missBook:[
            {
              bookId:'1',
              bookName:'理想国'
            }
          ],
          bookData:{
            bookId:""
          },
          fileList:[],
          action:this.$store.state.url + "/user/uploadBook",
          headers:{
            token:localStorage.getItem("token")
          }
        }
    },
    methods:{
      toBook(bookId) {
        this.$router.push({
          name: "book",
          params: { bookId: bookId }
        })
      },
      typeClick(index){
        this.bookTypeClass = index;
        this.getBook();
      },
      statusClick(number){
        this.statusClass = number;
        this.getBook();
      },
      orderClick(number){
        this.orderClass = number;
        this.getBook();
      },
      getPlate(){
        this.$axios({
          method:"get",
          url:"/book/getBookType",
          params:{

          }
        }).then(res => {
          this.loading = false;
          if(res.data.code === 200){
            let bookType = res.data.data;
            for(let i = 0;i<bookType.length;i++){
              this.bookTypes.push(res.data.data[i])
            }
          }
        }).catch(error => {
          console.error(error);
        })
      },
      getBook(){
        this.loading = true;
        let start = this.dateTime[0];
        let end = this.dateTime[1];
        if(start != null && start != undefined && start != null && end != undefined){
          console.log(start + " " + end)
          start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
          end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
        }else{
          start = "";end="";
        }
        this.$axios({
          method:"get",
          url:"/book/getBookByCondition",
          params:{
            bookType:this.bookTypes[this.bookTypeClass].bookTypeId,
            status:this.statusClass===0?'0':'2',
            order:this.orderClass,
            startTime:start,
            endTime:end,
            startPage:this.pageOfNow
          }
        }).then(res => {
          this.loading = false;
          if(res.data.code === 200){
            this.total = res.data.data.size;
            this.bookByScreen = res.data.data.books;
          }
        }).catch(error => {
          console.error(error);
        })
      },
      handleCurrentChange(val){
        this.pageOfNow = val
        document.documentElement.scrollTop = 0;
        this.getBook();
      },
      solicitationRequest(){
        this.$axios({
          method:"get",
          url:"/book/getBookByCondition",
          params:{
            bookType:'0',
            status:'2',
            order:'2',
            startTime:'',
            endTime:'end',
            startPage:-1
          }
        }).then(res => {
          if(res.data.code == 200){
            this.missBook = res.data.data.books;
            this.solicitationFormVisible = true;
          }else{
            this.$message.error("拉取书单失败")
          }
        })
      },
      uploadBook(){
        // 上传图书
        if(this.fileList.length === 1 && this.bookData.bookId != 0){
          this.$refs.upload.submit();
          this.bookData.bookId = "";
          this.fileList = "";
          this.solicitationFormVisible = false
        }else{
           this.$message.error("请先填写内容并上传文件")
        }
      },
      handleRemove(file, fileList) {
        // this.$message.warning(fileList.name+"已删除")
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

      },
       handleChange(file,fileList){
        if(this.bookData.bookId != "" && this.bookData.bookId != undefined){
          let type = file.name.split(".").slice(-1)[0].toLowerCase()
          const isIMAGE = type === 'pdf';
          const isLt1M = file.size / 1024 / 1024 < 100;
          if (!isIMAGE) {
            this.$message.error('上传文件只能是pdf格式!');
            this.$refs.upload.handleRemove(file,fileList);
          }
          if (!isLt1M) {
            this.$message.error('上传文件大小不能超过 100MB!');
            this.$refs.upload.handleRemove(file,fileList);
          }
          return isIMAGE && isLt1M;
        }else{
          console.log(this.bookData.bookId)
          this.$message.error("请先选择书籍再尝试上传")
          this.$refs.upload.handleRemove(file,fileList);
        }
      },
      init(){
        this.getPlate();
        this.getBook();
      }
    },
    created(){
        this.init();
    },
    watch:{
        dateTime(newValue){
            this.dateTime = newValue == null ? [] : newValue;
            this.getBook();
        }
    }
   }
</script>

<style scoped>
#content{
    padding: 10px;
}
#criteria{
    height: autho;
    width:100%;
}

p{
    margin: 0;
}
.criteriaTitleStyle{
    font-weight: 500px;
}
.typeDiv{
    background-color:white;
    height:30px;
    /* width:60px; */
    margin-left: 0px;
    margin-right: 20px;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: center;
    line-height: 30px; 
    color: black;
    font-size: 14px;
    cursor: pointer;
}
/* .typeNotClick{
   
} */
.typeDiv:hover{
    color: red;
}
.typeClicked{
    background-color: rgba(244, 202, 197, 0.978);
    color: red;
    font-weight: 500;
}
.criteriaTitle{
    padding-top:5px;
    font-size:14px;
    font-weight: 700;
}
.bookStyle img{
    align-items: center;
    padding-left: 36px;
    cursor: pointer;
}
.bookStyle img:hover{
    transform: scale(1.05);
}
.bookNameStyle{
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(65, 164, 217);
    padding-top: 10px;
    padding-bottom: 8px;
}
.bookNameStyle:hover{
    color: blueviolet;
    text-decoration: double;
}
.bookAuthorStyle{
    text-align: center;
    font-size: 12px;
    padding-bottom: 10px;
}
.solicitationBook{
    position: absolute;
    right: 5px;
    font-size: 14px;
    top: 40px;
    cursor: pointer;
}
</style>