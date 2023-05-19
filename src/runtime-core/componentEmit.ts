import { camelize, toHandlerKey } from "../shared/ShapeFlags";

export function emit(instance, event, ...args) {
  //   console.log("emit", event);
  // TPP
  // 先去写一个特定行为，在重构成通用行为

  // add-foo => addFoo

  const handlerName = toHandlerKey(camelize(event));
  const handler = instance.props[handlerName];
  handler && handler(...args);
}
