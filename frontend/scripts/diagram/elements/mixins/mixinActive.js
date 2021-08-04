export default function mixinActive({
  element = {},
  active = false,
  activate = function () {},
  deactivate = function () {},
}) {
  element.isActive = () => active;

  element.activate = function () {
    active = true;
    return activate(arguments);
  };

  element.deactivate = function () {
    active = false;
    return deactivate(arguments);
  };

  element.toggleActive = () =>
    element.isActive() ? element.deactivate() : element.activate();
}
