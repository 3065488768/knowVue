import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/know/home"
  },
  {
    path:"",
    redirect:"/know/home"
  },
  {
    path:'/login',
    name:'login',
    component:() => import('../views/login.vue')
  },
  {
    path:"/forget",
    name:"forget",
    component:() => import("../views/forget.vue")
  },
  {
    path: "/read",
    name: "read",
    component: () => import("../views/readBook.vue")
  },
  {
    path:"/release",
    name:"release",
    component:() => import("../views/release.vue")
  },
  {
    path:"/know",
    name:"know",
    redirect: "/know/home",
    component:() => import("../views/know.vue"),
    children:[
      {
        path:"/know/home",
        name:"home",
        component:() => import("../components/homeComponent.vue")
      },
      {
        path: "/know/book/:bookId",
        name: "book",
        component: () => import("../components/bookCase/bookComponent.vue")
      },
      {
        path: "/know/category",
        name: "category",
        component: () => import("../components/bookCase/categoryComponent.vue")
      },
      {
        path: "/know/help",
        name: "help",
        component: () => import("../components/bookCase/helpComponent.vue")
      },
      {
        path: "/know/ranking",
        name: "ranking",
        component: () => import("../components/bookCase/rankingComponent.vue")
      },
      {
        path: "/know/forum",
        name: "forum",
        component: () => import("../components/forumComponent.vue")
      },
      {
        path: "/know/personalData",
        name: "personalData",
        component: () => import("../components/personalDataComponent.vue")
      },
      {
        path: "/know/plate/:plateId",
        name: "plate",
        component: () => import("../components/plateComponent.vue")
      },
      {
        path: "/know/post/:postId",
        name: "post",
        component: () => import("../components/newPostComponent.vue")
      },
    ]
  },
  {
    path:"/backstage",
    name:"backstage",
    redirect: "/backstage/home",
    component: () => import("../views/backstage.vue"),
    children: [
      {
        path: "/backstage/home",
        name: "backstageHome",
        component: () => import("../components/backstageComponents/backstageHomeComponent.vue")
      },
      {
        path: "/backstage/user",
        name: "backstageUser",
        component: () => import("../components/backstageComponents/backstageUserComponent.vue")
      },
      {
        path: "/backstage/userRole",
        name: "backstageUserRole",
        component: () => import("../components/backstageComponents/backstageUserRoleComponent.vue")
      },
      {
        path: "/backstage/role",
        name: "backstageRole",
        component: () => import("../components/backstageComponents/backstageRoleComponent.vue")
      },
      {
        path: "/backstage/roleMenu",
        name: "backstageRoleMenu",
        component: () => import("../components/backstageComponents/backstageRoleMenuComponent.vue")
      },
      {
        path: "/backstage/book",
        name: "backstageBook",
        component: () => import("../components/backstageComponents/backstageBookComponent.vue")
      },
      {
        path: "/backstage/bookPath",
        name: "backstageBookPath",
        component: () => import("../components/backstageComponents/backstageBookPathComponent.vue")
      },
      {
        path: "/backstage/bookType",
        name: "backstageBookType",
        component: () => import("../components/backstageComponents/backstageBookTypeComponent.vue")
      },
      {
        path: "/backstage/post",
        name: "backstagePost",
        component: () => import("../components/backstageComponents/backstagePostComponent.vue")
      },
      {
        path: "/backstage/plate",
        name: "backstagePlate",
        component: () => import("../components/backstageComponents/backstagePlateComponent.vue")
      },
      {
        path:"/backstage/piano",
        name:"backstagePiano",
        component: () => import("../components/backstageComponents/piano.vue")
      },
      {
        path:"/backstage/setting",
        name:"setting",
        component: () => import("../components/backstageComponents/setting.vue")
      }
    ]
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/test.vue")
  }
]

const routerRePush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
  return routerRePush.call(this, location).catch(error => error)
}

const router = new VueRouter({
  mode:'history',
  routes,
  routerRePush
})

export default router

