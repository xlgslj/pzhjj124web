import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '../../store'

axios.defaults.baseURL = '/web'
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // console.log('req-token', store.state._token)
  // console.log('添加一个请求拦截器')
  config.headers.common['token'] = store.state._token
  return config
})

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  var token = response.headers.token
  console.log(response.data)
  if (token) {
    store.commit('A_token', token)
  }
  return response
  // return Promise.reject(error);
})

export const _axios = axios
export const _VueAxios = VueAxios
