import { CONTACT_SIZE } from "../../constants.js";

import createBasicElement from "./utils/basicElement.js";
import mixinPosition from "./mixins/mixinPosition.js";
import mixinDimensions from "./mixins/mixinDimensions.js";
import mixinSelection from "./mixins/mixinSelection.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinContacts from "./mixins/mixinContacts.js";
import mixinBoundingArea from "./mixins/mixinBoundingArea.js";
import mixinMedium from "./mixins/mixinMedium.js";

// TODO: Make sure junctions always get drawn on top of connections.
export default function createJunction({ position = { x: 0, y: 0 }, medium }) {
  const junction = createBasicElement("junction");

  mixinMedium({
    element: junction,
    medium,
  });

  mixinPosition({
    element: junction,
    position,
  });

  mixinDimensions({
    element: junction,
    dimensions: { width: CONTACT_SIZE, height: CONTACT_SIZE },
  });

  // TODO: Mix boundingArea into contact.
  const customArea = [
    { x: -CONTACT_SIZE / 2, y: -CONTACT_SIZE / 2 },
    { x: CONTACT_SIZE / 2, y: -CONTACT_SIZE / 2 },
    { x: CONTACT_SIZE / 2, y: CONTACT_SIZE / 2 },
    { x: -CONTACT_SIZE / 2, y: CONTACT_SIZE / 2 },
  ];

  mixinBoundingArea({
    element: junction,
    getOrigin: junction.getPosition,
    getCustomArea: () => customArea,
  });

  mixinDrawing({
    element: junction,
    getOrigin: junction.getPosition,
    draw: function () {}, // The only drawing is created by mixinContacts.
  });

  // in element-local coordinates
  mixinContacts({
    element: junction,
    getElementPosition: junction.getPosition,
    contactDefinitions: [{ x: 0, y: 0, medium }],
  });

  mixinSelection({
    element: junction,
    getOrigin: junction.getPosition,
    getSelectionShape: junction.getBoundingArea,
    selected: true,
  });

  // The junction removes itself and merges the remaining
  // connections, if there are exactly two connections left.
  const junctionContact = junction.getContactsByMedium(medium)[0];
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
    const oldConnection1 = connections.pop();
    const oldConnection2 = connections.pop();

    let mergedConnectionStart;
    let mergedConnectionEnd;
    let mergedConnectionPath = [];

    if (oldConnection1.getStart() === junctionContact) {
      mergedConnectionStart = oldConnection1.getEnd();
      mergedConnectionPath.push(...[...oldConnection1.getVertices()].reverse());
    } else {
      mergedConnectionStart = oldConnection1.getStart();
      mergedConnectionPath.push(...oldConnection1.getVertices());
    }
    mergedConnectionPath.unshift(mergedConnectionStart.getPosition());

    // Insert a vertex at this index if the junction was at a corner.
    const junctionVertexIndex = mergedConnectionPath.length;

    if (oldConnection2.getStart() === junctionContact) {
      mergedConnectionEnd = oldConnection2.getEnd();
      mergedConnectionPath.push(...oldConnection2.getVertices());
    } else {
      mergedConnectionEnd = oldConnection2.getStart();
      mergedConnectionPath.push(...[...oldConnection2.getVertices()].reverse());
    }
    mergedConnectionPath.push(mergedConnectionEnd.getPosition());

    if (
      mergedConnectionPath[junctionVertexIndex - 1].x !==
        mergedConnectionPath[junctionVertexIndex].x &&
      mergedConnectionPath[junctionVertexIndex - 1].y !==
        mergedConnectionPath[junctionVertexIndex].y
    ) {
      // If junction was at a corner, then insert a vertex in its position.
      mergedConnectionPath.splice(
        junctionVertexIndex,
        0,
        junctionContact.getPosition()
      );
    }

    diagram.add.connection({
      start: mergedConnectionStart,
      end: mergedConnectionEnd,
      vertices: mergedConnectionPath.slice(1, -1),
      medium,
    });

    junction.remove(diagram); // Also removes connected connections (oldConnection1, oldConnection2).
  }

  return junction;
}
