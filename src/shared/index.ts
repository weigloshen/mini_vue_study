export const extend = Object.assign;

export const isObject = (val) => val !== null && typeof val === "object";

export const hasChange = (value, newVal) => !Object.is(value, newVal);
