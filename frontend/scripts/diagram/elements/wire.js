import mixinConnection from "./mixins/mixinConnection.js";
import { ELECTRIC_CONTACT_COLOR } from "../../constants.js";

// Every wire always has one startContact and one endContact.
// If the element holding the startContact or endContact is removed,
// then the connected wire also is removed.
export default function createWire({
  start = { getPosition: function () {} },
  end = { getPosition: function () {} },
  vertices = [],
}) {
  const wire = {};
  const type = "wire";

  wire.getType = () => type;

  mixinConnection({
    element: wire,
    start,
    end,
    vertices,
    color: ELECTRIC_CONTACT_COLOR,
  });

  return wire;
}
