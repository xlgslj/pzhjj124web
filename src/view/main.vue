<template>
<el-container>
  <el-header style="background: #f1f1f1;padding:0;z-index:1;" :style="{'height':(1===2?'119px':'51px')}">
    <el-row  style="height: 51px;border-bottom: solid 1px #d5d5d5;box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19);color:#ffffff;z-index:9999"  :style="{'background-color':_pcolor}">
        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
            <span class="logo" id="logo"><img src="../assets/img/logo.png"></span>
            <ul class="nav">
                <li v-for="item in menus1" :key="item.id"><a href="#" :class="{selected:(menus1Sid === item.id)}" :style="{'color':(menus1Sid === item.id ?_pcolor:'#ffffff')}" @click="menu1Click(item.id)">{{item.name}}</a></li>
            </ul>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" style="display:flex; justify-content:flex-end;margin-top:20px;line-height:28px;">
            <div style="margin-right:5px;">{{_user.dwmc}}</div>
            <div  class="user">
              <el-popover
                placement="top-start"
                width="50"
                trigger="hover"
              >
                <ul class="userlist" style="padding: 0px;margin:0px;">
                    <li><a href="#"><i class="el-icon-info" style="font-size:18px;margin-right:10px;"></i>用户信息</a></li>
                    <li><a href="#" @click="coms.mmxg.visable=true"><i class="el-icon-lock" style="font-size:18px;margin-right:10px;"></i>修改密码</a></li>
                    <li><a href="#" @click="logout"><i class="el-icon-switch-button" style="font-size:18px;margin-right:10px;"></i>退出</a></li>
                </ul>
                <span slot="reference"><a href="#" style="color:#fff"><i class="el-icon-user" style="font-size:18px;"></i>{{_user.name}}</a></span>
              </el-popover>
            </div>
            <div  style="margin-right:25px;">
              <online></online>
            </div>
        </el-col>
    </el-row>
  </el-header>
  <el-container class="content">
    <el-aside class="aside" :style="{'width':isCollapse?'85px':'250px'}">
      <el-menu  default-active="0-0" class="el-menu-vertical-demo left-menu" :collapse="isCollapse">
           <div style="text-align:center; position: relative;">
              <el-tooltip class="item" effect="dark" content="收缩/展开" placement="bottom-start">
                <a href="#"  style="font-size:20px;">
                  <i v-if="isCollapse" class="el-icon-s-unfold"  @click="showmenu(false)"></i>
                  <i v-else class="el-icon-s-fold"  @click="showmenu(true)"></i>
                </a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="关闭所有打开页面" placement="bottom-start">
                <a href="#" style="position:absolute;right:1px;color:red;font-size:20px;" @click="closeall">
                  <i class="el-icon-s-release" @click="showmenu(false)"></i>
                </a>
              </el-tooltip>
          </div>
          <template v-if="menus2['children']">
            <template v-for="(item,index) in menus2.children">
              <el-menu-item   v-if="item.lb ==='页面'"  :index="index+''"  :key="item.id" style="font-size:1rem;"  @click="addTab(item.id, {})">
                <i class="el-icon-caret-right"></i>
                {{item.name}}
              </el-menu-item>
              <el-submenu :index="index+''" v-else  :key="item.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                  <template v-if="item.children">
                    <template v-for="(item1,index1) in item.children">
                      <el-menu-item  v-if="item1.pid===item.id"  :key="item1.id" :index="index+'-'+index1" style="font-size:1rem;"  @click="addTab(item1.id, {})">
                        <i class="el-icon-caret-right"></i>
                        {{item1.name}}
                      </el-menu-item>
                    </template>
                  </template>
              </el-submenu>          
            </template>
          </template>
        <el-menu-item :index="((menus2.children?(menus2.children.length+1):1)+'')">
          <i class="el-icon-menu"></i>
          <span slot="title">快捷导航</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main :style="{'padding':isCollapse?0:'0 0 0 15px'}">
        <el-tabs v-model="editableTabsValue"  closable @tab-remove="removeTab">
          <el-tab-pane
              v-for="(item) in editableTabs"
              :key="item.id"
              :label="item.title"
              :name="item.id"
          >
          <span slot="label"><i class="el-icon-tickets"></i> {{item.title}}</span>
          <router-view :viewid="item.id" :name="item.name" :initdata="item.initdata" style="color:red;"/>
          </el-tab-pane>
        </el-tabs>
        <my-pwd :user="_user" :visible="coms.mmxg.visable" @hide="coms.mmxg.visable=false"></my-pwd>
        <my-retask :indata="coms.retask.data" v-if="coms.retask.visable" @hide="coms.retask.visable=false"></my-retask>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import online from '../components/online'
import pwd from '../components/pwdEdit'
import retask from '../components/retask'
import * as tool from '../util/tools/tool'
export default {
    components: {
        'my-pwd': pwd,
        'online': online,
        'my-retask': retask
    },
    data: () => {
        return {
            menus1Sid: null,
            isCollapse: false,
            editableTabsValue: '0000000000',
            editableTabs: [{
                id: '0000000000',
                title: '首页',
                name: 'home',
                initdata: {
                }
            }],
            coms: {
              mmxg: {
                visable: false
              },
              retask: {
                visable: false,
                data: {
                  title: '未命名'
                }
              }
            }
        }
    },
    computed: {
        menus1 () {
          let v = tool.getTree(this._mymenus, 1, 'id', 'name')
          this.menus1Sid = v.length > 0 ? v[0].id : 0
          return v;
        },
        menus2 () {
          return this.menus1.find(x => x.id === this.menus1Sid)
        }
    },
    watch: {},
    created () {
      this.getallmenus()
    },
    beforeMount () {
      this.$wss.clients.push((data) => {
        switch(data.event) {
          case 'logon':
            this.$notify.info({
              title: '提示',
              message: data.name + '上线',
              duration: 3000,
              position: 'bottom-right',
              type: 'success'
            })
            break;
          case 'updateusers': 
            break;
          case 'newtask': 
            this.$notify.info({
              title: '新任务',
              message: `${data.task.fromname} 向您指派新任务 [${data.task.name}]`,
              duration: 3000,
              position: 'bottom-right',
              type: 'success'
            })
            break;
          default:
            break;                      
        }
      })
    },
    mounted () {
      if (this.menus1.length > 0) {
        this.$router.replace({name: 'sub'})
      } else {
        this.$router.replace({name: 'index'})
      }
      this.$EventBus.$on('main', this.Ehandle)
    },
    methods: {
        menu1Click (id) {
          this.menus1Sid = id
        },
        addTab (id, initdata) {
          console.log('addtab',id)
          let t = this.editableTabs.find(item => {
            return item.id === `${id}`
          })
          if (t) {
            t.initdata = initdata
            this.editableTabsValue = `${t.id}`
            return
          }
          let o = this._menus.find(item => {
            return item.id === id
          })
          if (o) {
            this.editableTabs.push({
              id: `${o.id}`,
              title: o.name,
              name: o.view,
              initdata: initdata
            })
            this.editableTabsValue = `${o.id}`
          } else {
            this.$message('不能打开页面,你或许没有权限,请与管理员联系')        
          }
        },
        removeTab (targetName) {
          if (targetName === '0000000000') {
            this.$message('本页不能删除')
            return
          }
          let tabs = this.editableTabs
          let activeName = this.editableTabsValue
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.id === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                  activeName = nextTab.id
                }
              }
            })
          }
          this.editableTabsValue = activeName
          this.editableTabs = tabs.filter(tab => tab.id !== targetName)
        },
        showmenu (f) {
          this.isCollapse = f
        },
        closeall () {
          this.editableTabsValue = '0000000000'
          this.editableTabs.splice(1)
        },
        logout () {
          this.$router.replace({name: 'index'})
        },
        getallmenus () {

          this.$axiosClient.call('sysmanage/config/menu/get', 'get', {})
            .then(res => {
              if (res.status) {
                this.A_menus(res.data)
              } else {
                this.$message(res.err || res.msg)
              }
            })
            .catch(err => {
              this.$message(err)
            })   
        },
        Ehandle (e) {
          switch(e.key) {
            case 'opennew' :
              this.addTab(e.id, e.initdata || {})
              break;
            case 'closeview' :
              this.removeTab(e.id)
              break;
            case 'retask' :
              this.coms.retask.visable = true
              this.coms.retask.data = e.data
              break;
            default:
              break;
          }
        }
    },
    beforeDestroy () {
      console.log('事件被移出')
      this.$EventBus.$off('main', this.Ehandle)
    },
    destroyed () {
      console.log('定时器关闭')
      //clearInterval(this.mytimer)
    }
}
</script>

<style scoped>
  .userlist>li {
    margin-top: 10px;
  }

</style>
<style>
  body {
    font-size: 1rem;
  }
  li {
    list-style-type:none;
  }
  a {
    text-decoration: none;
  }
  p, li, input, select, textarea, a,.el-form-item__label,.el-table,span {
      font-size:1rem;
  }
  td,table .el-button--mini,table .el-button--small,table .el-button,.el-button  {
    font-size: 1rem;
  }
   .el-tabs__item,.el-submenu__title,.el-menu-item,.el-radio__label,.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 1rem;
  }
  .el-table thead {
    color: #42464e;
    font-weight: 500;
  }
  /****** */
  .headdown{padding-left:12px; height:68px;border-bottom:solid 1px #d5d5d5;}
  .logo{display:block; margin-left:27px; padding-top:10px; float:left; cursor:pointer;}
  .nav{float:left; margin-top:25px;margin-left:10px;}
  .nav li{float:left; margin-right:3px;}
  .nav li a{display:block;color:#fff; height:26px;padding:0 15px; line-height:23px;}
  .nav li a:hover{background: url(../assets/img/navbg.png);}
  .nav li a.selected{background:#f1f1f1;}
  .nav li a.selected:hover{background:#f1f1f1;}
  .menu{margin-top:4px; border-right:solid 1px #d2d2d2;float:left; padding:0 5px;}
  .menu li{float:left;}
  .menu li a{color:#2e2e2e; display:block; padding:0 10px; height:56px; padding-top:4px;}
  .menu li a:hover{background:#c4c4c4;}
  .menu li i{display:block; clear:both; text-align:center;}

   .user{margin-right: 10px;}
  .userlist li a{display:block; color:#000; height:25px; line-height:25px; background:none;margin-top:0;padding-right:15px;}
  .userlist li a:hover{background:#CCC;color:#000;}

  .content,.aside,.left-menu {
      height:calc(100vh - 51px);
  }
  .el-tabs__header {
    margin: 0;
  }
  iframe {
    border-width: 0px;
    width:100%;
    height:calc(100vh - 95px);
  }

  .el-form-item {
      margin-bottom: 10px;
  }
  /*  dialog */
  .el-dialog.mydialog{
    -webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);
    box-shadow: 0 5px 15px rgba(0,0,0,.5);
    border-radius: 6px;
  }
  .el-dialog.mydialog .el-dialog__title{
    font-size: 1rem;
  }
  .el-dialog.mydialog .el-dialog__header {
    padding: 0 80px 0 20px;
    height: 42px;
    line-height: 42px;
    border-bottom: 1px solid #eee;
    color: #333;
    overflow: hidden;
    background-color: #8080801c;
    border-radius: 2px 2px 0 0;
    font-family: '微软雅黑';
  }
  .el-dialog.mydialog .el-dialog__body {
    padding: 10px 5px 5px 5px
  }
  .el-dialog .el-form-item{
    margin-bottom: 10px;

  }
  .el-dialog__headerbtn{
    top: 15px;
    font-size: 20px;
    font-weight: 700;
  }
  .el-dialog__wrapper,.v-modal {
    top: 91px;
  }
</style>