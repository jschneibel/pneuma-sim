import { SELECTION_BOX_PADDING} from '../../constants.js';
import { drawSelectionBox } from '../../canvas/components/drawSelectionBox.js';

export default function createSwitch() {
    const width = 100;
    const height = width/7;

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
        return position.x >= x-SELECTION_BOX_PADDING
            && position.x <= x+width+SELECTION_BOX_PADDING
            && position.y >= y-SELECTION_BOX_PADDING
            && position.y <= y+height+SELECTION_BOX_PADDING;
    }

    function draw(canvas) {
        canvas.save();
        canvas.translate(x, y);
        canvas.beginPath();

        canvas.moveTo(0, 0);
        canvas.lineTo(2/10*width, 0);
        canvas.lineTo(8/10*width, height);
        canvas.moveTo(8/10*width, 0);
        canvas.lineTo(width, 0);
        canvas.stroke();

        if (selected) {
            drawSelectionBox(canvas, 0, 0, width, height);
        }

        canvas.restore();
    }

    return {
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