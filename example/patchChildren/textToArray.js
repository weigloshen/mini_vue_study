import { h, ref } from "../../lib/guide_mini_vue.esm.js";
const nextChildren = [h("div", {}, "C"), h("div", {}, "D")]
const prevChildren = 'text'

export default {
  name: 'textToArray',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange
    }
  },
  render() {
    const self = this

    return self.isChange === true
    ? h('div', {}, nextChildren)
    : h('div', {}, prevChildren)

  }
}