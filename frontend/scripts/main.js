import { createDiagram } from './diagram/diagram.js';
import { initializeCanvas } from './canvas/canvas.js';
import { handleMouseDown, 
    handleKeyDown, 
    handleWheel, 
    handleMouseMove } from './input.js';

const diagram = await createDiagram();
const {canvas, ctx} = initializeCanvas();

canvas.addEventListener('mousedown', function(event) {
    handleMouseDown(event, canvas, diagram);
});

canvas.addEventListener('wheel', function(event) {
    handleWheel(event, ctx, diagram);
}, {passive: true});

document.addEventListener('keydown', function(event) {
    handleKeyDown(event, canvas, diagram);
});

canvas.addEventListener('mousemove', function(event) {
    handleMouseMove(event, canvas, diagram);
});

const switchButton = document.getElementById('switch-button');
switchButton.onclick = createElementButtonOnClickHandler('switch');

const cylinderButton = document.getElementById('cylinder-button');
cylinderButton.onclick = createElementButtonOnClickHandler('cylinder');

function createElementButtonOnClickHandler(elementType) {
    return function() {
        diagram.unselectAll();
        diagram.add[elementType]();
        ctx.draw(diagram);
    }
}
