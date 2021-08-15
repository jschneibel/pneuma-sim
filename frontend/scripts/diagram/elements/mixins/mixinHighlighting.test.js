/**
 * @file Unit tests for ./mixinHighlighting.js.
 * @author Jonathan Schneibel
 */

import { expect } from "@jest/globals";
import { mixinHighlighting } from "./mixinHighlighting.js";

const element = {};
mixinHighlighting({
  element,
  highlighted: true,
});

test("mixinHighlighted", () => {
  expect(element.highlighted).toBeUndefined();
  expect(element.isHighlighted()).toBe(true);

  element.unhighlight();
  expect(element.isHighlighted()).toBe(false);

  element.highlight();
  expect(element.isHighlighted()).toBe(true);
});
