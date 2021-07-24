import { ELEMENT_CONTACT_SIZE } from "../../constants.js";

import createBasicElement from "./utils/basic.js";
import mixinPosition from "./mixins/mixinPosition.js";
import mixinDimensions from "./mixins/mixinDimensions.js";
import mixinSelection from "./mixins/mixinSelection.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinContacts from "./mixins/mixinContacts.js";
import mixinBoundingArea from "./mixins/mixinBoundingArea.js";

export default function createWireJunction({ position = { x: 0, y: 0 } }) {
  const wireJunction = createBasicElement("wireJunction");

  mixinPosition({
    element: wireJunction,
    position,
  });

  mixinDimensions({
    element: wireJunction,
    dimensions: { width: ELEMENT_CONTACT_SIZE, height: ELEMENT_CONTACT_SIZE },
  });

  const customArea = [
    { x: -ELEMENT_CONTACT_SIZE / 2, y: -ELEMENT_CONTACT_SIZE / 2 },
    { x: ELEMENT_CONTACT_SIZE / 2, y: -ELEMENT_CONTACT_SIZE / 2 },
    { x: ELEMENT_CONTACT_SIZE / 2, y: ELEMENT_CONTACT_SIZE / 2 },
    { x: -ELEMENT_CONTACT_SIZE / 2, y: ELEMENT_CONTACT_SIZE / 2 },
  ];

  mixinBoundingArea({
    element: wireJunction,
    getOrigin: wireJunction.getPosition,
    getCustomArea: () => customArea,
  });

  mixinDrawing({
    element: wireJunction,
    getOrigin: wireJunction.getPosition,
    draw: function () {}, // The only drawing is created by mixinContacts.
  });

  // in element-local coordinates
  mixinContacts({
    element: wireJunction,
    getElementPosition: wireJunction.getPosition,
    electricContactPositions: [{ x: 0, y: 0 }],
  });

  mixinSelection({
    element: wireJunction,
    getOrigin: wireJunction.getPosition,
    getSelectionShape: wireJunction.getBoundingArea,
    selected: true,
  });

  // mixinRemoval({
  //   element: wireJunction,
  //   remove: () => {},
  // });

  // The wireJunction removes itself and merges the remaining
  // connections, if there are exactly two connections left.
  const junctionContact = wireJunction.getElectricContacts()[0];
  const mixedinRemoveConnection = junctionContact.removeConnection;
  junctionContact.removeConnection = function (diagram, connection) {
    const connections = mixedinRemoveConnection(diagram, connection);

    if (connections.length === 2) {
      mergeConnectionsAndRemoveJunction(diagram, connections);
    }

    return connections;
  };

  function mergeConnectionsAndRemoveJunction(diagram, connections) {
    // connections is only a shallow copy. The real connections are
    // removed automatically when the junction is removed at the end.
    const oldWire1 = connections.pop();
    const oldWire2 = connections.pop();

    let mergedWireStart;
    let mergedWireEnd;
    let mergedWirePath = [];

    if (oldWire1.getStart() === junctionContact) {
      mergedWireStart = oldWire1.getEnd();
      mergedWirePath.push(...[...oldWire1.getVertices()].reverse());
    } else {
      mergedWireStart = oldWire1.getStart();
      mergedWirePath.push(...oldWire1.getVertices());
    }
    mergedWirePath.unshift(mergedWireStart.getPosition());

    // Insert a vertex at this index if the junction was at a corner.
    const junctionVertexIndex = mergedWirePath.length;

    if (oldWire2.getStart() === junctionContact) {
      mergedWireEnd = oldWire2.getEnd();
      mergedWirePath.push(...oldWire2.getVertices());
    } else {
      mergedWireEnd = oldWire2.getStart();
      mergedWirePath.push(...[...oldWire2.getVertices()].reverse());
    }
    mergedWirePath.push(mergedWireEnd.getPosition());

    if (
      mergedWirePath[junctionVertexIndex - 1].x !==
        mergedWirePath[junctionVertexIndex].x &&
      mergedWirePath[junctionVertexIndex - 1].y !==
        mergedWirePath[junctionVertexIndex].y
    ) {
      // If junction was at a corner, then insert a vertex in its position.
      mergedWirePath.splice(
        junctionVertexIndex,
        0,
        junctionContact.getPosition()
      );
    }

    diagram.add["wire"]({
      start: mergedWireStart,
      end: mergedWireEnd,
      vertices: mergedWirePath.slice(1, -1),
    });

    wireJunction.remove(diagram); // Also removes connected connections (oldWire1, oldWire2).
  }

  return wireJunction;
}
