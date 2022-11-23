import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //history:createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/usercenter",
      name: "usercenter",
      component: () => import("@/views/userCenter.vue"),
    },
    // 所有不存在的路由都走404
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: HomeView,
    },
  ],
});

export default router;
