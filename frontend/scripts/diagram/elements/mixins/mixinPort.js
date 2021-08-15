import { mixinRemoval } from "./mixinRemoval.js";

export function mixinPort({
  port,
  connectedPorts = [], // Air flows freely between these ports.
  isExhaust = false, // Air flows from this port directly out of the system if true.
}) {
  let pressure = 0;

  port.getPressure = () => pressure;
  port.setPressure = (value) => (pressure = value);

  port.getConnectedPorts = () => [...connectedPorts];

  port.connectToPort = function (connectingPort) {
    if (
      connectedPorts.indexOf(connectingPort) === -1 &&
      connectingPort !== port
    ) {
      connectedPorts.push(connectingPort);
      connectingPort.connectToPort(port);
    }
  };

  port.disconnectFromPort = function (disconnectingPort) {
    if (connectedPorts.indexOf(disconnectingPort) > -1) {
      connectedPorts = connectedPorts.filter(
        (port) => port !== disconnectingPort
      );
      disconnectingPort.disconnectFromPort(port);
    }
  };

  const previousAddConnection = port.addConnection;
  port.addConnection = function (connection) {
    connection.getStart().connectToPort?.(port);
    connection.getEnd().connectToPort?.(port);
    return previousAddConnection(connection);
  };

  const previousRemoveConnection = port.removeConnection;
  port.removeConnection = function (diagram, connection) {
    connection.getStart?.().disconnectFromPort?.(port);
    connection.getEnd?.().disconnectFromPort?.(port);
    return previousRemoveConnection(diagram, connection);
  };

  port.isExhaust = () => isExhaust;
  port.setExhaust = (value) => (isExhaust = value);

  // Flow is defined as flow == flow_in == flow_out.
  let flow = 0;

  port.getFlow = () => flow;

  port.setFlow = function (value) {
    flow = value;

    return flow;
  };

  mixinRemoval({
    element: port,
    remove: function () {
      for (const connectedPort of port.getConnectedPorts()) {
        port.disconnectFromPort(connectToPort);
      }
    },
  });
}
