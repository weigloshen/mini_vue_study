export enum ShapeFlags {
  ELEMENT = 1, //0001
  STATEFUL_COMPONENT = 1 << 1, //0010
  CHILDREN_STRING = 1 << 2, //0100
  CHILDREN_ARRAY = 1 << 3, //1000
}
