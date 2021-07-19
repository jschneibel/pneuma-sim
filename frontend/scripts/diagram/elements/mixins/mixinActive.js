export default function mixinActive({ element = {}, active = false }) {
  element.isActive = () => active;

  element.activate = () => (active = true);

  element.deactivate = () => (active = false);
}
