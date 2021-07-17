import { ELEMENT_CONTACT_SIZE, 
    PNEUMATIC_CONTACT_COLOR, 
    ELECTRIC_CONTACT_COLOR} from '../../constants.js';

export function drawElectricContact(ctx, position = {x, y}, highlighted = false) {
    const circleRadius = ELEMENT_CONTACT_SIZE/2;

    ctx.save();
    ctx.lineWidth = 1.65;
    ctx.strokeStyle = ELECTRIC_CONTACT_COLOR;
    ctx.translate(position.x, position.y);

    ctx.beginPath();
    ctx.moveTo(circleRadius, 0);
    ctx.arc(0, 0, circleRadius, 0, 2*Math.PI);
    
    if (highlighted) {
        ctx.fill();
    }
    ctx.stroke();

    ctx.restore();
}

export function drawPneumaticContact(ctx, position = {x, y}, highlighted = false) {
    const circleRadius = ELEMENT_CONTACT_SIZE/2;

    ctx.save();
    ctx.lineWidth = 1.65;
    ctx.strokeStyle = PNEUMATIC_CONTACT_COLOR;
    ctx.fillStyle = PNEUMATIC_CONTACT_COLOR;
    ctx.translate(position.x, position.y);

    ctx.beginPath();
    ctx.moveTo(circleRadius, 0);
    ctx.arc(0, 0, circleRadius, 0, 2*Math.PI);
    
    if (highlighted) {
        ctx.fill();
    }
    ctx.stroke();

    ctx.restore();
}