import { SELECTION_BOX_COLOR, 
    SELECTION_BOX_PADDING, 
    SELECTION_BOX_SQUARE_LENGTH } from '../../constants.js';

export function drawSelectionBox(canvas, x, y, width, height) {
    const padding = SELECTION_BOX_PADDING;
    const cornerSquareLength = SELECTION_BOX_SQUARE_LENGTH;

    width = width+2*padding;
    height = height+2*padding;

    canvas.save();
    canvas.strokeStyle = SELECTION_BOX_COLOR;
    canvas.translate(x-padding, y-padding);

    canvas.beginPath();
    
    canvas.moveTo(0, 0);
    canvas.lineTo(width, 0);
    canvas.lineTo(width, height);
    canvas.lineTo(0, height);
    canvas.lineTo(0, 0);

    drawCenteredSquare(canvas, 0, 0, cornerSquareLength);
    drawCenteredSquare(canvas, width, 0, cornerSquareLength);
    drawCenteredSquare(canvas, width, height, cornerSquareLength);
    drawCenteredSquare(canvas, 0, height, cornerSquareLength);

    canvas.stroke();

    canvas.restore();
}

function drawCenteredSquare(canvas, x, y, length) {
    canvas.save();
    canvas.translate(x-length/2, y-length/2);

    canvas.moveTo(0, 0);
    canvas.lineTo(length, 0);
    canvas.lineTo(length, length);
    canvas.lineTo(0, length);
    canvas.lineTo(0, 0);

    canvas.restore();
}