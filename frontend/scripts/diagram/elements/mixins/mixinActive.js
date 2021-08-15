/**
 * @file Mixin for elements to have an 'active' state.
 * @author Jonathan Schneibel
 */

/**
 * Mixes a boolean 'active' state into the given element.
 * The state can be changed with element.activate(),
 * element.deactivate() and element.toggleActivate().
 * element.activate(args) and element.deactivate(args) will cause
 * the callbacks onActivate(args) and onDeactivate(args) and return their results.
 * The callbacks are only called if the 'active' state effectively changes
 * (e.g. calling element.activate() twice will call onDeactivate() only once).
 *
 * @param {object} param0 Options object.
 * @param {object} param0.element Element to mix 'active' state into.
 * @param {boolean} param0.active Initial value.
 * @param {Function} param0.onActivate Callback to call whenever the element is activated.
 * @param {Function} param0.onDeactivate Callback to call whenever the element is deactivated.
 */
export default function mixinActive({
  element,
  active = false,
  onActivate = function () {},
  onDeactivate = function () {},
}) {
  element.isActive = () => active;

  element.activate = function () {
    if (!active) {
      active = true;
      return onActivate(...arguments);
    } else {
      return undefined;
    }
  };

  element.deactivate = function () {
    if (active) {
      active = false;
      return onDeactivate(...arguments);
    } else {
      return undefined;
    }
  };

  element.toggleActive = function () {
    return element.isActive()
      ? element.deactivate(...arguments)
      : element.activate(...arguments);
  };
}
