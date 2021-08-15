/**
 * @file An easily accessible collection of constants that specify importnat
 * app behavior.
 * @author Jonathan Schneibel
 */

/**
 * All elements that can be added to the diagram have to registered here. The
 * 'type' has to correspond to the filename of the element in the
 * /diagram/elements folder. The 'label' is used for the buttons in the elements
 * toolbox and in the properties box. 'editorButton' has to be true if the
 * element should have its own button in the elements toolbox.
 *
 * @constant
 * @default
 * @type {Array.<{ type: string, label: string, editorButton: boolean }>}
 */
export const ELEMENTS = [
  // 'Cell' can only work with physical models that calculate voltages/currents.
  // { type: "cell", label: "Cell", editorButton: true },
  { type: "positiveTerminal", label: "Positive terminal", editorButton: true },
  { type: "negativeTerminal", label: "Negative terminal", editorButton: true },
  { type: "makeContact", label: "Make contact", editorButton: true },
  { type: "breakContact", label: "Break contact", editorButton: true },
  { type: "pushButtonMake", label: "Push-button (make)", editorButton: true },
  { type: "pushButtonBreak", label: "Push-button (break)", editorButton: true },
  {
    type: "pushButtonToggle",
    label: "Push-button (toggle)",
    editorButton: true,
  },
  { type: "relay", label: "Relay", editorButton: true },
  { type: "valveSolenoid", label: "Valve solenoid", editorButton: true },
  {
    type: "compressedAirSupply",
    label: "Compressed air supply",
    editorButton: true,
  },
  {
    type: "exhaust",
    label: "Exhaust",
    editorButton: true,
  },
  {
    type: "solenoidValve32",
    label: "3/2-way solenoid valve",
    editorButton: true,
  },
  { type: "cylinder", label: "Cylinder", editorButton: true },
  { type: "connection", label: "Connection (ideal)", editorButton: false },
  { type: "junction", label: "Junction", editorButton: false },
];

/**
 * Describes how much time in milliseconds should pass in the simulation when
 * the user presses 'STEP'.
 *
 * @constant
 * @default
 * @type {number}
 */
export const MANUAL_TIMESTEP_DURATION = 200;

/**
 * Geometric tolerance in pixels for small distances before they are considered
 * to be 0. If a distance is shorter than GEOMETRIC_TOLERANCE, it will be
 * treated as zero distance (e.g. to check if two points are in the same
 * location or not).
 *
 * @constant
 * @default
 * @type {number}
 */
export const GEOMETRIC_TOLERANCE = 0.1;

/**
 * Geometric tolerance in radians for small angles before they are considered to
 * be 0. If an angle is smaller than GEOMETRIC_ANGLE_TOLERANCE, it will be
 * treated as an angle of 0 (e.g. to check if two lines are parellel or intersecting).
 *
 * @constant
 * @default
 * @type {number}
 */
export const GEOMETRIC_ANGLE_TOLERANCE = 0.001;

export const ZOOM_SPEED = 1.1;

export const NEW_ELEMENT_DEFAULT_POSITION = { x: 300, y: 300 };

export const SNAPPING_TOLERANCE = 10;

/**
 * Color of the rules that show when snapping, e.g. during wire creation.
 *
 * @constant
 * @default
 * @type {string}
 */
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
