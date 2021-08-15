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
