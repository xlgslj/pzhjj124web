import { EventBus } from '../util/sys/event-bus'
import {mapState, mapMutations} from 'vuex'
import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
import '../assets/css/theme/index.css'

import dialogDrag from './dialogDrag'

import * as axiosClient from '../util/sys/axiosClient'
import * as axios from '../util/sys/axios'
import wss from '../util/sys/wssclient'
import * as tool from '../util/tools/tool'

let initPlugin = {}

initPlugin.install = function (Vue, options) {
    // 1. 添加全局方法或属性
    Vue.myGlobalMethod = function () {
      // 逻辑...
    }
  
    // 2. 添加全局资源
    //自定义指令
    Vue.directive('dialogDrag', dialogDrag)
  
    // 3. 注入组件选项
    Vue.mixin({
      computed: {
        ...mapState({
            _user: "_user",
            _token: "_token",
            _login: "_login",
            _menus: "_menus",
            _mymenus: "_mymenus",
            _pcolor: "_pcolor",
            _predefineColors: "_predefineColors",
            _code: "_code"
          }),
        codefilter () {
          return function(lx) {
            return this._code.filter(d => d.lx === lx)
          }
        },         
        code2cn () {
          return function(code, lx, all = true) {
            let i = this._code.findIndex(d => d.lx === lx && d.code === code)
            if (i > -1) {
              return all ? (code + ':' + this._code[i].val) : this._code[i].val
            } else {
              return code
            }
          }
        },         
        code2cn1 () {
          return function(code, lx, all = true) {
            let txt = ''
            let codes = code.split('')
            codes.map(dm => {
              let i = this._code.findIndex(d => d.lx === lx && d.code === dm)
              if (i > -1) {
                txt = txt + this._code[i].val
              }
            })
            return txt
          }
        },
        pagefun () {
          return function (funname) {
            let v = this._mymenus.filter(x => x.pid === parseInt(this.viewid) && x.view === funname)
            if (v.length) return v[0].id
            else return undefined
          }
        },
        dateformat () {
          return  function(datestr, fmt){
            if (datestr) {
              let dt = new Date(datestr)
              let o = {
                  "M+": dt.getMonth()+1,
                  "d+": dt.getDate(),
                  "H+": dt.getHours(),
                  "m+": dt.getMinutes(),
                  "s+": dt.getSeconds(),
                  "S+": dt.getMilliseconds()
              };
              //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
              if(/(y+)/.test(fmt)){
                  //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
                  fmt=fmt.replace(RegExp.$1,(dt.getFullYear()+"").substr(4-RegExp.$1.length));
              }
              for(var k in o){
                  if (new RegExp("(" + k +")").test(fmt)){
                      //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
                      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
                  }
              }
              return fmt;
            } else {
              return ''
            }
          }
        }       
      },
      methods: {
        ...mapMutations([
          'A_login',
          'A_menus',
          'A_mymenus',
          'A_token',
          'A_user',
          'A_code'
        ])
      }   
    })
  
    // 4. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {
      // 逻辑...
    }
    Vue.prototype.$tool = tool
    Vue.prototype.$wss = new wss()
    Vue.prototype.$EventBus = EventBus
    Vue.prototype.$axiosClient = axiosClient
    Vue.prototype.$axios = axios

    Vue.use(axios._VueAxios, axios._axios) 
    Vue.use(ElementUI)
  }

  export default initPlugin