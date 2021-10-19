
class EventBus {
  install = Function
  keyIdentify =''
  events = {}
  constructor (Vue, cache, qiankunConfig) {
    this.init(Vue, cache, qiankunConfig)
  }

  bindVm (vm) {
    this.vm = vm
  }
  init (Vue, cache, qiankunConfig) {
    this.Vue = Vue
    if (!window.eventBus) {
      window.eventBus = Vue.prototype.eventBus = new Vue()
    }
    this.keyIdentify = qiankunConfig && qiankunConfig.name
    this.qiankunConfig = qiankunConfig
    this.cache = cache
    this.$off = window.eventBus.$off
    this.$emit = window.eventBus.$emit
  }

  $on (event, cb, defaultData) {
    defaultData && (this.events[event] = defaultData)
    this.cache ? this.dealFunc = (...args) => {
      defaultData && (this.events[event] = args)
      if (sessionStorage.getItem('CURRENT_APP_NAME') === this.keyIdentify) {
        cb.apply(this, args)
      } else {

      }
    } : this.dealFunc = (...args) => {
      defaultData && (this.events[event] = args)
      cb.apply(this, args)
    }
    window.eventBus.$on(event, this.dealFunc)
    if (!this.cache) {
      defaultData && window.eventBus.$emit(event, defaultData)
      this.vm && this.vm.$once('hook:beforeDestroy', () => {
        window.eventBus.$off(event, this.dealFunc)
      })
    }
  }
}

export default function initEvent (Vue, vm, cache, keyIdentify) {
  return new EventBus(Vue, vm, cache, keyIdentify)
}
