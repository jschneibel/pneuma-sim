/**
 * @file Mixin for elements to perform an action when removed from the diagram.
 * @author Jonathan Schneibel
 * @module
 */

/**
 * Mixes a callback into the element that is called whenever element.remove()
 * is called (this happens e.g. when an element is deleted from the diagram).
 * If the mixin is applied to the same element multiple times, all the supplied
 * the callbacks are executed in the order the respective mixins have been called.
 *
 * @param {object} param0 Options object.
 * @param {object} param0.element Element to mix the callback into.
 * @param {Function} param0.remove Callback to be called upon element removal.
 */
export function mixinRemoval({ element, remove = function (diagram) {} }) {
  // extend remove function if it already has been mixed-in
  const existingRemove = element.remove;

  element.remove = function (diagram) {
    if (existingRemove) {
      existingRemove(diagram);
    } else {
      // One attempt to remove element from diagram
      // per invocation of element.remove().
      // (Some elements might not be registered with diagram
      // but with some other element, so this does nothing).
      diagram.removeElement?.(element);
    }

    remove(diagram);
  };
}
