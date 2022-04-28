export default {
  props: {
    components: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      currentCom: {},
      qiankunConfig: this.$root.$options.qiankunConfig,
      com: {}
    }
  },
  methods: {
    getCurrentRouterComponent (components) {
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
    },
    getCurrentComponent (components) {
      return components.find(item => this.qiankunConfig && this.qiankunConfig.componentName === item.name)
    }

  },
  created () {
    const router = this.$root.$options.router
    if (router) {
      const com = this.getCurrentComponent(router.options.routes)
      this.currentCom = com ? com.component : this.components[0].component
    } else {
      this.currentCom = this.getCurrentComponent(this.components)
    }
    
  },
  render (h) {
    return h('component', {
      is: this.currentCom,
      props: this.qiankunConfig && this.qiankunConfig.data
    })
  }
}
