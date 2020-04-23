<template>
  <el-popover
    placement="bottom-start"
    trigger="manual"
    v-model="visible"
    >
    <el-scrollbar style="height:200px;">
      <el-tree :node-key="keyword"
      :default-expanded-keys="defaultexpanded"
      :data="treedata"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="treeclidk"
      >
    </el-tree>
    </el-scrollbar>
    <el-input ref="input" slot="reference"
      placeholder="请输入内容"
      v-on:click.native.stop="inputclick"
      v-model="mytext"
      readonly
      suffix-icon="el-icon-arrow-down">
        </el-input>
  </el-popover>
</template>
<script>
export default {
  props: {
    // 此处一定要用value,实现v-model
    value: {
      type: Number
    },
    keyword: {
      type: String,
      default: 'id'
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'name'
        }
      }
    },
    treedata: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data: () => {
    return {
      visible: false,
      myid: this.value,
      mytext: '',
      myfun: null,
      width: 1000,
      defaultexpanded: [0]
    }
  },
  computed: {
  },
  created () {
    this.myid = this.value
    this.myfun = () => {
      this.visible =false
    }
    document.body.addEventListener('click', this.myfun, false)
    if (this.clear) {
    }
  },
  mounted () {
    this.width = this.$refs.input.$el.offsetWidth
  },
  destroyed () {
    document.body.removeEventListener('click', this.myfun, false)
  },
  watch: {
    // 监听prop传的value，如果父级有变化了，将子组件的myid也跟着变，达到父变子变的效果
    value: {
      handler (newVal) {
        this.myid = newVal
      },
      deep: true
    },
    // 监听myid，如果子组件中的内容变化了，通知父级组件，将新的值告诉父级组件，我更新了，父级组件接受到值后页就跟着变了
    myid: {
      handler (newVal) {
        this.defaultexpanded = [newVal]
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  methods: {
    inputclick () {
      this.visible = !this.visible
    },
    treeclidk (data, node) {
      this.visible = false
      this.myid = data[this.keyword]
      this.mytext = data[this.defaultProps.label]
    }
  }
}
</script>
<style>
</style>
