/**
 * @file Mixin for elements to have (rectangular) dimensions.
 * @author Jonathan Schneibel
 * @module
 */

export function mixinDimensions({ element, dimensions = { width, height } }) {
  let width = dimensions.width;
  let height = dimensions.height;

  element.getDimensions = () => ({ width, height });
}
