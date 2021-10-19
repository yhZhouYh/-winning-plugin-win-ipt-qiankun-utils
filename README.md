## 安装
```
npm i @winning-plugin/win-ipt-qiankun-utils --save
```

## main.js

~~if (!window.eventBus) {
  window.eventBus = Vue.prototype.eventBus = new Vue()
}~~

```
// main.js中初始化

import { createApp } from '@winning-plugin/win-ipt-qiankun-utils'
const {
  mount,
  bootstrap,
  unmount
} = createApp(
  {
    Vue,
    router,
    store,
    App
  },
  { cache: true }, // 是否缓存
  { // 测试IptQianKunView组件(非必填)
    componentName: 'signTask',
    data: {
      single: true
    }
  })
export {
  mount,
  unmount,
  bootstrap
}

```
## App.vue
### IptQianKunView组件
```
<template>
  <div id="nursingtask">
    <router-view v-if="isDev" />
    <IptQianKunView v-else />
  </div>
</template>

<script>
import IptQianKunView from '@winning-plugin/win-ipt-qiankun-utils'
export default {
  name: 'App',
  components: {
    IptQianKunView
  },
  data () {
    return {
      isDev: !window.__POWERED_BY_QIANKUN__,
    }
  }
}
</script>
```

## 事件监听改造
```
// $on改造
// 不再需要beforeDestroy时手动off
// @param 事件名
// @param 对应处理方法
// @param 初始化数据

const patients = this.$WS.getCurrentPatientInfo()
this.$eventBus.$on('SET_CURRENT_PATIENT_INFO', this.dealPatient, patients)

```
