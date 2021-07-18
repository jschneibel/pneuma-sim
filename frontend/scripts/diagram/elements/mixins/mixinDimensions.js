export default function mixinDimensions({
  element = {},
  dimensions = { width, height },
}) {
  let width = dimensions.width;
  let height = dimensions.height;

  element.getDimensions = function () {
    return { width, height };
  };
}
