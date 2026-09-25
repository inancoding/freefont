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
    {
      path: '/creators',
      name: 'creators',
      component: () => import('../pages/Creators.vue'),
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('../pages/Download.vue'),
    },
    {
      path: '/submit',
      name: 'submit',
      component: () => import('../pages/Submit.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/About.vue'),
    },
  ],
});
