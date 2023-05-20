export enum ShapeFlags {
  ELEMENT = 1, //0001
  STATEFUL_COMPONENT = 1 << 1, //0010
  CHILDREN_STRING = 1 << 2, //0100
  CHILDREN_ARRAY = 1 << 3, //1000
  SLOT_CHILDREN = 1 << 4,
}

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};
