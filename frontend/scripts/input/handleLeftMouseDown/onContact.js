import { getTransformedMousePosition } from "../utils/mousePosition.js";
import {
  findContactAtPosition,
  findElementsAtPosition,
} from "../utils/findAtPosition.js";
import {
  snapToRightAngle,
  snapAlongAxisToCoordinates,
} from "../utils/snapping.js";
import drawRules from "../../canvas/components/drawRules.js";
import { isPointLeftOfAB } from "../../diagram/elements/utils/geometry.js";

export default function checkAndHandleLeftMouseDownOnContact(
  invokedListenerFn,
  canvas,
  ctx,
  diagram,
  mouseDownPosition
) {
  const contactUnderMouse = findContactAtPosition(diagram, mouseDownPosition);

  if (!contactUnderMouse || contactUnderMouse.isActive()) {
    return false;
  } else {
    // If an inactive contact is under the mouse...
    const medium = contactUnderMouse.getMedium();
    const start = contactUnderMouse;

    diagram.unselectAll();

    const connection = diagram.add.connection({
      start,
      end: { getPosition: start.getPosition },
      medium,
    });

    let lastAddedVertex = start.getPosition();
    let mousePosition = mouseDownPosition;
    const snappingCoordinates = findInactiveContactsAndConnectionVertices(
      diagram,
      medium
    );

    startListenersForConnectionCreation();

    ctx.draw(diagram);
    return true;

    function startListenersForConnectionCreation() {
      // Enable listeners specific to connection creation:
      document.addEventListener(
        "mousemove",
        handleMouseMoveDuringConnectionCreation
      );
      canvas.addEventListener(
        "mousedown",
        handleLeftMouseDownDuringConnectionCreation
      );
      document.addEventListener(
        "keydown",
        handleKeyDownDuringConnectionCreation
      );

      // Disable selecting elements etc. on left down:
      canvas.removeEventListener("mousedown", invokedListenerFn);
    }

    function stopListenersForConnectionCreation() {
      // Disable listeners specific to connection creation:
      document.removeEventListener(
        "mousemove",
        handleMouseMoveDuringConnectionCreation
      );
      canvas.removeEventListener(
        "mousedown",
        handleLeftMouseDownDuringConnectionCreation
      );
      document.removeEventListener(
        "keydown",
        handleKeyDownDuringConnectionCreation
      );

      // Re-enable selecting elements etc. on left mousedown:
      canvas.addEventListener("mousedown", invokedListenerFn);
    }

    function handleMouseMoveDuringConnectionCreation(event) {
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      const { position: positionSnappedToRightAngle, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition
      );

      const { snappedPosition, snapped } = snapAlongAxisToCoordinates(
        positionSnappedToRightAngle,
        snappingCoordinates,
        axis
      );

      if (snapped) {
        drawRules(canvas, ctx, { [axis]: snappedPosition[axis] });
      }

      connection.setEnd({ getPosition: () => snappedPosition });
      // ctx.draw(diagram); // handleMouseMove.js already performs draw on each mousemove event
    }

    function handleLeftMouseDownDuringConnectionCreation(event) {
      if (event.button !== 0) return; // Only handle left mouse down.
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      const { position: positionSnappedToRightAngle, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition // mousePosition is updated in handleMouseMoveDuringConnectionCreation.
      );

      const { snappedPosition } = snapAlongAxisToCoordinates(
        positionSnappedToRightAngle,
        snappingCoordinates,
        axis
      );

      const contactAtSnappedPosition = findContactAtPosition(
        diagram,
        snappedPosition,
        medium
      );

      if (contactAtSnappedPosition && !contactAtSnappedPosition.isActive()) {
        // If there is an inactive contact at the snapped position...
        connection.setEnd(contactAtSnappedPosition);
        stopListenersForConnectionCreation();
        return;
      }

      const connectionsAtSnappedPosition = findElementsAtPosition(
        diagram,
        snappedPosition,
        "connection"
      ).filter((connection) => connection.getMedium() === medium);

      // Ignore connection that is currently being created.
      const thisConnectionIndex =
        connectionsAtSnappedPosition.indexOf(connection);
      if (thisConnectionIndex >= 0) {
        connectionsAtSnappedPosition.splice(thisConnectionIndex, 1);
      }

      if (connectionsAtSnappedPosition.length > 0) {
        // If there is a connection at the snapped position...
        const connectionAtSnappedPosition = connectionsAtSnappedPosition[0];

        const junction = connectionAtSnappedPosition.createJunction(
          diagram,
          snappedPosition
        );

        connection.setEnd(junction.getContacts()[0]); // A junction has only 1 contact.
        stopListenersForConnectionCreation();
        return;
      }

      // If the snapped position is in empty area...
      const newVertex = snappedPosition;
      const path = connection.getPath();
      const vertices = connection.getVertices();

      if (
        path.length > 2 &&
        isPointLeftOfAB(
          newVertex,
          path[path.length - 2],
          path[path.length - 3]
        ) === 0
      ) {
        // If the new vertex and the last two existing vertices (or start) are in a line,
        // then replace the last existing vertex with the new vertex (i.e. don't create
        // two adjacent path segments without an angle/corner).
        vertices[vertices.length - 1] = newVertex;
      } else {
        vertices.push(newVertex);
      }

      lastAddedVertex = newVertex;
      ctx.draw(diagram);
      handleMouseMoveDuringConnectionCreation(event);
    }

    function handleKeyDownDuringConnectionCreation(event) {
      if (
        event.key === "Delete" ||
        event.key === "Backspace" ||
        event.key === "Escape"
      ) {
        const vertices = connection.getVertices();

        if (vertices.length > 0) {
          // Remove last added vertex.
          vertices.pop();
          lastAddedVertex =
            vertices[vertices.length - 1] || start.getPosition();

          const { position: positionSnappedToRightAngle, axis } =
            snapToRightAngle(lastAddedVertex, mousePosition);

          const { snappedPosition, snapped } = snapAlongAxisToCoordinates(
            positionSnappedToRightAngle,
            snappingCoordinates,
            axis
          );

          if (snapped) {
            drawRules(canvas, ctx, { [axis]: snappedPosition[axis] });
          }

          connection.setEnd({ getPosition: () => snappedPosition });
        } else {
          // Remove connection and leave 'connection creation mode'.
          diagram.removeElement(connection);
          stopListenersForConnectionCreation();
        }
      }

      ctx.draw(diagram);
    }
  }
}

function findInactiveContactsAndConnectionVertices(diagram, medium) {
  const snappingCoordinates = [];

  // Find all inactive contacts
  diagram.getElements().forEach(function (element) {
    element.getContactsByMedium?.(medium).forEach(function (contact) {
      if (!contact.isActive()) snappingCoordinates.push(contact.getPosition());
    });
  });

  // Find all connection vertices
  diagram.getElements().forEach(function (element) {
    if (element.getType() === "connection" && element.getMedium() === medium) {
      snappingCoordinates.push(...element.getVertices());
    }
  });

  return snappingCoordinates;
}
