import { drawAxes } from './utils.js';

export function getCanvasContext() {
    return document.getElementById('canvas').getContext('2d');
}

export function initializeCanvas() {
    const canvasElement = document.getElementById('canvas');
    const canvas = canvasElement.getContext('2d');

    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    canvas.translate(Math.floor(canvasElement.width / 2) + 0.5, Math.floor(canvasElement.height / 2) + 0.5);
    canvas.scale(1, -1);

    canvas.font = '12px sans-serif';
    canvas.strokeStyle = '#bbccdd';
    canvas.fillStyle = '#bbccdd';

    // this function writes text without it being vertically mirrored
    canvas.write = function(text, x, y) {
        canvas.save();
        canvas.scale(1, -1);
        canvas.fillText(text, x , -y);
        canvas.restore();
    }

    canvas.clear = function() {
        canvas.clearRect(-canvasElement.width/2, -canvasElement.height/2, canvasElement.width, canvasElement.height);
        drawAxes(canvas);
    }

    canvas.draw = function(diagram) {
        canvas.clear();
        const elements = diagram.getElements();
        for (let i = elements.length-1; i >= 0; i--) {
            elements[i].draw(canvas);
        }
        // diagram.elements.forEach(function(element) {
        //     element.draw(canvas)
        // });        
    }

    canvas.clear();

    return {canvasElement, canvas};
}