<template>
    <el-dialog v-dialogDrag title="密码修改" width="30%" :visible.sync="myvisible" :top="top" :close-on-click-modal="false" @close="onCancel" custom-class="mydialog">
      <el-row>
        <el-form :model="formdata"  label-suffix=":"  :rules="rules" status-icon ref="ruleForm"  label-width="120px" size="medium"   class="demo-ruleForm">
            <el-col :span="24">
                <el-form-item label="原密码"  prop="ymm">
                    <el-input type="password" v-model="formdata.ymm"  placeholder="请输入内容" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="新密码" prop="xmm1">
                    <el-input type="password" v-model="formdata.xmm1"  placeholder="请输入内容" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="确认密码" prop="xmm2">
                    <el-input type="password" v-model="formdata.xmm2"  placeholder="请输入内容" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item>
                    <el-button type="primary"  icon="el-icon-upload2" @click="onSubmit('ruleForm')" >修改</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item>
                    <el-button type="primary"  icon="el-icon-close" @click="onCancel" >取消</el-button>
                </el-form-item>
            </el-col>
        </el-form>
      </el-row>
    </el-dialog>
</template>
<script>
//import * as axiosClient from '../common/axiosClient'
export default {
  props: {
    // 此处一定要用value,实现v-model
    value: {
      type: Array,
      default: () => []
    },
    top: {
      type: String,
      default: '30vh'
    },
    user: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: undefined
    }
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formdata.xmm2 !== '') {
          this.$refs.ruleForm.validateField('xmm2')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formdata.xmm1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formdata: {
        ymm: '',
        xmm1: '',
        xmm2: ''
      },
      myvisible: false,
      rules: {
        ymm: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        xmm1: [
          { validator: validatePass, trigger: 'blur' }
        ],
        xmm2: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  watch: {
    visible (newVal) {
      this.formdata.ymm = ''
      this.formdata.xmm1 = ''
      this.formdata.xmm2 = ''
      this.myvisible = newVal
    }
  },
  methods: {
    onCancel () {
      this.$emit('hide')
    },
    onSubmit (formName) {/*
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        } else {
          console.log(33333)
          axiosClient.call('EDITPWD', 'post', {id: this.user.ID, oldpwd: this.formdata.ymm, newpwd: this.formdata.xmm1})
            .then((res) => {
              if (res.status === 1) {
                this.$message('修改成功')
                this.$emit('hide')
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      })*/
    }
  }
}
</script>
<style scoped>
</style>
