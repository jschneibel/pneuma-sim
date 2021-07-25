import mixinRemoval from "./mixinRemoval.js";

// If the getters
export default function mixinProperty({
  element,
  label = "Property name",
  getProperty,
  setProperty,
  formatProperty = (value) => formattedValue,
  parseInput = (value) => parsedValue,
  triggerShow = "select",
  triggerHide = "unselect",
}) {
  // if (!Array.isArray(element.properties)) {
  //   element.properties = [];
  // }

  const { div, input } = createDomElement(label);
  updateInputElement();

  // Calling element.triggerShow (default: element.select) will show the property.
  if (typeof element[triggerShow] === "function") {
    const undboundTriggerShow = element[triggerShow];

    const boundTriggerShow = function () {
      const result = undboundTriggerShow.apply(this, arguments);
      div.style.display = "initial";

      return result;
    };

    element[triggerShow] = boundTriggerShow;
  }

  // Calling element.triggerHide (default: element.unselect) will hide the property.
  if (typeof element[triggerHide] === "function") {
    const undboundTriggerHide = element[triggerHide];

    const boundTriggerHide = function () {
      const result = undboundTriggerHide.apply(this, arguments);
      div.style.display = "none";

      return result;
    };

    element[triggerHide] = boundTriggerHide;
  }

  // Calling element.setProperty will update the DOM element.
  if (typeof element[setProperty] === "function") {
    const undboundSetProperty = element[setProperty];

    const boundSetProperty = function () {
      const result = undboundSetProperty.apply(this, arguments);
      //   const result = undboundSetProperty(...arguments);

      updateInputElement();

      return result;
    };

    element[setProperty] = boundSetProperty;
  }

  function updateInputElement() {
    const value = element[getProperty]();
    const formattedValue = formatProperty(value);
    input.value = formattedValue;
  }

  // Changing the DOM element value will call element.setProperty
  input.addEventListener("change", handleDomChange, false);

  function handleDomChange(event) {
    element[setProperty](parseInput(input.value));
  }

  //   mixinRemoval();
}

function createDomElement(labelContent) {
  const div = document.createElement("div");
  div.classList.add("property");
  div.style.display = "none";

  const label = document.createElement("span");
  label.textContent = labelContent + ":";

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.classList.add("property-input");

  const properties = document.getElementById("properties");

  div.appendChild(label);
  div.appendChild(input);
  properties.appendChild(div);

  return { div, input };
}
