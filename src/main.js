// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'normalize.css/normalize.css'
import 'babel-polyfill'
import myplugin from './plugin/initPlugin'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(myplugin)
/* eslint-disable no-new */
router().then(r=> {
  new Vue({
    el: '#app',
    router:r,
    store,  
    components: { App },
    template: '<App/>'
  })
}).catch(()=>{
})

