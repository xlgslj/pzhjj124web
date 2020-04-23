import Vue from 'vue'
import Router from 'vue-router'
import {call as axiosClient } from '../util/sys/axiosClient'
const index = () => import('@/view/index')
const main = () => import('@/view/main')
const home = () => import('@/view/home')

//const sys_config_menu = () => import('@/view/sys/config/menu')

Vue.use(Router)
const run = async () => {
  const base = [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      children: [
        {
          path: 'sub',
          name: 'sub',
          components: {
            home
          }
        }
      ]
    }
  ]  
  try {
    const menus = await axiosClient('/sys/getmenus', 'get', {})
    for(let m of menus.data) {
      if (m.view && m.viewpath) {
        try {
          base[1].children[0].components[m.view] = () => import(`@/view/${m.viewpath}`)
        } catch(e) {}
      }
    }
  } catch (e) {

  }
  let myrouter =  new Router({
    routes:base
  })
  myrouter.beforeEach((to, from, next) => {
    // console.log('from', from.name, 'to', to.name)
    if (to.name === 'index') {
      /* if (confirm('真的要退出系统吗?')) {
        router.app.$ws.clients.length = 0
        try {
          router.app.$ws.socket.close()
        } catch (e) {
  
        }
        next()
      } else {
        next(false)
      } */
      myrouter.app.$wss.clients.length = 0
      try {
        myrouter.app.$wss.socket.close()
      } catch (e) {
  
      }
      next()
    } else {
      next()
    }
  })
  return myrouter
}
export default  run



/*
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      children: [
        {
          path: 'sub',
          name: 'sub',
          components: {
            home,
            sys_config_menu:() => import('@/view/sys/config/menu')
          }
        }
      ]
    }
  ]
})
*/