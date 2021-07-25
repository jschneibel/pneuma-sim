import mixinRemoval from "./mixinRemoval.js";

// If the getters
export default function mixinProperty({
  element,
  label = "Property name",
  getProperty = "getId",
  setProperty,
  formatProperty = (value) => formattedValue,
  parseInput = (value) => parsedValue,
  // triggerDisplay = function () {},
  // untriggerDisplay = function () {},
}) {
  // if (!Array.isArray(element.properties)) {
  //   element.properties = [];
  // }

  const inputElement = createDomElement(label);
  updateInputElement();

  // Calling element.setProperty will update the DOM element.
  if (typeof element[setProperty] === "function") {
    const undboundSetProperty = element[setProperty];

    const boundSetProperty = function () {
      console.log("boundSetProperty");
      //   const result = undboundSetProperty.apply(this, arguments);
      const result = undboundSetProperty(...arguments);

      updateInputElement();

      return result;
    };

    element[setProperty] = boundSetProperty;
  }

  function updateInputElement() {
    const value = element[getProperty]();
    const formattedValue = formatProperty(value);
    inputElement.setAttribute("value", formattedValue);
  }

  // Changing the DOM element value will call element.setProperty
  inputElement.addEventListener("change", handleDomChange, false);

  function handleDomChange(event) {
    element[setProperty](parseInput(inputElement.value));
  }

  //   mixinRemoval();
}

function createDomElement(labelContent) {
  const div = document.createElement("div");

  const label = document.createElement("span");
  label.textContent = labelContent + ":";

  const input = document.createElement("input");
  input.setAttribute("type", "text");

  const properties = document.getElementById("properties");

  div.appendChild(label);
  div.appendChild(input);
  properties.appendChild(div);

  return input;
}
