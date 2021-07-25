import mixinRemoval from "./mixinRemoval.js";

// If the getters
export default function mixinProperty({
  element,
  label = "Property name",
  getProperty,
  setProperty,
  formatProperty = (value) => value,
  parseInput = (value) => value,
  triggerShow = "select",
  triggerHide = "unselect",
}) {
  const readOnly = setProperty ? false : true;

  const { div, field } = createDomElement(label, readOnly);
  updateInputElement();

  // Calling element.triggerShow (default: element.select) will show the property.
  if (typeof element[triggerShow] === "function") {
    const undboundTriggerShow = element[triggerShow];

    const boundTriggerShow = function () {
      const result = undboundTriggerShow.apply(this, arguments);
      div.classList.remove("hidden");

      return result;
    };

    element[triggerShow] = boundTriggerShow;
  }

  // Calling element.triggerHide (default: element.unselect) will hide the property.
  if (typeof element[triggerHide] === "function") {
    const undboundTriggerHide = element[triggerHide];

    const boundTriggerHide = function () {
      const result = undboundTriggerHide.apply(this, arguments);
      div.classList.add("hidden");

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
    field.setValue(formattedValue);
  }

  // Changing the DOM element value will call element.setProperty
  field.addEventListener("change", handleDomChange, false);

  function handleDomChange(event) {
    element[setProperty](parseInput(field.getValue()));
  }

  //   mixinRemoval();
}

function createDomElement(labelContent, readOnly) {
  const div = document.createElement("div");
  div.classList.add("property");
  div.classList.add("hidden");

  const label = document.createElement("span");
  label.textContent = labelContent;

  let field;
  if (readOnly) {
    field = document.createElement("span");
    field.classList.add("property-span");

    field.setValue = function (value) {
      field.textContent = value;
    };
  } else {
    field = document.createElement("input");
    field.setAttribute("type", "text");
    field.classList.add("property-input");

    field.setValue = function (value) {
      field.value = value;
    };
    field.getValue = function () {
      return field.value;
    };
  }

  const properties = document.getElementById("properties");

  div.appendChild(label);
  div.appendChild(field);
  properties.appendChild(div);

  return { div, field };
}
