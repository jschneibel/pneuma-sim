export default function mixinActive({
  element = {},
  active = false,
  onActivate = function () {},
  onDeactivate = function () {},
}) {
  element.isActive = () => active;

  element.activate = function () {
    active = true;
    return onActivate(arguments);
  };

  element.deactivate = function () {
    active = false;
    return onDeactivate(arguments);
  };

  element.toggleActive = () =>
    element.isActive() ? element.deactivate() : element.activate();
}
