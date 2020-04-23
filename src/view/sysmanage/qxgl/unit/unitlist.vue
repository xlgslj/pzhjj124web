<template>
  <div
    v-loading.lock="loading"
    element-loading-text="处理中"
    element-loading-spinner="el-icon-loading"    
    style="margin-top:10px;">
    <el-row style="margin-top:5px;"  ref="form1">
        <el-col :span="24">
          <el-form :inline="true" :model="queryTmp" label-width="120px" label-suffix=":" size="mini">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="组织机构代码">
                        <el-input v-model="queryTmp.zjjgdm" placeholder="组织机构代码" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单位名称">
                        <el-input v-model="queryTmp.dwmc" placeholder="单位名称" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="重点对象类型">
                        <el-select v-model="queryTmp.zddxlx" placeholder="请选择"  clearable>
                            <el-option
                            v-for="item in codefilter('zddxlx')"
                            :key="item.code"
                            :label="item.code+': '+ item.val"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="营运类型">
                        <el-select v-model="queryTmp.yyxz"  placeholder="请选择"  clearable>
                            <el-option
                            v-for="item in codefilter('yyxz')"
                            :key="item.code"
                            :label="item.code+': '+ item.val"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :offset="10">
                    <el-form-item >
                      <el-button type="primary" @click="doQuery"  icon="el-icon-search">筛选</el-button>
                      <el-button type="primary" plain @click="add"  icon="el-icon-circle-plus-outline" :disabled="!pagefun('unitadd')">新增</el-button>                      
                    </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <el-table v-if="loaded"
                :data="units"
                :show-header="true"                   
                :height="tabh"
                border
                :row-style="{height:'12px'}"
                >
                <el-table-column
                prop="id"
                label="No."
                width="60"
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
                prop=""
                label="重点对象类型"
                width="150"
                show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{code2cn(scope.row.zddxlx, 'zddxlx')}}
                  </template>                  
                </el-table-column>
                <el-table-column
                prop=""
                label="坐标"
                width="80"
                show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span :style="{color: (scope.row.DTZB ? 'green' : 'red')}">{{scope.row.DTZB ? '已采集' : '未采集'}}</span>
                  </template>                  
                </el-table-column>
                <el-table-column
                prop="id"
                label="车辆数"
                width="80"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="id"
                label="驾驶人数"
                width="100"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="dwdz"
                label="单位地址"
                width="300"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop=""
                label="经营负责人"
                width="150"
                show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{(scope.row.GLLXR || '')}}/{{(scope.row.GLSJHM || '')}}
                  </template>
                </el-table-column>
                <el-table-column
                prop=""
                label="安全负责人"
                width="150"
                show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{(scope.row.AQLXR || '')}}/{{(scope.row.AQSJHM || '')}}
                  </template>
                </el-table-column>
                <el-table-column
                prop="JYMS"
                label="企业概况"
                show-overflow-tooltip
                  width="300">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="120">
                  <template slot-scope="scope">
                    <el-button  type="text" size="small"  @click="unitmore(scope.row)" >详情</el-button>
                    <el-button  type="text" size="small"  @click="unitedit(scope.row)" :disabled="!pagefun('unitedit')" >编辑</el-button>
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
export default {
  name: 'default',
  props: {
    viewid: {
        type: String
    }
  },
  data: () => {
    return {
        queryTmp: {},
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
  mounted () {
    this.onQuery()
    this.formH = this.$refs.form1.$el.offsetHeight
    console.log(this.formH)
    this.loaded = true  
  },
  methods: {
    add () {
      this.$EventBus.$emit('main', {
        key: 'opennew',
        id: this.pagefun("unitadd"),
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
        id: this.pagefun("unitedit"),
        initdata: {
          id: row.id
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
      this.units = []
      this.$axiosClient.call('sysmanage/qxgl/unit/getunits', 'get', Object.assign(this.page))
        .then((res) => {
          if (res.status === 1) {
            this.units = res.data.units
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
