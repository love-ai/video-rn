export function isEmpty(obj) {
  return (
    obj === undefined ||
    obj === "undefined" ||
    obj === "null" ||
    obj === "" ||
    obj === null
  );
}

export function isEqual(value, checkValue) {
  return value === checkValue;
}
