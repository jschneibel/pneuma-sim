// TODO: Setting a property (e.g. position) should
// immediately update the drawing, not only after
// the next mousemove (or any other) event.
export function mixinProperty({
  element,
  label = "Property name",
  getProperty,
  setProperty,
  formatProperty = (value) => value,
  parseInput = (value) => value,
  displayTriggers = ["select"],
  hideTriggers = ["unselect", "remove"],
}) {
  const readOnly = setProperty ? false : true;

  const { div, field } = createDomElement(label, readOnly);
  updateInputElement();

  // Calling element[displayTriggers[i]]() will show the property
  // (default: element.select()).
  for (const displayTrigger of displayTriggers) {
    if (typeof element[displayTrigger] === "function") {
      const unboundDisplayTrigger = element[displayTrigger];

      element[displayTrigger] = function () {
        const result = unboundDisplayTrigger.apply(this, arguments);
        div.classList.remove("hidden");

        return result;
      };
    }
  }

  // Calling element[hideTriggers[i]]() will hide the property
  // (default: element.unselect() and element.remove()).
  for (const hideTrigger of hideTriggers) {
    if (typeof element[hideTrigger] === "function") {
      const unboundHideTrigger = element[hideTrigger];

      element[hideTrigger] = function () {
        const result = unboundHideTrigger.apply(this, arguments);
        div.classList.add("hidden");

        return result;
      };
    }
  }

  // Calling element.setProperty will update the DOM element.
  if (typeof element[setProperty] === "function") {
    const undboundSetProperty = element[setProperty];

    const boundSetProperty = function () {
      const result = undboundSetProperty.apply(this, arguments);

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
