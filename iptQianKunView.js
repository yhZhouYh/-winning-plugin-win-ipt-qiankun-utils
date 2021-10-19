export default {
  data () {
    return {
      currentCom: {},
      components: [],
      qiankunConfig: this.$root.$options.qiankunConfig,
      com: {}
    }
  },
  methods: {
    getCurrentComponent (components) {
      components.find((item, i) => {
        if (this.qiankunConfig && this.qiankunConfig.componentName === item.name) {
          this.com = item
        } else {
          if (item.children && item.children.length) {
            return this.getCurrentComponent(item.children)
          }
        }
      })
      return this.com
    }

  },
  created () {
    const router = this.$root.$options.router
    this.components = (router && router.options.routes) || []
    const com = this.getCurrentComponent(this.components)
    this.currentCom = com ? com.component : this.components[0].component
  },
  render (h) {
    return h('component', {
      is: this.currentCom,
      props: this.qiankunConfig && this.qiankunConfig.data
    })
  }
}
