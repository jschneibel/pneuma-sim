export default function mixinActive({
  element = {},
  active = false,
  onActivate = function () {},
  onDeactivate = function () {},
}) {
  element.isActive = () => active;

  element.activate = function () {
    if (!active) {
      active = true;
      return onActivate(arguments);
    } else {
      return undefined;
    }
  };

  element.deactivate = function () {
    if (active) {
      active = false;
      return onDeactivate(arguments);
    } else {
      return undefined;
    }
  };

  element.toggleActive = () =>
    element.isActive() ? element.deactivate() : element.activate();
}
