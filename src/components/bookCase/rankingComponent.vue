<template>
    <div id="bookCase">
        <el-row class="block" :gutter="2">
            <el-row :gutter="2">
                <el-divider content-position="left" class="">
                    最新排行
                    <el-tooltip placement="right" effect="light">
                        <div slot="content">
                            关联条件：创建时间
                        </div>
                        <i class="header-icon el-icon-warning-outline detailedStyle"></i>
                    </el-tooltip>
                </el-divider>
            </el-row>
            <el-row :gutter="22">
                <el-col :span="4" v-for="book,index in bookByNewOrder" :key="index" class="bookStyle">
                <img :src="require('@/static/img/book/' + book.imgUrl)" height="180px" width="120px" @click="toBook(book.bookId)"/>
                <el-tooltip :content = book.bookName placement="right" effect="light">
                <p class="bookNameStyle">《{{book.bookName}}》</p>
                </el-tooltip>
                <el-tooltip :content = book.author placement="right" effect="light">
                <p class="bookAuthorStyle">{{ book.author }}</p>
                </el-tooltip>
                </el-col>
            </el-row>
        </el-row>

        <el-row class="block" :gutter="2">
            <el-row :gutter="2">
                <el-divider content-position="left" class="">
                    最热排行
                    <el-tooltip placement="right" effect="light">
                        <div slot="content">
                            关联条件：热度
                        </div>
                        <i class="header-icon el-icon-warning-outline detailedStyle"></i>
                    </el-tooltip>
                </el-divider>
            </el-row>
            <el-row :gutter="22">
                <el-col :span="4" v-for="book,index in bookByHotOrder" :key="index" class="bookStyle">
                <img :src="require('@/static/img/book/' + book.imgUrl)" height="180px" width="120px" @click="toBook(book.bookId)"/>
                <el-tooltip :content = book.bookName placement="right" effect="light">
                <p class="bookNameStyle">《{{book.bookName}}》</p>
                </el-tooltip>
                <el-tooltip :content = book.author placement="right" effect="light">
                <p class="bookAuthorStyle">{{ book.author }}</p>
                </el-tooltip>
                </el-col>
            </el-row>
        </el-row>
        
        <el-row class="block" :gutter="2">
            <el-row :gutter="2">
                <el-divider content-position="left" class="">
                    喜欢排行
                    <el-tooltip placement="right" effect="light">
                        <div slot="content">
                            关联条件：喜欢人数
                        </div>
                        <i class="header-icon el-icon-warning-outline detailedStyle"></i>
                    </el-tooltip>
                </el-divider>
            </el-row>
            <el-row :gutter="22">
                <el-col :span="4" v-for="book,index in bookByLikeOrder" :key="index" class="bookStyle">
                <img :src="require('@/static/img/book/' + book.imgUrl)" height="180px" width="120px" @click="toBook(book.bookId)"/>
                <el-tooltip :content = book.bookName placement="right" effect="light">
                <p class="bookNameStyle">《{{book.bookName}}》</p>
                </el-tooltip>
                <el-tooltip :content = book.author placement="right" effect="light">
                <p class="bookAuthorStyle">{{ book.author }}</p>
                </el-tooltip>
                </el-col>
            </el-row>
        </el-row>

        <el-row class="block" :gutter="2">
            <el-row :gutter="2">
                <el-divider content-position="left" class="">
                    收藏排行
                    <el-tooltip placement="right" effect="light">
                        <div slot="content">
                            关联条件：收藏人数
                        </div>
                        <i class="header-icon el-icon-warning-outline detailedStyle"></i>
                    </el-tooltip>
                </el-divider>
            </el-row>
            <el-row :gutter="22">
                <el-col :span="4" v-for="book,index in bookByCollectionOrder" :key="index" class="bookStyle">
                <img :src="require('@/static/img/book/' + book.imgUrl)" height="180px" width="120px" @click="toBook(book.bookId)"/>
                <el-tooltip :content = book.bookName placement="right" effect="light">
                <p class="bookNameStyle">《{{book.bookName}}》</p>
                </el-tooltip>
                <el-tooltip :content = book.author placement="right" effect="light">
                <p class="bookAuthorStyle">{{ book.author }}</p>
                </el-tooltip>
                </el-col>
            </el-row>
        </el-row>

        <el-row class="block" :gutter="2">
            <el-row :gutter="2">
                <el-divider content-position="left" class="">
                    期待排行
                    <el-tooltip placement="right" effect="light">
                        <div slot="content">
                            关联条件：期待人数
                        </div>
                        <i class="header-icon el-icon-warning-outline detailedStyle"></i>
                    </el-tooltip>
                </el-divider>
            </el-row>
            <el-row :gutter="22">
                <el-col :span="4" v-for="book,index in bookByExpectOrder" :key="index" class="bookStyle">
                <img :src="require('@/static/img/book/'+ book.imgUrl)" height="180px" width="120px" @click="toBook(book.bookId)"/>
                <el-tooltip :content = book.bookName placement="right" effect="light">
                <p class="bookNameStyle">《{{book.bookName}}》</p>
                </el-tooltip>
                <el-tooltip :content = book.author placement="right" effect="light">
                <p class="bookAuthorStyle" style="margin-bottom:10px">{{ book.author }}</p>
                </el-tooltip>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            bookByNewOrder:[],
            bookByHotOrder:[],
            bookByLikeOrder:[],
            bookByCollectionOrder:[],
            bookByExpectOrder:[],  
        }
    },
    methods:{
        toBook(bookId) {
            this.$router.push({
                name: "book",
                params: { bookId: bookId }
            })
        },
        getBookByNewOrder(){
            this.$axios({
                method:"get",
                url:"/book/getBookByNewOrder",
                params:{}
            }).then(res => {
                if(res.data.code === 200){
                    this.bookByNewOrder = res.data.data;
                }
            }).catch(error => {
                console.log(error)
            })
        },
        getBookByHotOrder(){
            this.$axios({
                method:"get",
                url:"/book/getBookByHotOrder",
                params:{}
            }).then(res => {
                if(res.data.code === 200){
                    this.bookByHotOrder = res.data.data;
                }
            }).catch(error => {
                console.log(error)
            })
        },
        getBookByLikeOrder(){
            this.$axios({
                method:"get",
                url:"/book/getBookByLikeOrder",
                params:{}
            }).then(res => {
                if(res.data.code === 200){
                    this.bookByLikeOrder = res.data.data;
                }
            }).catch(error => {
                console.log(error)
            })
        },
        getBookByCollectionOrder(){
            this.$axios({
                method:"get",
                url:"/book/getBookByCollectionOrder",
                params:{}
            }).then(res => {
                if(res.data.code === 200){
                    this.bookByCollectionOrder = res.data.data;
                }
            }).catch(error => {
                console.log(error)
            })
        },
        getBookByExpectOrder(){
            this.$axios({
                method:"get",
                url:"/book/getBookByExpectOrder",
                params:{}
            }).then(res => {
                if(res.data.code === 200){
                    this.bookByExpectOrder = res.data.data;
                }
            }).catch(error => {
                console.log(error)
            })
        },
        init(){
            this.getBookByNewOrder();
            this.getBookByHotOrder();
            this.getBookByLikeOrder();
            this.getBookByCollectionOrder();
            this.getBookByExpectOrder();
        },
        
    },
    created(){
        this.init();
    },
}
</script>

<style scoped>
#bookCase{
    height: auto;
    width: 100%;
    background-color: white;
    border-radius: 10px;
}
p{
   margin: auto;
}
.block{
    /* height: 800px; */
    left: 2%;
    top: 10px;
    width: 96%;
    height: auto;
}
.bookStyle img{
    align-items: center;
    padding-left: 36px;
    cursor: pointer;
}
.bookStyle img:hover{
    transform: scale(1.05);
}
.el-divider__text.is-left {
    left: 20px;
    transform: translateY(-50%);
    font-weight: 900;
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
</style>