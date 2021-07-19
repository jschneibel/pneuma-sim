export async function createDiagram() {
  const elements = [];

  const elementTypes = ["switch", "cylinder", "wire"];

  const elementImports = [];
  for (const elementType of elementTypes) {
    elementImports.push(import(`./elements/${elementType}.js`));
  }
  const elementModules = await Promise.all(elementImports);

  const createFunctions = {};
  elementTypes.forEach(function (elementType, index) {
    createFunctions[elementType] = function (...args) {
      const newElement = elementModules[index].default(...args);
      elements.unshift(newElement);
      return newElement;
    };
  });

  function getElements() {
    return elements;
  }

  // function setElements(newElements) {
  //     elements = newElements;
  // }

  function deleteElement(element) {
    elements.splice(elements.indexOf(element), 1);

    return elements;
  }

  function selectAll() {
    elements.forEach((element) => {
      element.select?.();
    });
  }

  function unselectAll() {
    elements.forEach((element) => {
      element.unselect?.();
    });
  }

  function getSelectedElements() {
    const selectedElements = [];
    elements.forEach((element) => {
      if (element.isSelected?.()) {
        selectedElements.push(element);
      }
    });

    return selectedElements;
  }

  return {
    add: createFunctions,
    getElements,
    deleteElement,
    getSelectedElements,
    selectAll,
    unselectAll,
  };
}
