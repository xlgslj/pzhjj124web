<template>
    <el-dialog v-dialogDrag :title="'指派任务--' + indata.title"  visible :top="top" :close-on-click-modal="false" @close="onCancel" custom-class="mydialog">
        <el-row>
            <el-transfer v-model="tousers" :data="users" :props="{key: 'id', label: 'name'}" :titles="['待选', '已选']"></el-transfer>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="20">
              <el-button type="primary"  icon="el-icon-successh" :disabled="tousers.length === 0" @click="save()">保存</el-button>            
          </el-col>
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
      default: '20vh'
    },
    indata: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data () {
    return {
      tousers: [],
      users: [],
      page: {
        currentPage: 1,
        size: 10000
      }
    }
  },
  computed: {
  },
  created () {
    this.$axiosClient.call('sysmanage/qxgl/user/getusers', 'get',Object.assign(this.page, {where: ''}))
    .then((res) => {
      if (res.status === 1) {
        this.users = res.data.users
      } else {
        this.$message.error(res.msg)
      }
    })
    .catch(err=> {
      this.$message.error(err)
    })
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    onCancel () {
      this.$emit('hide')
    },
    save () {
      let tonames = [];
      this.users.filter(item => {
        if (this.tousers.indexOf(item.id) > -1) tonames.push(item.name)
      })

      let task = {
        name: this.indata.title,
        fromid: this._user.id,
        fromname: this._user.name,
        toids: this.tousers,
        tonames: tonames,
        viewid: this.indata.viewid,
        initdata: this.indata.initdata,
        zt: '未完成'
      }
      this.$axiosClient.call('task/task/create', 'post', task)
      .then((res) => {
        if (res.status === 1) {
         this.$message("任务分派成功")
          this.$emit('hide')
        } else {
          this.$message.error(res.err)
        }
      })
      .catch(err=> {
        this.$message.error(err)
      })
    }
  }
}
</script>
<style scoped>
</style>
