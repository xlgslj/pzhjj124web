<template>
  <div
    v-loading.lock="loading"
    element-loading-text="处理中"
    element-loading-spinner="el-icon-loading"    
    style="margin-top:10px;">
    <el-row style="padding-right:10px;">
        <el-col :span="24">
            <el-form :model="user"  label-suffix=":" :rules="rules" ref="ruleForm"  status-icon  label-width="6rem" size="mini"   class="demo-ruleForm">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="单位" prop="ZZJGDM">
                            <TreeSelect
                             :defaultProps="{children: 'children',label: 'label'}" 
                             :treedata="units"
                             v-model="user.dwid"
                             keyword="key"
                             >
                             </TreeSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户类型" prop="ZDDXLX">
                            <el-select v-model="user.type" placeholder="请选择"  clearable>
                                <el-option
                                v-for="item in codefilter('userlx')"
                                :key="item.code"
                                :label="item.code+': '+ item.val"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="姓名" prop="DWMC">
                            <el-input v-model="user.name"  placeholder="姓名"  clearable ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="登录名" prop="DWMC">
                            <el-input v-model="user.uid"  placeholder="登录名"  clearable ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="状态" prop="DWMC">
                            <el-radio-group v-model="user.state">
                                <el-radio label="启用">启用</el-radio>
                                <el-radio label="未启用">未启用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="权限类型" prop="DWMC">
                            <el-radio-group v-model="user.qxlx">
                                <el-radio label="角色权限">角色权限</el-radio>
                                <el-radio label="独立权限">独立权限</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="指派任务" prop="DWMC">
                            <el-radio-group v-model="user.retask">
                                <el-radio label="不指派任务">不能</el-radio>
                                <el-radio label="可指派任务">能</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item >
                            <el-button type="primary"  icon="el-icon-successh" @click="save('ruleForm')">新增</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-col>
    </el-row>
    <el-divider content-position="center">选择{{user.qxlx==='独立权限'?'权限':'角色'}}</el-divider>   
    <el-row v-show="user.qxlx==='独立权限'">
        <el-col :span="12">
            <el-row style="margin-bottom:10px;">
                <el-tag style="color:#00868B;background-color:rgba(0,134,139,0.4)" size="mini">菜单</el-tag>
                <el-tag style="color:#1874CD;background-color:rgba(24,116,205,0.4)" size="mini">页面</el-tag>
                <el-tag style="color:#CD00CD;background-color:rgba(205,0,205,0.4)" size="mini">功能</el-tag>
                <el-button @click="resetChecked" size="mini">清空</el-button>                
            </el-row>
            <el-row>
                <el-tree  ref="tree" node-key="id" :data="menus" :props="{children: 'children',label: 'label'}" show-checkbox>
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span :style="{color: data.lb ==='菜单'? '#00868B':(data.lb === '页面' ? '#1874CD' : '#CD00CD')}">{{(data.pid === 1 && data.isapp == '是') ? `${node.label}(app)` : node.label  }}</span>
                    </span>                
                </el-tree>   
            </el-row>         
        </el-col>
    </el-row>
    <el-row v-show="user.qxlx==='角色权限'">
        <el-transfer v-model="user.qxs" :data="roles" :props="{key: 'id', label: 'name'}" :titles="['待选', '已选']"></el-transfer>
    </el-row>
  </div>
</template>

<script>
import TreeSelect from '../../../../components/TreeSelect'
import * as tool from '../../../../util/tools/tool'
export default {
  name: 'default',
  components: {
      TreeSelect
  },
  props: {
    // 此处一定要用value,实现v-model
    initdata: {
      type: Object,
      default: () => {
        qybh: null
      }
    },
    viewid: {
        type: String
    }
  },  
  data: function () {
    return {
        units: [],
        menus: [],
        roles: [],
        user: {
            state: '启用',
            qxlx: '角色权限',
            retask: '不指派任务'
        },
        rules: {},
        loading: false
    }
  },
  created () {
    this.menus = tool.getTree(this._mymenus, 1, 'id', 'name')
    this.loading = true
    Promise.all([
        this.$axiosClient.call('sysmanage/qxgl/unit/unitstree', 'get',  {key: 0,label: "攀枝花市"}),
        this.$axiosClient.call('sysmanage/qxgl/role/getmyroles', 'get',  {uid: this._user.id})
    ])
    .then((res) => {
        if (res[0].status === 1) {
            this.units = res[0].data
        } else {
          this.$message.error(res[0].msg || res[0].err)
        }
        if (res[1].status === 1) {
            this.roles = res[1].data
        } else {
          this.$message.error(res[1].msg || res[1].err)
        }        
        this.loading = false
    })  
  },
  methods: {
      save () {
          if (this.user.qxlx == '独立权限') {
            this.user.qxs = this.$refs.tree.getCheckedNodes(false, true).map(item => {
                return item.id
            });
          }
          this.loading = true
          this.$axiosClient.call('sysmanage/qxgl/user/add', 'post', this.user)
            .then((res) => {
              if (res.status === 1) {
                this.$message('新增成功')
                this.$EventBus.$emit('main', {
                    key: 'closeview',
                    id: this.viewid
                })
              } else {
                this.$message.error(res.msg || res.err)
              }
              this.loading = false
            })
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      test() {

      }
  }
}
</script>
<style scoped>
.el-form-item {
    margin-bottom: 20px;
}
</style>
