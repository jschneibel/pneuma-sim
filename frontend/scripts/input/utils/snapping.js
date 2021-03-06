/**
 * @file Provides utility functions for snapping mouse coordinates.
 * @author Jonathan Schneibel
 * @module
 */

import { SNAPPING_TOLERANCE } from "../../constants.js";

/**
 * Snaps position b of a line starting at position a
 * and ending at position b in such a way
 * that is becomes vertical or horizontal.
 * A new object is returned.
 *
 * @param {{ x: number, y: number }} a
 * @param {{ x: number, y: number }} b
 * @returns {{ position: {x: number, y: number}, axis: string}} The snapped position along with the axis ('x' or 'y') that has been snapped.
 */
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

/**
 * Snaps the coordinate of fromPosition given in 'axis' to the closest of the positions
 * given in toCoordinates, if the distance is less than the tolerance value.
 * Returns a new position.
 *
 * @param {{x: number, y: number}} fromPosition The position to snap.
 * @param {Array.<{x: number, y: number}>} toCoordinates The positions to snap to.
 * @param {string} axis The snapping direction ('x' or 'y').
 * @param {number} tolerance The maximum distance between coordinates for snapping.
 * @returns {{snappedPosition: {x: number, y: number}, snapped: boolean}} Returns the snapped position as well as information on whether the position snapped or not.
 */
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
