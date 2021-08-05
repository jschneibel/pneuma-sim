export default function mixinSimulation({
  element = {},
  powered = false,
  checkIfPowered = () =>
    element.getCurrent?.() > 0 || element.getPressure?.() > 0,
  poweredAction = function (timestep) {},
  unpoweredAction = function (timestep) {},
  switchPowerOnAction = function () {},
  switchPowerOffAction = function () {},
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
}
