export function createSelection(width, height) {
    console.log(`Creating Circle with radius ${radius}`);

    const padding = 10;
    // let width = width;
    // let height = height;

    // function getDimensions() {
    //     return {
    //         x, 
    //         y
    //     };
    // }

    // function setRadius(value) {
    //     radius = value;
    // }

    // function getRadius() {
    //     return radius;
    // }

    function draw(canvas) {
        canvas.beginPath();
        canvas.arc(x, y, radius, 0, 2*Math.PI);
        canvas.stroke();
    }

    return {
        // getDimensions,
        // getRadius,
        // setRadius,
        draw
    };
}