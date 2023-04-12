<template>
    <div>
    <div id="plateStyle">
        <el-page-header @back="goBack" content="板块详情"></el-page-header>
        <el-row id="plateHead">
            <el-col :span="4">
                <el-image style="width: 150px; height: 150px;" :src="src" fit="fill"></el-image>
                <!-- <img style="width: 150px; height: 150px;" src="../static/img/plate/plate_1.jpg"/> -->
            </el-col>
            <el-col :span="20">
                <el-descriptions title="板块信息">
                    <el-descriptions-item label="名称">{{ plate.plateName }}</el-descriptions-item>
                    <el-descriptions-item label="创建人">{{ createBy }}</el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ plate.createTime }}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag size="small">{{ plate.status == 0 ? "正常":"异常" }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="帖子数量">{{ postNumber }}</el-descriptions-item>
                    <el-descriptions-item label="管理员">{{ createBy }}</el-descriptions-item>
                    <el-descriptions-item label="备注">
                        <p id="plateRemark">
                            {{ plate.remark == "" ? "管理员很懒,没留下任何信息" : plate.remark}}
                        </p>
                       
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
        </el-row>
    </div>
    <div style="height:20px;background-color:#f3f3f3;"></div>
    <el-row class="postInPlate">
        <el-row style="margin:10px;height: 50px;">
            <el-select v-model="bookTypeId" placeholder="请选择关联的书籍类型">
                <el-option v-for="(bookType,index) in bookTypeList" :key="index" :label="bookType.bookTypeName" :value="bookType.bookTypeId"></el-option>
            </el-select>
        </el-row> 
        <el-row class="postInPlateStyle" v-for="(post,index) in postByBookTypeId" :key="index">
          {{ post.postTitle }}
        </el-row>
        <el-empty :image-size="200" v-show="postByBookTypeId.length === 0"></el-empty>
    </el-row>
    </div>
</template>

<script>
 export default{
    data(){
        return{
            src:require("../static/img/plate/plate_1.jpg"),
            createBy:"",
            postNumber:0,
            plateId: this.$route.params.plateId,
            plate:{},
            bookTypeList:[],
            bookTypeId:"",
            postByBookTypeId: [],
            start:0,
            number:5,
        }
    },
    methods:{
        goBack(){
            this.$router.go(-1);
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        getPlateById(){
            this.$axios({
                url:"/forum/getPlateById/" + this.plateId,
                method:"get"
            }).then(res => {
                if(res.data.code === 200){
                    this.plate = res.data.data.plate;
                    this.postNumber = res.data.data.postNumber;
                    this.createBy = res.data.data.createBy;
                    this.bookTypeList = res.data.data.bookTypeList;
                }
            })
        },
        getPostByType(){
            this.$axios({
                url: "/forum/getPostByBookTypeId",
                method: "post",
                params:{
                    bookTypeId:this.bookTypeId,
                    start:this.start,
                    number:this.number
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.postByBookTypeId = res.data.data;
                    console.log(this.postByBookTypeId)
                }
            })
        },
        getPostByPlate(){
            this.$axios({
                method: "get",
                url: "/forum/getPostByPlate",
                params: {
                    plateId: this.plateId,
                    start:this.start,
                    number:this.number
                }
            }).then(res => {
                if(res.data.code === 200){
                    this.postByBookTypeId = res.data.data;
                }
            }).catch(error => {
                console.log(error)
            })
        }
    },
    mounted(){
        this.getPlateById();
        this.getPostByPlate();
    },
    created(){

    },
    watch:{
        bookTypeId(newValue,oldValue){
            this.getPostByType();
        }
    }
}
</script>

<style scoped>
#plateStyle {
    padding: 10px;
}
p{
    margin: 0px;
}
#plateHead{
    padding-top:30px;
    padding-left: 10px;
    height:250px;
    width:100%;
    background-color: white;
}
#plateRemark{
    height: 100px;
    overflow: hidden;
    overflow-wrap: unset;
    width:80%;
}
.postInPlate{
    min-height:600px;
}
.postInPlateStyle{
    height:100px;
    padding: 5px;
    margin: 10px;
    border-radius: 5px;
    border: #E4E7ED 1px solid;
}
.postInPlateStyle:hover{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>