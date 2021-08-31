/**
 * @file Mixin for elements to perform actions when they are, for example, powered or clicked during simulation.
 * @author Jonathan Schneibel
 * @module
 */

export function mixinSimulation({
  element,
  powered = false,
  checkIfPowered = () =>
    element.getCurrent?.() > 0 || element.getPressure?.() > 0,
  poweredAction = function (timestep) {},
  unpoweredAction = function (timestep) {},
  switchPowerOnAction = function () {},
  switchPowerOffAction = function () {},
  mouseDownAction = function () {
    console.log(`Element ID: ${element.getId?.()}`);
  },
  mouseUpAction = function () {},
  reset = function () {},
}) {
  element.isPowered = () => powered;

  element.simulate = function (timestep) {
    const previousPowered = powered;
    powered = checkIfPowered();

    if (!previousPowered && !powered) {
      unpoweredAction(timestep);
    } else if (previousPowered && powered) {
      poweredAction(timestep);
    } else if (!previousPowered && powered) {
      switchPowerOnAction();
    } else if (previousPowered && !powered) {
      switchPowerOffAction();
    }
  };

  element.mouseDown = mouseDownAction;
  element.mouseUp = mouseUpAction;
  element.reset = reset;
}
