<template>
  <div>
    <el-container >
      <el-aside id="leftNavigation"  ref="aside">
        <el-row  >
          <div id="navigationHead">
            导航
          </div>
          <el-menu
              :default-active="activeIndex"
              class="el-menu-vertical-demo"
              background-color="#343333"
              text-color="#fff"
              active-text-color="#ffd04b"
              @select="handleSelect"
              ref="menu">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <template slot="title">用户</template>
                <el-menu-item index="1-1" >信息管理</el-menu-item>
                <el-menu-item index="1-2">能力范围</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="权职">
                <el-menu-item index="1-3">角色管理</el-menu-item>
              </el-menu-item-group>
              <el-menu-item index="1-4">权力管理</el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-reading"></i>
                <span>书籍管理</span>
              </template>
              <el-menu-item-group>
                <template slot="title">书籍</template>
                <el-menu-item index="2-1">信息管理</el-menu-item>
<!--                <el-menu-item index="2-2">路径管理</el-menu-item>-->
              </el-menu-item-group>
              <el-menu-item-group title="类型">
                <el-menu-item index="2-3">书类管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-files"></i>
                <span>帖子管理</span>
              </template>
              <el-menu-item-group>
                <template slot="title">帖子</template>
                <el-menu-item index="3-1">信息管理</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="类型">
                <el-menu-item index="3-2">版块管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">系统设置</span>
            </el-menu-item>

<!--            <el-menu-item index="5">-->
<!--              <i class="el-icon-place"></i>-->
<!--              <span slot="title">娱乐至上</span>-->
<!--            </el-menu-item>-->

          </el-menu>

        </el-row>
      </el-aside>
      <el-container id="rightContent">
        <el-header style="background: #252424;color: white">
          <span id="headerImg">
            <img src="../assets/img/close.png" id="imgOfNavigation" ref="headerImg" @click="changeNavigationFlag">
          </span>
          <span id="headerContent">
              know后台管理系统
          </span>
          </el-header>
        <el-main style="background: white">
          <p style="margin-top: 0px">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="position: relative !important;">
              <el-breadcrumb-item  :to="{path:'/backstage/home'}" ><span @click="goHome">首页</span></el-breadcrumb-item>
              <el-breadcrumb-item v-if="crumbs.parent != ''">{{crumbs.parent}}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="crumbs.name != ''">{{ crumbs.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </p>

          <div id="content">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name:"backStage",
  data(){
    return{
      navigationFlag:true,
      crumbs:{
        parent:"",
        name:"",
      },
      activeIndex:""
    }
  },
  methods:{
    changeNavigationFlag(){
      if(this.navigationFlag){
        this.$refs.headerImg.src = require("../assets/img/open.png")
        this.$refs.aside.width = "0vh"
      }else{
        this.$refs.headerImg.src = require("../assets/img/close.png")
        this.$refs.aside.width = "300px"
      }
      this.navigationFlag = !this.navigationFlag;
    },
    handleSelect(key){
      switch (key){
        case "1-1":
          this.crumbs.parent = "用户管理";
          this.crumbs.name = "信息管理";
          this.$router.push("/backstage/user");
          break;
        case "1-2":
          this.crumbs.parent = "用户管理";
          this.crumbs.name = "能力范围";
          this.$router.push("/backstage/userRole");
          break;
        case "1-3":
          this.crumbs.parent = "用户管理";
          this.crumbs.name = "角色管理";
          this.$router.push("/backstage/role");
          break;
        case "1-4":
          this.crumbs.parent = "用户管理";
          this.crumbs.name = "权力管理";
          this.$router.push("/backstage/roleMenu");
          break;
        case "2-1":
          this.crumbs.parent = "书籍管理";
          this.crumbs.name = "信息管理";
          this.$router.push("/backstage/book");
          break;
        case "2-2":
          this.crumbs.parent = "书籍管理";
          this.crumbs.name = "路径管理";
          this.$router.push("/backstage/bookPath");
          break;
        case "2-3":
          this.crumbs.parent = "书籍管理";
          this.crumbs.name = "书类管理";
          this.$router.push("/backstage/bookType");
          break;
        case "3-1":
          this.crumbs.parent = "帖子管理";
          this.crumbs.name = "信息管理";
          this.$router.push("/backstage/post");
          break;
        case "3-2":
          this.crumbs.parent = "帖子管理";
          this.crumbs.name = "版块管理";
          this.$router.push("/backstage/plate");
          break;
        case "4":
          this.crumbs.parent = "设置";
          this.crumbs.name = "setting";
          this.$router.push("/backstage/setting");
          break;
        case "5":
          this.crumbs.parent = "娱乐";
          this.crumbs.name = "piano";
          this.$router.push("/backstage/piano");
      }
    },
    goHome(){
      this.crumbs = {parent:"", name:""};
      this.$router.push("/backstage/home");
      localStorage.setItem("activeIndex","")
      this.$refs.menu.activeIndex = ""
    },
    init(){

    }
  },
  mounted() {
    this.init();
  },
}
</script>

<style scoped>
#leftNavigation {
  height: 100vh;
  background: #343333;
  color: white;
  transition: width 1s;
  transition-timing-function:ease;
}

#navigationHead{
  background-color:rgb(37, 36, 36);
  height: 60px;
  font-size: 18px;
  text-align: center;
  line-height: 60px;
  border-right: ghostwhite solid 1px;
  border-bottom: #545c64 solid 1px;
  overflow: hidden;
  white-space: nowrap;
}

#imgOfNavigation{
  height: 30px;
  width: 30px;
  position: relative;
  top: 20%;
  cursor: pointer;
}

#headerContent{
  position: relative;
  padding-left: 10px;
  top: 5%;
  text-align: center;
}

#rightContent{
  width: 80vh;
  height: 100vh;
}

#content{
  height: 96%;
  width: 100%;
  /*background-color:aqua;*/
}

.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}
</style>