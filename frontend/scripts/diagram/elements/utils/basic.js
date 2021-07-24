export default createBasicElementFactory();

function createBasicElementFactory() {
  let i = 0;

  return function (type) {
    if (typeof type === "string" || type instanceof String) {
      const id = i;

      const element = {
        getId: () => id,
        getType: () => type,
      };

      i++;

      console.info(`Created ${element.getType()} element with id ${id}`);

      return element;
    } else {
      console.error("No type provided to createBasicElement()");
    }
  };
}
