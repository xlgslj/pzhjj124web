<template>
    <div>
        <el-row style="padding-top:1rem;padding-right:1rem;">
            <el-col :span="8" :offset="16">
                <el-card class="box-card">
                    <div v-for="(item,index) in tasks" :key="item.id" class="text item">
                        {{'任务' + (index +1) +'： [' + item.name + '] 来自：' + item.fromname + item.viewid}}
                       <el-link type="primary" @click="opentask(item)">主要链接</el-link>
                    </div>
                </el-card>                
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data: () => {
        return {
            menus: [],
            tasks: []
        }
    },
    watch: {},
    beforeCreate () {
      this.$wss.clients.push((data) => {
        switch(data.event) {
          case 'newtask': 
            this.gettasks()
            break;
          default:
            break;                      
        }
      })
    },
    created () {
        this.gettasks()
        this.getmenus()
    },
    methods: {
        gettasks () {
            this.$axiosClient.call('task/task/getusertasks', 'get', {id: this._user.id})
            .then((res) => {
            if (res.status === 1) {
                this.tasks = res.data
            } else {
                this.$message.error(res.err)
            }
            })
            .catch(err=> {
                this.$message.error(err)
            })            
        },
        getmenus () {
            this.$axiosClient.call('sys/getmenus', 'get', {})
            .then((res) => {
            if (res.status === 1) {
                this.menus = res.data
            } else {
                this.$message.error(res.err)
            }
            })
            .catch(err=> {
                this.$message.error(err)
            }) 
        },
        opentask (task) {
            let m = this.menus.find(x => x.id === task.viewid)
            this.$EventBus.$emit('main', {
                key: 'opennew',
                id: task.viewid,
                initdata: task.initdata
            })            
        }
    }
}
</script>

<style scoped>
  .text {
    font-size: 1rem;
  }

  .item {
    padding: 0.5rem 0;
  }
</style>
