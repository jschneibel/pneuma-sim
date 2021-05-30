import { initializeCanvas } from './canvas/canvas.js';
import { createDiagram } from './diagram.js';

const diagram = await createDiagram();

const canvas = initializeCanvas();

const switchButton = document.getElementById('switch-button');
switchButton.onclick = function() {
    diagram.add['switch']();
    diagram.draw(canvas);
}

const cylinderButton = document.getElementById('cylinder-button');
cylinderButton.onclick = function() {
    diagram.add['cylinder']();
    diagram.draw(canvas);
}


console.log(canvas);
