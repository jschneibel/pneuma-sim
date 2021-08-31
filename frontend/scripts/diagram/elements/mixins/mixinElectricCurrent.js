/**
 * @file Mixin for elements to be conductive.
 * @author Jonathan Schneibel
 * @module
 */

// If an element has a resistance and resistance is less than Infinity,
// then current can flow through the element (current > 0).
export function mixinElectricCurrent({ element, resistance = 0 }) {
  // TODO: Current should have a direction.
  // Current is defined as current == current_in == current_out
  // in line with Kirchhoff's Current Law. This definition is
  // especially useful for wire junctions.
  let current = 0;

  // TODO: Simulation with calculated voltages and currents
  // conforming to Ohm's Law.
  let voltage = 0;

  // [Ohm]
  element.getResistance = () => resistance;

  element.setResistance = (value) => (resistance = value);

  // [Volt]
  element.getVoltage = () => voltage;

  // NOTE: Current is Infinity if resistance is zero,
  // and current is zero if resistance is Infinity.
  element.setVoltage = function (value) {
    voltage = value;

    current = voltage / resistance;
    return current;
  };

  // [Ampere]
  element.getCurrent = () => current;

  // NOTE: Voltage is zero if resistance is zero,
  // and voltage is Infinity if resistance is Infinity.
  element.setCurrent = function (value) {
    current = value;

    voltage = resistance * current;
    return voltage;
  };
}
