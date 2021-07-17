import { drawPneumaticContact, drawElectricContact } from './components/drawElementContact.js';
import { drawAxes } from './utils.js';

export function getCanvasContext() {
    return document.getElementById('canvas').getContext('2d');
}

export function initializeCanvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.translate(Math.floor(canvas.width / 2) + 0.5, Math.floor(canvas.height / 2) + 0.5);
    ctx.scale(1, -1);

    ctx.font = '12px sans-serif';
    ctx.strokeStyle = '#bbccdd';
    ctx.fillStyle = '#bbccdd';

    // this function writes text without it being vertically mirrored
    ctx.write = function(text, x, y) {
        ctx.save();
        ctx.scale(1, -1);
        ctx.fillText(text, x , -y);
        ctx.restore();
    }

    ctx.clear = function() {
        ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
        drawAxes(ctx);
    }

    ctx.draw = function(diagram) {
        ctx.clear();

        const elements = diagram.getElements();
        for (let i = elements.length-1; i >= 0; i--) {
            elements[i].draw(ctx);
        }
    }

    ctx.clear();

    return {canvas: canvas, ctx: ctx};
}