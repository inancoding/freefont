import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/Home.vue'),
    },
    {
      path: '/fonts/:slug',
      name: 'font-detail',
      component: () => import('../pages/FontDetail.vue'),
    },
    {
      path: '/licenses',
      name: 'licenses',
      component: () => import('../pages/LicenseList.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/About.vue'),
    },
  ],
});
