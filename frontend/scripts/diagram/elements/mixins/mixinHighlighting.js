export default function mixinHighlighting({ element, highlighted = false }) {
  element.isHighlighted = () => highlighted;

  element.highlight = () => (highlighted = true);

  element.unhighlight = () => (highlighted = false);
}
