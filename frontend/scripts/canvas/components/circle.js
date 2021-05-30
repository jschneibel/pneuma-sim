export function createCircle(x, y, radius) {
    console.log(`Creating Circle with radius ${radius}`);

    function getDimensions() {
        return {
            x, 
            y,
            radius
        };
    }

    function setRadius(value) {
        radius = value;
    }

    function getRadius() {
        return radius;
    }

    function draw(canvas) {
        canvas.beginPath();
        canvas.arc(x, y, radius, 0, 2*Math.PI);
        canvas.stroke();
    }

    return {
        getDimensions,
        getRadius,
        setRadius,
        draw
    };
}