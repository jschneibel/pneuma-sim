import drawRules from "../canvas/components/drawRules.js";
import { SNAPPING_TOLERANCE } from "../constants.js";

export function getTransformedMousePosition(event, canvas, ctx) {
  // const canvasElement = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const untransformedX = event.clientX - rect.left;
  const untransformedY = event.clientY - rect.top;

  // a: horizontal scaling
  // d: vertical scaling
  // e: horizontal translation
  // f: vertical translation
  const { a, d, e, f } = ctx.getTransform();

  const transformedX = (untransformedX - e) / a;
  const transformedY = (untransformedY - f) / d;

  return { x: transformedX, y: transformedY };
}

export function findElementAtPosition(diagram, position) {
  let elementAtPosition;

  diagram.getElements().some(function (element) {
    if (element.isPositionWithinBoundingArea?.(position)) {
      elementAtPosition = element;
      return true;
    }
    return false;
  });

  return elementAtPosition;
}

export function findElectricContactAtPosition(diagram, position) {
  let electricContactAtPosition;

  diagram.getElements().some(function (element) {
    if (typeof element.getElectricContacts === "function") {
      return element.getElectricContacts().some(function (electricContact) {
        if (electricContact.isPositionWithinContact(position)) {
          electricContactAtPosition = electricContact;
          return true;
        }
        return false;
      });
    }
  });

  return electricContactAtPosition;
}

export function findPneumaticContactAtPosition(diagram, position) {
  let pneumaticContactAtPosition;

  diagram.getElements().some(function (element) {
    if (typeof element.getPneumaticContacts === "function") {
      return element.getPneumaticContacts().some(function (pneumaticContact) {
        if (pneumaticContact.isPositionWithinContact(position)) {
          pneumaticContactAtPosition = pneumaticContact;
          return true;
        }
        return false;
      });
    }
  });

  return pneumaticContactAtPosition;
}

export function snapToRightAngle(a, b) {
  const delta = {
    x: b.x - a.x,
    y: b.y - a.y,
  };

  if (Math.abs(delta.x) > Math.abs(delta.y)) {
    return {
      position: { x: b.x, y: a.y },
      axis: "x",
    };
  } else {
    return {
      position: { x: a.x, y: b.y },
      axis: "y",
    };
  }
}

export function snapAlongAxisToCoordinates(
  fromPosition = {},
  toCoordinates = [],
  axis,
  tolerance = SNAPPING_TOLERANCE
) {
  const snappedPosition = { ...fromPosition };
  let snapped = false;

  if (fromPosition[axis]) {
    // sort toCoordinates by smallest delta along axis to given fromPosition
    toCoordinates.sort(function (a, b) {
      const deltaA = Math.abs(a[axis] - fromPosition[axis]);
      const deltaB = Math.abs(b[axis] - fromPosition[axis]);
      return Math.sign(deltaA - deltaB);
    });

    // if the first fromCoordinate has a delta to given fromPosition smaller than tolerance
    if (Math.abs(toCoordinates[0]?.[axis] - fromPosition[axis]) < tolerance) {
      // then snap to that coordinate along axis
      snappedPosition[axis] = toCoordinates[0][axis];
      snapped = true;
    } else {
      // else don't snap
      snappedPosition[axis] = fromPosition[axis];
      snapped = false;
    }
  }

  return { snappedPosition, snapped };
}
