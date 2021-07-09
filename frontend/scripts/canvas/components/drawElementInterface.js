import { ELEMENT_INTERFACE_SIZE, 
    PNEUMATIC_INTERFACE_COLOR, 
    ELECTRIC_INTERFACE_COLOR } from '../../constants.js';

export function drawElectricInterface(canvas, position = {x, y}) {
    const circleRadius = ELEMENT_INTERFACE_SIZE/2;

    canvas.save();
    canvas.strokeStyle = ELECTRIC_INTERFACE_COLOR;
    canvas.translate(position.x, position.y);

    canvas.beginPath();
    canvas.moveTo(circleRadius, 0);
    canvas.arc(0, 0, circleRadius, 0, 2*Math.PI);
    canvas.stroke();

    canvas.restore();
}

export function drawPneumaticInterface(canvas, position = {x, y}) {
    const circleRadius = ELEMENT_INTERFACE_SIZE/2;

    canvas.save();
    canvas.strokeStyle = PNEUMATIC_INTERFACE_COLOR;
    canvas.translate(position.x, position.y);

    canvas.beginPath();
    canvas.moveTo(circleRadius, 0);
    canvas.arc(0, 0, circleRadius, 0, 2*Math.PI);
    canvas.stroke();

    canvas.restore();
}