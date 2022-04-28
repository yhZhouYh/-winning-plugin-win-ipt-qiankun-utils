import initEvent from './eventBus'

class QianKunVue {
  constructor (VueOptions, config) {
    this.instance = null
    this.eventBus = null
    this.VueOptions = VueOptions
    this.config = config
    // this.init()
  }
  init () {
    // this.render = this.config.render || this.render
    // this.update = this.config.update || this.update
    // this.bootstrap = this.config.bootstrap || this.bootstrap
    // this.mount = this.config.mount || this.mount
    // this.unmount = this.config.unmount || this.unmount
  }

  render (props) {
    let { container } = props
    const { App, Vue } = this.VueOptions
    this.eventBus = this.eventBus || initEvent(Vue, this.config.cache, props)
    const vueInstanceParams = {
      ...this.VueOptions,
      qiankunConfig: props,
      eventBus: this.eventBus,
      render: h => h(App)
    }
    // router && (vueInstanceParams.routesConfig = router.options.routes)
    container ? container = container.querySelector('#app') : container = document.querySelector('#app')
    if (this.config.cache) {
      if (this.instance && this.instance.$el) {
        container.innerHTML = ''
        container.appendChild(this.instance.$el)
        return {
          app: this.instance,
          eventBus: this.eventBus
        }
      }
    }
    this.instance = new Vue({
      ...vueInstanceParams
    })

    Vue.mixin({
      beforeCreate () {
        const eventBus = this.$root.$options.eventBus
        eventBus && eventBus.bindVm(this)
        this.$eventBus = eventBus
      }
    })
    this.instance.$mount(container)
    return {
      app: this.instance,
      eventBus: this.eventBus
    }
  }
  update () {
    console.log(`${process.env.VUE_APP_MODULE_NAME} app update`)
  }
  bootstrap () {
    console.log(`${process.env.VUE_APP_MODULE_NAME} app bootstraped`)
  }
  mount (props) {
    props.name && (sessionStorage.setItem('CURRENT_APP_NAME', props.name))
    const { eventBus } = this.render(props)
    if (this.config.cache) {
      const events = eventBus['events']
      Object.keys(events).map(key => {
        window.eventBus.$emit(key, ...events[key])
      })
    }
  }
  unmount () {
    if (!this.config.cache) {
      this.instance.$destroy()
      this.instance.$el.innerHTML = ''
      this.instance = null
    }
  }
}

export default function createApp (VueOptions, config = { cache: false }, initOptions) {
  const app = new QianKunVue(VueOptions, config)
  if (!window.__POWERED_BY_QIANKUN__ && initOptions) {
    app.render(initOptions)
  }
  const mount = async (props) => {
    app.mount(props)
  }
  const unmount = async (props) => {
    app.unmount(props)
  }
  const bootstrap = async (props) => {
    app.bootstrap(props)
  }
  return {
    app,
    mount,
    unmount,
    bootstrap
  }
}
