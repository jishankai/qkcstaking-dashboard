import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/create',
    name: 'create',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateView.vue')
  },
  {
    path: '/contracts',
    name: 'contracts',
    component: () => import(/* webpackChunkName: "about" */ '../views/ContractsView.vue')
  },
  {
    path: '/contract/:address',
    name: 'contract',
    component: () => import(/* webpackChunkName: "about" */ '../views/ContractView.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
