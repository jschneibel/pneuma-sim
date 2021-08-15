/**
 * @file Mixin for elements to have a position.
 * @author Jonathan Schneibel
 * @module
 */

/**
 * Mixes a {{ x: number, y: number }} position into the given element.
 * The position can be read with element.getPosition() and changed
 * with element.setPosition(). Changing the intial position object directly
 * won't have an effect on the position of the element.
 * Side effects such as graphical representation of the position
 * are not added with this mixin.
 *
 * @param {object} param0 Options object.
 * @param {object} param0.element Element to mix 'highlighted' state into.
 * @param {{ x: number, y: number }} param0.position Initial value.
 */
export function mixinPosition({ element, position = { x: 0, y: 0 } }) {
  let x = position.x;
  let y = position.y;

  element.getPosition = () => ({ x, y });

  element.setPosition = function (position = { x, y }) {
    x = position.x;
    y = position.y;
  };
}
