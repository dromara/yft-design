import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

type RouteRecordRaw = typeof RouteRecordRaw
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/home",
    component: () => import("@/views/Home/index.vue"),
    meta: { 
      hidden: true,
      title: 'yft-home'
    },
  },
  {
    path: "/",
    name: "/",
    component: () => import("@/views/Editor/index.vue"),
    meta: { 
      title: 'yft-design'
    },
  },
  {
    path: "/401",
    component: () => import("@/views/Error/401.vue"),
    meta: { hidden: true },
  },
  {
    path: "/404",
    component: () => import("@/views/Error/404.vue"),
    meta: { hidden: true },
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeResolve((to: any, from: any, next: any) => {
  window.document.title = to.meta.title
  next()
})

/**
 * 重置路由
 */
export const resetRouter = () => {
  router.replace({ path: "/" });
}

export default router;
