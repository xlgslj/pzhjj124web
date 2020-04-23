<template>
    <el-row
      v-loading.lock="load.body"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.1)"
    >
        <el-col  :xs="10" :sm="10" :md="10" :lg="6" :xl="6">
           <el-tree id="menu" class="menu" node-key="id"
            :default-expanded-keys="[1]"
            :data="treedata"
             :props="defaultProps"
             :expand-on-click-node="false"
             @node-click="handleNodeClick"
              v-loading.lock="load.menu"
              element-loading-text="锁定中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.1)"
             >
            <span class="custom-tree-node" slot-scope="{ node, data }">
            <span  :style="{color: data.lb ==='菜单'? '#00868B':(data.lb === '页面' ? '#1874CD' : '#CD00CD')}">{{(data.pid === 1 && data.isapp == '是') ? `${node.label}(app)` : node.label  }}</span>
                <span v-show="data.id === selectid">
                <el-button
                    type="text"
                    size="mini"
                    @click="() => up(data,node)" v-if="data.sort !== 1">
                    上移
                </el-button>
                <el-button
                    type="text"
                    size="mini"
                    @click="() => down(data,node)" v-if="node.parent.data.children?(data.sort<node.parent.data.children.length): false">
                    下移
                </el-button>
                <el-button v-if="data.lb==='菜单'&&data.children"
                    type="text"
                    size="mini"
                    @click.stop="() => append(data, node)">
                    增加
                </el-button>
                </span>
            </span>
           </el-tree>
        </el-col>
        <el-col  :xs="14" :sm="14" :md="14" :lg="18" :xl="18" style="padding:2px;">
            <el-card class="box-card">
              <el-form  label-suffix=":"  :rules="rules" status-icon ref="ruleForm"  :model="formdata" label-width="8rem" size="mini">
                <el-row>
                    <el-col :span="8">
                      <el-form-item label="类型">
                        <el-radio v-model="formdata.lb" label="菜单">菜单</el-radio>
                        <el-radio v-model="formdata.lb" label="页面" v-if="!formdata.children || formdata.children.length === 0">页面</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="小程序">
                        <el-radio v-model="formdata.isapp" :disabled="formdata.pid!==1" label="否">否</el-radio>
                        <el-radio v-model="formdata.isapp" :disabled="formdata.pid!==1" label="是">是</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="范围">
                        <el-radio v-model="formdata.scope" label="私有">私有</el-radio>
                        <el-radio v-model="formdata.scope" label="公有">公有</el-radio>
                      </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="8">
                      <el-form-item label="父id">
                        <el-input v-model="formdata.pid"  placeholder="请输入内容"  :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="4">
                      <el-form-item label="id">
                        <el-input v-model="formdata.id"  placeholder="请输入内容" :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                      <el-form-item label="菜单名称" prop="name">
                        <el-input v-model="formdata.name"  placeholder="请输入内容" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="4">
                      <el-form-item label="排序">
                        <el-input v-model="formdata.sort"  placeholder="请输入内容"  :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                      <el-form-item label="组件名称" v-if="formdata.lb==='页面'" prop="view">
                        <el-input v-model="formdata.view"  placeholder="请输入内容" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="组件名称" v-else>
                        <el-input v-model="formdata.view"  placeholder="可省略" clearable></el-input>
                      </el-form-item>                      
                    </el-col>
                    <el-col :span="12" :offset="4">
                      <el-form-item label="组件地址">
                        <el-input v-model="formdata.viewpath"  placeholder="请输入内容" clearable></el-input>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" :offset="12">
                    <el-form-item size="mini">
                      <el-button type="primary" icon="el-icon-plus"  @click="onAdd('ruleForm')" v-if="formdata.id&&formdata.id === 'newid'">新增</el-button>
                      <el-button type="primary" icon="el-icon-edit-outline" @click="onEdit('ruleForm')" v-if="formdata.id&&formdata.id!=='newid'&&formdata.id!=='R00000000001'">修改</el-button>
                      <el-button type="primary" icon="el-icon-delete" @click="onDel()" v-if="formdata.id && formdata.id !== 'newid'&&(!formdata.children||formdata.children.length==0)">删除</el-button>
                      <el-button icon="el-icon-back" @click="onCancel()" v-if="formdata.id">取消</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
            <el-card class="box-card" v-show="formdata.lb==='页面'&&formdata.id!='newid'" style="margin-top:10px;">
              <el-form :inline="true" :model="fundata" class="demo-form-inline" size="small">
                <el-form-item v-show="!funedit" size="mini" >
                  <el-button type="primary" @click="addfun" icon="el-icon-plus" circle></el-button>
                </el-form-item> 
                <div v-show="funedit">               
                  <el-form-item label="功能名称" size="mini">
                    <el-input v-model="fundata.name" placeholder="菜单名称"></el-input>
                  </el-form-item>               
                  <el-form-item label="组件名称" size="mini">
                    <el-input v-model="fundata.view" placeholder="组件名称"></el-input>
                  </el-form-item>               
                  <el-form-item label="组件地址" size="mini">
                    <el-input v-model="fundata.viewpath" placeholder="组件地址"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addfunsave" icon="el-icon-download" circle size="mini"></el-button>
                  </el-form-item>                   
                  <el-form-item >
                    <el-button  @click="funaddcancle" icon="el-icon-back" circle size="mini"></el-button>
                  </el-form-item>                   
                </div>
              </el-form>
              <el-table
                v-loading.lock="funedit"
                element-loading-text="锁定中"
                element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.1)"
                :data="buttons"
                border=""
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="功能名称"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="view"
                  label="组件名称"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="viewpath"
                  label="组件地址"
                  >
                </el-table-column>                
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="buttonEdit(scope.$index, scope.row)" >编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="delfunsave(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>              
            </el-card>
        </el-col>
    </el-row>
</template>

<script>

import {data2tree} from '../../../util/tools/data2tree'

export default {
  name: 'default',
  data: () => {
    return {
      menus: [],
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      formdata: {},
      source: {},
      source1: {},
      currentnode: null,
      fundata: {},
      funedit: false,
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        view: [
          { required: true, message: '视图名称不能为空', trigger: 'blur' }
        ]
      },
      load: {
        body: false,
        menu: false
      }
    }
  },
  computed: {
    selectid () {
      return this.source.id || 0
    },
    buttons () {
      return this.menus.filter(x => {
        return x.pid == this.formdata.id && x.lb === '功能'
      })
    }
  },
  watch: {
    formdata: {
      handler (newValue, oldValue) {
        if (newValue.id && oldValue.id === newValue.id && oldValue.sort === newValue.sort) {
          this.load.menu = true
        }
      },
      deep: true
    }
  },
  created () {
    this.load.body = true
    this.getmeuns()
  },
  methods: {
    getmeuns () {
      this.$axiosClient.call('sysmanage/config/menu/get', 'get', {})
        .then((res) => {
          if (res.status === 1) {
            this.menus = res.data
            this.treedata = data2tree([...this.menus.filter(x => x.lb!=='功能')], 1, '系统', 0, {sort: 1})
          } else {
            this.$message(res.msg)
          }
          this.load.body = false
        })
    },
    append (data, node) {
      if (this.formdata.id !== 'newid') {
        let t = node.parent
        let level = 0
        for (let i = 1; i <= 10; i++) {
          t = t.parent
          if (t === null) {
            level = i
            break
          }
        }
        this.formdata = {
          id: 'newid',
          pid: data.id,
          xtlx: 'WEB',
          sylx: '警用',
          lb: '菜单',
          name: '新菜单',
          view: '',
          viewpath: '',
          page: '',
          scope: '私有',
          isapp: data.isapp,
          sort: data.children.length + 1,
          children: level < 3 ? [] : null
        }
      }
    },
    onAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.load.body = true
          this.$axiosClient.call('sysmanage/config/menu/add', 'post', Object.assign( this.formdata, {id: null}))
            .then((res) => {
              if (res.status === 1) {
                this.$message('新增成功')
                let children = this.currentnode.data.children || this.currentnode.data
                console.log(children)
                children.push(Object.assign({}, this.formdata, {id: res.data.id}))
                this.formdata = {}
                this.source = {}
                this.$refs['ruleForm'].clearValidate()
                this.load.menu = false
              } else {
                this.$message.error(res.msg)
              }
              this.load.body = false
            })
        }
      })
    },
    onDel () {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axiosClient.call('sysmanage/config/menu/del', 'post', {id: this.formdata.id, pid: this.formdata.pid})
          .then(res => {
            if (res.status === 1) {
              let parent = this.currentnode.parent
              let children = parent.data.children || parent.data
              let index = children.findIndex(d => d.id === this.formdata.id)
              children.splice(index, 1)
              for (index; index < children.length; index++) {
                let n = Object.assign({}, children[index])
                n.sort = n.sort - 1
                children.splice(index, 1, n)
              }
              this.formdata = {}
              this.source = {}
              this.$refs['ruleForm'].clearValidate()
              this.load.menu = false
              this.$message('删除成功!')
            } else {
              this.$message.error(res.msg)
            }
          })
      }).catch(() => {
        this.$message('已取消删除')
      })
    },
    onEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.$confirm('是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.load.body = true
            this.$axiosClient.call('sysmanage/config/menu/edit', 'post', this.formdata)
              .then(res => {
                if (res.status === 1) {
                  this.formdata = {}
                  this.source = {}
                  this.$refs['ruleForm'].clearValidate()
                  this.load.menu = false
                  this.$message('修改成功!')
                } else {
                  this.$message.error(res.msg)
                }
                this.load.body = false
              })
          }).catch(() => {
            this.$message('已取消删除')
          })
        }
      })
    },
    handleNodeClick (data, node) {
      this.source = Object.assign({}, data)
      this.formdata = data
      this.currentnode = node
      console.log(this.currentnode.parent.children,this.currentnode.parent.data.children)
    },
    onCancel () {
      this.$refs['ruleForm'].clearValidate()
      let parent = this.currentnode.parent
      let children = parent.data.children || parent.data
      console.log(this.currentnode.parent.children|| parent.data)
      let index = children.findIndex(d => d.id === this.source.id)
      if (index >= 0) {
        children.splice(index, 1, this.source)
      }
      this.formdata = {}
      this.source = {}
      this.load.menu = false
    },
    up (data, node) {
      this.load.body = true
      let parent = node.parent
      let children = parent.data.children || parent.data
      let index = children.findIndex(d => d.id === data.id)
      let a = children.slice(index - 1, index + 1)
      let params = [
        {
          id: a[0].id,
          sort: a[1].sort
        },
        {
          id: a[1].id,
          sort: a[0].sort
        }
      ]
      this.$axiosClient.call('sysmanage/config/menu/resort', 'post', params)
        .then(res => {
          if (res.status === 1) {
            let c1 = JSON.parse(JSON.stringify(a[1]))
            let c2 = JSON.parse(JSON.stringify(a[0]))
            let s1 = c1.sort
            c1.sort = c2.sort
            c2.sort = s1
            children.splice(index - 1, 2, c1, c2)
            this.$message('修改成功')
          } else {
            this.$message(res.msg)
          }
            this.load.body = false
        })
    },
    down (data, node) {
      this.load.body = true
      let parent = node.parent
      let children = parent.data.children || parent.data
      let index = children.findIndex(d => d.id === data.id)
      let a = children.slice(index, index + 2)
      let params = [
        {
          id: a[0].id,
          sort: a[1].sort
        },
        {
          id: a[1].id,
          sort: a[0].sort
        }
      ]
      this.$axiosClient.call('sysmanage/config/menu/resort', 'post', params)
        .then(res => {
          if (res.status === 1) {
            let c1 = JSON.parse(JSON.stringify(a[1]))
            let c2 = JSON.parse(JSON.stringify(a[0]))
            let s1 = c1.sort
            c1.sort = c2.sort
            c2.sort = s1
            children.splice(index, 2, c1, c2)
            this.$message('修改成功')
          } else {
            this.$message(res.msg)
          }
          this.load.body = false
        })
    },
    addfun () {
      this.funedit = true
      this.fundata = {
        id: 'newid',
        pid: this.formdata.id,
        xtlx: 'WEB',
        sylx: '警用',
        lb: '功能',
        name: '',
        view: '',
        viewpath: '',
        sort: this.buttons.length + 1,
      }
    },
    addfunsave () {
      this.load.body = true
      this.$axiosClient.call(this.fundata.id === 'newid' ? 'sysmanage/config/menu/add' : 'sysmanage/config/menu/edit', 'post', this.fundata.id === 'newid' ? Object.assign(this.fundata, {id: null}) : this.fundata)
        .then((res) => {
          if (res.status === 1) {
            this.$message('新增成功')
            if (this.fundata.id === 'newid') {
              this.menus.push(res.data)
            } else {
              let i = this.menus.findIndex(x => x.id === this.fundata.id)
              this.menus.splice(i, 1, res.data)
            }
            this.fundata = {}
            this.source1 = {}
            this.funedit = false
          } else {
            this.$message.error(res.msg)
          }
          this.load.body = false
        })
        .catch(e => {
          this.$message.error(e)
          this.load.body =false
        })
    },
    delfunsave (index, row) {
      this.load.body = true
      this.$axiosClient.call('sysmanage/menu/del', 'post', row)
        .then((res) => {
          if (res.status === 1) {
            this.$message('删除成功')
            let i = this.menus.findIndex(x => x.id === row.id)
            this.menus.splice(i, 1)
            this.fundata = {}
            this.source1 = {}
          } else {
            this.$message.error(res.msg)
          }
          this.load.body = false
        })
        .catch(e => {
          this.$message.error(e)
          this.load.body =false
        })
    },
    buttonEdit (index, row) {
      this.source1 = {...row}
      this.fundata = row
      this.funedit = true
    },
    funaddcancle () {
      this.funedit = false
      if (this.fundata.id !== "newid") {
        let i = this.menus.findIndex(x => x.id === this.fundata.id)
        this.menus.splice(i, 1, this.source1)
      }
      this.fundata = {}
      this.source1 = {}
    }
  }
}
</script>

<style scoped>
  .menu {
    min-height: calc(100vh - 130px);
    border: 1px solid #d1dbe5;
    width: 95%;
  }
</style>
