import { SELECTION_BOX_PADDING} from '../../constants.js';
import { drawSelectionBox } from '../../canvas/components/drawSelectionBox.js';
import { drawElectricInterface, drawPneumaticInterface } from '../../canvas/components/drawElementInterface.js';

export default function createCylinder() {
    const width = 120
    const height = width/4;

    // in local coordinates
    const pneumaticInterfaces = [
        {x: 10, y: 0},
        {x: 50, y: height}
    ];

    // in local coordinates
    const electricInterfaces = [
        {x: 0, y: 20},
        {x: 50, y: 0}
    ];

    let x = 20;
    let y = 20;

    let selected = true;

    function getPosition() {
        return {x, y};
    }

    function setPosition(position = {x, y}) {
        x = position.x;
        y = position.y;
    }

    function getDimensions() {
        return {width, height};
    }

    // in global coordinates
    function getPneumaticInterfaces() {
        const globalPneumaticInterfaces = [];
        pneumaticInterfaces.forEach(function(relativePosition) {
            globalPneumaticInterfaces.push({
                x: x + relativePosition.x,
                y: y + relativePosition.y
            });
        });

        return globalPneumaticInterfaces;
    }

    function getElectricInterfaces() {
        return electricInterfaces;
    }

    function select() {
        selected = true;
    }

    function unselect() {
        selected = false;
    }

    function isSelected() {
        return selected;
    }

    function isPositionWithinSelectionBox(position = {x, y}) {
        return position.x >= x - SELECTION_BOX_PADDING
            && position.x <= x + width + SELECTION_BOX_PADDING
            && position.y >= y - SELECTION_BOX_PADDING
            && position.y <= y + height + SELECTION_BOX_PADDING;
    }

    function draw(canvas) {
        const rodWidth = height/6;
        const hoops = 4;
        let distance = width/6;

        canvas.save();
        canvas.translate(x, y);
        canvas.beginPath();
        
        // outer box
        canvas.moveTo(0, 0);
        canvas.lineTo(width, 0);
        canvas.lineTo(width, (height-rodWidth)/2);
        canvas.moveTo(width, (height-rodWidth)/2+rodWidth);
        canvas.lineTo(width, height);
        canvas.lineTo(0, height);
        canvas.lineTo(0, 0);

        // rod and plate
        canvas.moveTo(distance, 0);
        canvas.lineTo(distance, height);
        canvas.moveTo(distance+rodWidth, 0);
        canvas.lineTo(distance+rodWidth, height);
        canvas.moveTo(distance+rodWidth, (height-rodWidth)/2);
        canvas.lineTo(width+distance, (height-rodWidth)/2);
        canvas.moveTo(distance+rodWidth, (height-rodWidth)/2+rodWidth);
        canvas.lineTo(width+distance, (height-rodWidth)/2+rodWidth);

        // spring
        let startX = distance+rodWidth;
        let hoopWidth = (width-startX)/hoops;
        for (let i = 0; i < hoops; i++) {
            canvas.moveTo(startX, height);
            canvas.lineTo(startX+hoopWidth/2, 0);
            canvas.lineTo(startX+hoopWidth*(1/2+(height-rodWidth)/2/height/2), (height-rodWidth)/2);
            canvas.moveTo(startX+hoopWidth*(1/2+((height-rodWidth)/2+rodWidth)/height/2), (height-rodWidth)/2+rodWidth);
            canvas.lineTo(startX+hoopWidth, height);
            startX += hoopWidth;
        }

        canvas.stroke();

        if (selected) {
            drawSelectionBox(canvas, 0, 0, width, height);
        }

        canvas.restore();
    }

    return {
        getPneumaticInterfaces,
        getElectricInterfaces,
        isSelected,
        select,
        unselect,
        getPosition,
        setPosition,
        getDimensions,
        isPositionWithinSelectionBox,
        draw
    };
}