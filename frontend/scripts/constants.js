// 'type' has to correspond to the filename in the elements folder.
export const ELEMENTS = [
  // { type: "cell", label: "Cell", editorButton: true },
  { type: "positiveTerminal", label: "Positive terminal", editorButton: true },
  { type: "negativeTerminal", label: "Negative terminal", editorButton: true },
  { type: "makeContact", label: "Make contact", editorButton: true },
  { type: "breakContact", label: "Break contact", editorButton: true },
  { type: "valveSolenoid", label: "Valve solenoid", editorButton: true },
  { type: "cylinder", label: "Cylinder", editorButton: true },
  { type: "connection", label: "Connection", editorButton: false },
  { type: "junction", label: "Junction", editorButton: false },
];

export const GEOMETRIC_TOLERANCE = 0.1;
export const GEOMETRIC_ANGLE_TOLERANCE = 0.001; // In Radians.

export const ZOOM_SPEED = 1.1;

export const NEW_ELEMENT_DEFAUL_POSITION = { x: 300, y: 250 };

export const SNAPPING_TOLERANCE = 10;

export const RULES_COLOR = "#456";

export const BOUNDING_AREA_PADDING = 5;

export const SELECTION_BOX_COLOR = "#5ab";
export const SELECTION_BOX_SQUARE_LENGTH = 5;

export const CONTACT_SIZE = 6;
export const CONTACT_LINE_WIDTH = 1.65;

export const ELECTRIC_CONTACT_COLOR = "#c66";
export const PNEUMATIC_CONTACT_COLOR = "#6c6";

export const ELECTRIC_CONNECTION_COLOR = ELECTRIC_CONTACT_COLOR;
export const PNEUMATIC_CONNECTION_COLOR = PNEUMATIC_CONTACT_COLOR;
