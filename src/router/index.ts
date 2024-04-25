import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";


// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/home",
    component: () => import("@/views/Home/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    name: "/",
    component: () => import("@/views/Editor/computer.vue"),
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
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/" });
}

export default router;
