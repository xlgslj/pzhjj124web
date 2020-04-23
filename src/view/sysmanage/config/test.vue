<template>
    <div ref="form1">
        test
        <span class="cuIcon-commentfill" style="font-size:2rem;" ></span>
        <el-row style="border: 1px solid #eaeefb;border-radius: 4px;">
            <el-col :span="2" v-for="item in 12" :key="item" style="text-align:center;border-right: 1px solid #eee;  border-bottom: 1px solid #eee;" :style="{'line-height':(width/12)+'px'}">
                {{item}}
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data: () => {
        return {
            width: 0
        }
    },
    mounted () {
        this.width= this.$refs.form1.offsetWidth
    }
}
</script>
<style src="../../../assets/css/icon.css" scoped>

</style>