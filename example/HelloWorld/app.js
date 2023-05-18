export const app = {
  render() {
    return h("h1", "hi " + this.msg);
  },
  setup() {
    return {
      msg: " mini-vue",
    };
  },
};
