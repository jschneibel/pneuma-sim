export async function createDiagram() {
  const diagram = {};
  const elements = [];

  const elementTypes = ["cylinder", "switch", "connection", "junction"];

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

  diagram.add = createFunctions;

  // Returns a shallow copy.
  diagram.getElements = () => [...elements];

  // Could be used to load an existing diagram.
  // function setElements(newElements) {
  //     elements = newElements;
  // }

  diagram.removeElement = function (element) {
    const index = elements.indexOf(element);
    if (index >= 0) {
      elements.splice(index, 1);
      element.remove?.(diagram);
    }

    return index >= 0 ? true : false;
  };

  diagram.selectAll = function () {
    elements.forEach((element) => {
      element.select?.();
    });
  };

  diagram.unselectAll = function () {
    elements.forEach((element) => {
      element.unselect?.();
    });
  };

  diagram.getSelectedElements = function () {
    const selectedElements = [];
    elements.forEach((element) => {
      if (element.isSelected?.()) {
        selectedElements.push(element);
      }
    });

    return selectedElements;
  };

  return diagram;
}
