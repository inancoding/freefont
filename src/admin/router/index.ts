import { createRouter, createWebHistory } from 'vue-router';
import { getToken, isTokenExpired, setToken } from '../utils/api.ts';

const PUBLIC_PATHS = ['/login'];

export const router = createRouter({
  history: createWebHistory('/admin'),
  routes: [
    { path: '/', redirect: '/fonts' },
    { path: '/fonts', component: () => import('../pages/FontList.vue') },
    { path: '/licenses', component: () => import('../pages/LicenseList.vue') },
    { path: '/banners', component: () => import('../pages/BannerList.vue') },
    { path: '/resources', component: () => import('../pages/ResourceList.vue') },
    { path: '/login', component: () => import('../pages/Login.vue') },
  ],
});

router.beforeEach((to) => {
  if (PUBLIC_PATHS.includes(to.path)) return;
  if (!getToken() || isTokenExpired()) {
    setToken(null);
    return { path: '/login', query: { redirect: to.fullPath } };
  }
});
