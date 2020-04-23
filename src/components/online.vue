<template>
  <div style="cursor: pointer;" @click="showusers">
    <el-row>
        <el-col :span="24">
            <el-badge :value="users.length" class="item">
            <i class="el-icon-s-custom" style="font-size:20px;"></i>
            </el-badge>
        </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'default',
  data: () => {
    return {
      users: []
    }
  },
  created () {
    this.getdata()
  },
  beforeMount () {
   //- this.$ws.clients.push(this)
  },
  methods: {
    showusers () {
      let str = ''
      this.users.forEach(d => {
        str = str + `<div style=\"margin-top:5px;\"><span>${d.name}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"float:right;\">${this.dateformat(d.time, 'HH:mm')}</span></div>`
      })
      this.$notify({
        title: '在线用户',
        dangerouslyUseHTMLString: true,
        position: 'bottom-right',
        message: str
      });
    },
    getdata () {
     /* this.$axiosClient.call('LOGINGETONLINES', 'get', {})
        .then(res => {
          if (res.status === 1) {
            this.users = res.data
          } else {
            this.$message.error(res.msg)
          }          
        })
        .catch(err => {
          this.$message(err)
        })      */
    },
    onmessage (data) {
      if (data.event === 'updateusers') {
        this.users = data.users
      }
    }
  }
}
</script>
<style scoped>
</style>
