/**
 * @file Unit tests for ./mixinPosition.js.
 * @author Jonathan Schneibel
 */

import { expect } from "@jest/globals";
import { mixinPosition } from "./mixinPosition.js";

const element = {};
mixinPosition({
  element,
  position: { x: -20, y: 30 },
});

test("mixinPosition", () => {
  expect(element.getPosition()).toStrictEqual({ x: -20, y: 30 });

  const newPosition = { x: 10, y: -40 };
  element.setPosition(newPosition);
  expect(element.getPosition()).toStrictEqual(newPosition);

  newPosition.x = 0;
  newPosition.y = undefined;
  expect(element.getPosition()).toStrictEqual({ x: 10, y: -40 });
});
