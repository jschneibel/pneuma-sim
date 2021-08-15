/**
 * @file Mixin for elements to have a 'highlighted' state.
 * @author Jonathan Schneibel
 * @module
 */

/**
 * Mixes a boolean 'highlighted' state into the given element.
 * The state can be read with element.isHighlighted(), changed
 * with element.highlight() and element.unhighlight().
 * Side effects such as graphical representation of the highlighted
 * state are not added with this mixin.
 *
 * @param {object} param0 Options object.
 * @param {object} param0.element Element to mix 'highlighted' state into.
 * @param {boolean} param0.highlighted Initial value.
 */
export function mixinHighlighting({ element, highlighted = false }) {
  element.isHighlighted = () => highlighted;

  element.highlight = () => (highlighted = true);

  element.unhighlight = () => (highlighted = false);
}
