import { h, ref } from "../../lib/guide_mini_vue.esm.js";

const nextChildren = 'textNext'
const prevChildren = 'textPrev'

export default {
  name: 'textToText',
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