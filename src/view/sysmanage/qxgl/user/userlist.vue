<template>
  <div
    v-loading.lock="loading"
    element-loading-text="处理中"
    element-loading-spinner="el-icon-loading"    
    style="margin-top:10px;">
    <el-row style="margin-top:5px;"  ref="form1">
        <el-col :span="24">
          <el-form :inline="true" :model="queryTmp" label-width="100px" label-suffix=":" size="mini">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="单位">
                        <TreeSelect
                            :defaultProps="{children: 'children',label: 'label'}" 
                            :treedata="units"
                            v-model="queryTmp.dwid"
                            keyword="key"
                            >
                            </TreeSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="登录名">
                        <el-input v-model="queryTmp.uid" placeholder="登录名" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="姓名">
                        <el-input v-model="queryTmp.name" placeholder="姓名" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item  >
                      <el-button type="primary" @click="doQuery"  icon="el-icon-search">筛选</el-button>
                      <el-button type="primary" plain @click="add"  icon="el-icon-circle-plus-outline"  :disabled="!pagefun('useradd')">新增</el-button>                      
                    </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <el-table v-if="loaded"
                :data="users"
                :show-header="true"                   
                :height="tabh"
                border
                >
                <el-table-column
                prop="id"
                label="No."
                width="60"
                show-overflow-tooltip
                >   
                </el-table-column> 
                <el-table-column
                prop=""
                label="类型"
                width="80"
                show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{code2cn(scope.row.type, 'userlx')}}
                  </template>                  
                </el-table-column>
                <el-table-column
                prop="state"
                label="状态"
                width="80"
                show-overflow-tooltip
                >              
                </el-table-column>
                <el-table-column
                prop="uid"
                label="登录名"
                width="80"
                show-overflow-tooltip
                >              
                </el-table-column>
                <el-table-column
                prop="name"
                label="姓名"
                width="80"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="pubopenid"
                label="公众号用户id"
                width="150"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="openid"
                label="小程序用户id"
                width="150"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="qxlx"
                label="权限类型"
                width="100"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="retask"
                label="指派任务"
                width="100"
                show-overflow-tooltip
                >
                </el-table-column>          
                <el-table-column
                prop="dwmc"
                label="单位名称"
                width="300"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="120">
                  <template slot-scope="scope">
                    <el-button  type="text" size="small"  @click="unitedit(scope.row)"  :disabled="!pagefun('useredit')">编辑</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>            
        </el-col>
    </el-row>
  </div>
</template>

<script>
import TreeSelect from '../../../../components/TreeSelect'
export default {
  name: 'default',
  components: {
      TreeSelect
  },
  props: {
    viewid: {
        type: String
    }
  },
  data: () => {
    return {
        queryTmp: {},
        users: [],
        units: [],
        total: 0,
        page: {
          currentPage: 1,
          size: 10
        },
        formH: 0,
        loaded: false,
        loading: false
    }
  },
  computed: {
    tabh () {
        return  window.innerHeight - 91 - this.formH - 32 - 10 - 5
    } 
  },
  created () {
    this.loading = true
    this.$axiosClient.call('sysmanage/qxgl/unit/unitstree', 'get', {key: 0,label: "全部"})
    .then((res) => {
        if (res.status === 1) {
            this.units = res.data
        } else {
          this.$message.error(res.msg || res.err)
        }
        this.loading = false
    })  
  },
  mounted () {
    this.onQuery()
    this.formH = this.$refs.form1.$el.offsetHeight
    this.loaded = true  
  },
  methods: {
    add () {
      this.$EventBus.$emit('main', {
        key: 'opennew',
        id: this.pagefun("useradd"),
        initdata: {}
      })
    },
    unitmore (row) {
      this.$EventBus.$emit('main', {
        key: 'opennew',
        viewid: '000000065318',
        initdata: {
          qybh: row.QYBH
        }
      })
    },
    unitedit (row) {
      this.$EventBus.$emit('main', {
        key: 'opennew',
        viewid: '000000066697',
        initdata: {
          qybh: row.QYBH
        }
      })
    },
    handleSizeChange (val) {
      this.page.currentPage = 1
      this.page.size = val
      this.onQuery()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.onQuery()
    },
    doQuery () {
      this.page.currentPage = 1
      this.page.size = 10 
      this.onQuery()
    },
    onQuery () {      
      /*let w1 = []
      Object.keys(this.queryTmp).forEach(k => {
          if (this.queryTmp[k]) {
            if (k === 'ZDDXLX' || k === 'DWXZ') {
              w1.push(k + '=\'' + this.queryTmp[k] +'\'')
            } else {
              w1.push(k + ' like \'%' + this.queryTmp[k] +'%\'')               
            }
          }
      })
      let where = { where: w1.join(' and ')}*/
      this.loading = true
      this.users = []
      this.$axiosClient.call('sysmanage/qxgl/user/getusers', 'get',Object.assign(this.page, {where: ''}))
        .then((res) => {
          if (res.status === 1) {
            this.users = res.data.users
            this.total = res.data.total
          } else {
            this.$message.error(res.msg)
          }
          this.loading = false
        })
        .catch(err=> {
          this.$message.error(err)
          this.loading = false
        })
    }
  }
}
</script>
<style scoped>

</style>
