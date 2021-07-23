import { SNAPPING_TOLERANCE } from "../../constants.js";

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
