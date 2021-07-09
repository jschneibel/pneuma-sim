import { createDiagram } from './diagram/diagram.js';
import { initializeCanvas } from './canvas/canvas.js';
import { handleMouseDown, 
    handleKeyDown, 
    handleWheel, 
    handleMouseMove } from './input.js';

const diagram = await createDiagram();
const {canvasElement, canvas} = initializeCanvas();

canvasElement.addEventListener('mousedown', function(event) {
    handleMouseDown(event, canvasElement, diagram);
});

canvasElement.addEventListener('wheel', function(event) {
    handleWheel(event, canvas, diagram);
}, {passive: true});

document.addEventListener('keydown', function(event) {
    handleKeyDown(event, canvasElement, diagram);
});

canvasElement.addEventListener('mousemove', function(event) {
    handleMouseMove(event, canvasElement, diagram);
});

const switchButton = document.getElementById('switch-button');
switchButton.onclick = createElementButtonOnClickHandler('switch');

const cylinderButton = document.getElementById('cylinder-button');
cylinderButton.onclick = createElementButtonOnClickHandler('cylinder');

function createElementButtonOnClickHandler(elementType) {
    return function() {
        diagram.unselectAll();
        diagram.add[elementType]();
        canvas.draw(diagram);
    }
}
