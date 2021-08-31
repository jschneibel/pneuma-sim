/**
 * @file Mixin for elements to have a 'medium' field.
 * @author Jonathan Schneibel
 * @module
 */

export function mixinMedium({ element, medium = "electric" }) {
  element.getMedium = () => medium;
}
