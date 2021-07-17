export default function mixinPosition({
    element = {},
    position = {x: 0, y: 0}
}) {
    let x = position.x;
    let y = position.y;

    element.getPosition = function() {
        return {x, y};
    }

    element.setPosition = function(position = {x, y}) {
        x = position.x;
        y = position.y;
    }
}