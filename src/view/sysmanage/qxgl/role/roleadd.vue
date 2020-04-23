<template>
  <div
    v-loading.lock="loading"
    element-loading-text="处理中"
    element-loading-spinner="el-icon-loading"    
    style="margin-top:10px;">
    <el-row style="padding-right:10px;">
        <el-col :span="24">
            <el-form :model="role"  label-suffix=":" :rules="rules" ref="ruleForm"  status-icon  label-width="140px" size="mini"   class="demo-ruleForm">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="角色名称" prop="DWMC">
                            <el-input v-model="role.name"  placeholder="角色名称"  clearable ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色描述" prop="DWMC">
                            <el-input   type="textarea"  :rows="2" v-model="role.memo"  placeholder="角色描述"  clearable ></el-input>
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
    <el-divider content-position="center">选择权限</el-divider>   
    <el-row>
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
        menus: [],
        role: {},
        rules: {},
        loading: false
    }
  },
  created () {
    this.getmenus()
  },
  methods: {
      getmenus () {
        console.log(this._user)
        this.loading = true
        this.$axiosClient.call('sysmanage/config/menu/getuserallmenus', 'get', {id: this._user.id})
          .then((res) => {
            if (res.status === 1) {
              this.menus = tool.getTree(res.data, 1, 'id', 'name') 
            } else {
              this.$message.error(res.msg || res.err)
            }
            this.loading = false
          })
      },
      save () {
          this.role.qxs = this.$refs.tree.getCheckedNodes(false, true).map(item => {
              return item.id
          });
          this.role.uid = this._user.id
          this.role.uname = this._user.name
          this.role.dwid = this._user.dwid
          this.role.dwname = this._user.dwmc
          this.loading = true
          this.$axiosClient.call('sysmanage/qxgl/role/add', 'post', this.role)
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
