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
      elements.unshift(elementModules[index].default(...args));
    };
  });

  function getElements() {
    return elements;
  }

  // function setElements(newElements) {
  //     elements = newElements;
  // }

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
    getSelectedElements,
    selectAll,
    unselectAll,
  };
}
