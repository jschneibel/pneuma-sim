/**
 * @file Unit tests for ./mixinRemoval.js.
 * @author Jonathan Schneibel
 */

import { expect } from "@jest/globals";
import { mixinRemoval } from "./mixinRemoval.js";

test("mixinRemoval", () => {
  const mockDiagram = {
    removed: false,
    removeElement: function (element) {
      if (!mockDiagram.removed) {
        mockDiagram.removed = true;
        element.remove?.(mockDiagram);
      } else {
        mockDiagram.removed = true;
      }
    },
  };

  const mockRemove1 = jest.fn(() => {});
  const mockRemove2 = jest.fn(() => {});

  const element = {};

  mixinRemoval({
    element,
    remove: mockRemove1,
  });

  mixinRemoval({
    element,
    remove: mockRemove2,
  });

  mockDiagram.removeElement(element);
  element.remove(mockDiagram);
  expect(mockRemove1.mock.calls.length).toBe(2);
  expect(mockRemove2.mock.calls.length).toBe(2);
});
