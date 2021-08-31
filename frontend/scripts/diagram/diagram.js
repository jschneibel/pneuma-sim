/**
 * @file Provides function related to the diagram object.
 * @author Jonathan Schneibel
 * @module
 */

import { ELEMENTS } from "../constants.js";

/**
 * Creates a diagram object to manage elements.
 * diagram.add.<elementType>() adds a new element to the diagram.
 * diagram.getElements() returns all elements of the diagram.
 * diagram.getElementById(id)  returns an element with the given ID.
 * diagram.getElementByName(name) returns an element with the given name.
 * diagram.removeElement(element) removes an element from the diagram.
 * diagram.selectAll() selects all elements of the diagram.
 * diagram.unselectAll() unselects all elements of the diagram.
 * diagram.getSelectedElements() returns all selected elements of the diagram.
 *
 * @returns {object} A diagram object that can hold elements.
 */
export async function createDiagram() {
  const diagram = {};
  const elements = [];

  const elementTypes = ELEMENTS.map((element) => element.type);

  const elementImports = [];
  for (const elementType of elementTypes) {
    elementImports.push(import(`./elements/${elementType}.js`));
  }
  const elementModules = await Promise.all(elementImports);

  const createFunctions = {};
  for (const [index, elementType] of elementTypes.entries()) {
    createFunctions[elementType] = function (...args) {
      // All elements are expected to accept an 'options object'
      // as first parameter.
      if (typeof args[0] === "object") {
        args[0].diagram = diagram;
      } else {
        args[0] = { diagram };
      }
      const newElement = elementModules[index].default.apply(this, args);

      elements.unshift(newElement);
      return newElement;
    };
  }

  diagram.add = createFunctions;

  // Returns a shallow copy.
  diagram.getElements = () => [...elements];

  // Could be used to load an existing diagram.
  // function setElements(newElements) {
  //     elements = newElements;
  // }

  diagram.getElementById = function (id) {
    return elements.find((element) => element.getId() === id);
  };

  diagram.getElementByName = function (name) {
    return elements.find((element) => element.getName?.() === name);
  };

  diagram.removeElement = function (element) {
    const index = elements.indexOf(element);
    if (index >= 0) {
      elements.splice(index, 1);
      element.remove?.(diagram);
    }

    return index >= 0 ? true : false;
  };

  diagram.selectAll = function () {
    for (const element of elements) {
      element.select?.();
    }
  };

  diagram.unselectAll = function () {
    for (const element of elements) {
      element.unselect?.();
    }
  };

  diagram.getSelectedElements = function () {
    const selectedElements = [];
    for (const element of elements) {
      if (element.isSelected?.()) {
        selectedElements.push(element);
      }
    }

    return selectedElements;
  };

  return diagram;
}
