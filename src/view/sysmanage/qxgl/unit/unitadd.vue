<template>
  <div
    v-loading.lock="loading"
    element-loading-text="处理中"
    element-loading-spinner="el-icon-loading"    
    style="margin-top:10px;">
    <el-row style="padding-right:2px;">
        <el-col :span="24">
            <el-form :model="unit"  label-suffix=":" :rules="rules" ref="ruleForm"  status-icon  label-width="8rem" size="mini"   class="demo-ruleForm">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="上级单位" prop="ZZJGDM">
                            <TreeSelect
                             :defaultProps="{children: 'children',label: 'label'}" 
                             :treedata="units"
                             v-model="unit.pid"
                             keyword="key"
                             >
                             </TreeSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="重点对象类型" prop="ZDDXLX">
                            <el-select v-model="unit.zddxlx" placeholder="请选择"  clearable>
                                <el-option
                                v-for="item in codefilter('zddxlx')"
                                :key="item.code"
                                :label="item.code+': '+ item.val"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="营运类型" prop="DWXZ" style="width:100%;">
                            <el-select v-model="unit.yyxz" multiple placeholder="请选择"  clearable style="width:100%;">
                                <el-option
                                v-for="item in codefilter('yyxz')"
                                :key="item.code"
                                :label="item.code+': '+ item.val"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="单位名称" prop="DWMC">
                            <el-input v-model="unit.dwmc"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="组织机构代码" prop="ZZJGDM">
                            <el-input v-model="unit.zzjgdm"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="单位简称">
                            <el-input v-model="unit.dwjc"  ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        &nbsp;
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
        unit: {},
        rules: {},
        loading: false
    }
  },
  created () {
    this.loading = true
    this.$axiosClient.call('sysmanage/qxgl/unit/unitstree', 'get',  {key: 0,label: "攀枝花市"})
    .then((res) => {
        if (res.status === 1) {
            this.units = res.data
        } else {
          this.$message.error(res.msg || res.err)
        }
        this.loading = false
    })  
  },
  methods: {
      save () {
          this.loading = true
          this.$axiosClient.call('sysmanage/qxgl/unit/add', 'post', this.unit)
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
