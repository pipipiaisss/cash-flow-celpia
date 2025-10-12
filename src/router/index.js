import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import ReportView from '../views/ReportView.vue';
import InputDataView from '../views/InputDataView.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard' // Set dashboard as the default page
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/report',
    name: 'Report',
    component: ReportView,
  },
  {
    path: '/input',
    name: 'InputData',
    component: InputDataView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
