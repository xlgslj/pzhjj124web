import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true, // process.env.NODE_ENV !== 'production', 直接修改state 抛出异常
  state: {
    _login: false,
    _user: {},
    _token: '',
    _mymenus: [],
    _menus: [],
    _pcolor: '#1065A7',
    _predefineColors: [
      '#227447',
      '#c12c20',
      '#3b3f4e',
      '#2a5699',
      '#1065a7',
      '#0092a8',
      '#008B8B',
      '#d04626',
      '#435a69',
      '#A0522D',
      '#9932CC'
    ],
    _code: []
  },
  getters: {
    _user: state => state._user,
    _token: state => state._token,
    _login: state => state._login,
    _menus: state => state._menus,
    _mymenus: state => state._mymenus,
    _pcolor: state => state._pcolor,
    _predefineColors: state => state._predefineColors,
    _code: state => state._code
  },
  mutations: {
    // 只能同步的函数
    A_token (state, value) {
      state._token = value
    },
    A_login (state, value) {
      state._login = value
    },
    A_pcolor (state, value) {
      state._pcolor = value
    },
    A_menus (state, value) {
      state._menus = value
    },
    A_mymenus (state, value) {
      state._mymenus = value
    },
    A_user (state, value) {
      state._user = value
    },
    A_code (state, value) {
      state._code = value
    }
  },
  actions: {
    // 异步的函数
  }
})

export default store
