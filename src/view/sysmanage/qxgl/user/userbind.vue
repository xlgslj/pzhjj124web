<template>
<el-row style="margin-top:5rem;">
    <el-row>
        <el-col :span="8" :offset="8">
            <el-card style="width:22rem;">
                <div slot="header" class="clearfix">
                    <span style="font-size:2rem;font-weigth:700; ">扫描以下二维码进行用户绑定</span>
                </div>
                <!--<span v-if="_user.pubopenid">{{_user.pubopenid}} </span>   -->             
                <img  style="width:20rem;height:20rem" :src="qrcodeimgurl"/>
            </el-card>
            {{_user}}
        </el-col>
    </el-row>
</el-row>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  name: 'App',
  data: () => {
    return {
      qrcodeimgurl: ''
    }
  },
  created () {

    //获取二维护码
    this.$axiosClient.call('weixin/getqrcode', 'get', {scene:'userbind', val: this._user.id})
      .then(res => {
         this.qrcodeimgurl =  res.data
      })
      .catch(err => {
        this.$message(err)
      })  
    
  },
  beforeMount () {
    this.$wss.clients.push((data) => {
      if (data.event === 'userbindok') {
          alert(data.pubopenid)
          this.A_user(Object.assign({}, this._user, {pubopenid: data.pubopenid}))
      } else if (data.event === 'scanlogerr') {
        this.$message('扫描登录失败，请确认是否已绑定账号')
      }
    })
  },
  mounted () {
 
  },
  methods: {

  },
  destroyed () {
  }
}
</script>
<style scoped>

</style>