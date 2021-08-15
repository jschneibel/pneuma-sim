export function mixinMedium({ element, medium = "electric" }) {
  element.getMedium = () => medium;
}
