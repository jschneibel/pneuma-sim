/**
 * @file Unit tests for ./mixinActive.js.
 * @author Jonathan Schneibel
 */

import { expect } from "@jest/globals";
import { mixinActive } from "./mixinActive.js";

const element = {};
mixinActive({
  element,
  active: true,
  onActivate: (x) => x + 1,
  onDeactivate: (x) => x - 1,
});

test("mixinActive", () => {
  expect(element.active).toBeUndefined();
  expect(element.isActive()).toBe(true);

  expect(element.deactivate(3)).toBe(2);
  expect(element.deactivate(3)).toBe(undefined);
  expect(element.isActive()).toBe(false);

  expect(element.activate(3)).toBe(4);
  expect(element.activate(3)).toBe(undefined);
  expect(element.isActive()).toBe(true);

  expect(element.toggleActive(3)).toBe(2);
  expect(element.isActive()).toBe(false);

  expect(element.toggleActive(3)).toBe(4);
  expect(element.isActive()).toBe(true);
});
