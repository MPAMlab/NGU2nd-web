import Vue from 'vue'
import VueRouter from 'vue-router'
import post from '@/components/post.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/post',
    name: 'post',
    component: post
  }
]

// 创建路由实例
const router = new VueRouter({
  mode: 'history',
  routes
})

// 创建和挂载根实例
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')