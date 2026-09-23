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
      path: '/fonts',
      name: 'fonts',
      component: () => import('../pages/FontsList.vue'),
    },
    {
      path: '/fonts/:slug',
      name: 'font-detail',
      component: () => import('../pages/FontDetail.vue'),
    },
  ],
});
