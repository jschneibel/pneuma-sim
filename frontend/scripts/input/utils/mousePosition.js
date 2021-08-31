/**
 * @file Utility functions related to the mouse position.
 * @author Jonathan Schneibel
 * @module
 */

/**
 * Transforms a mouse position from an Event to the coordinate system
 * of a canvas element. Returns a new obejct.
 *
 * @param {Event} event The event that provides the original mouse position.
 * @param {object} canvas The canvas to relate the mouse position to.
 * @param {object} ctx The canvas context to relate the mouse position to.
 * @returns {{x: number, y: number}} The transformed mouse position.
 */
export function getTransformedMousePosition(event, canvas, ctx) {
  if (!event.clientX || !event.clientY) return null;

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
