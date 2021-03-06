/**
 * @file A basic element that has a unique ID and type.
 * @author Jonathan Schneibel
 * @module
 */

import { ELEMENTS } from "../../../constants.js";

export const createBasicElement = createBasicElementFactory();

function createBasicElementFactory() {
  let i = 0;

  return function (type) {
    if (typeof type === "string" || type instanceof String) {
      const id = i;

      const label = ELEMENTS.find((element) => element.type === type)?.label;

      const element = {
        getId: () => id,
        getType: () => type,
        getLabel: () => label,
      };

      i++;

      console.info(`Created ${element.getType()} element with id ${id}`);

      return element;
    } else {
      console.error("No type provided to createBasicElement()");
    }
  };
}
