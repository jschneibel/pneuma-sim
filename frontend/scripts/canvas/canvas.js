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

    canvas.clear();

    return canvas;
}

function drawAxes(canvas) {
    canvas.save();
    canvas.strokeStyle = '#778899';
    canvas.fillStyle = '#778899';
    canvas.font = '10px sans-serif';
    
    canvas.write('pneumaSIM', 3, 3);
    // canvas.font = '10px serif';
    // canvas.write('πνεῦμα', 4, -9);
    
    // canvas.font = '2200px serif';
    // canvas.fillStyle = '#242932';
    // canvas.write('πνεῦμα', -window.innerWidth*3/5, -window.innerHeight/2);
    
    const length = 110;
    canvas.beginPath();

    canvas.write('x', length+10, -3);
    canvas.moveTo(0, 0);
    canvas.lineTo(length, 0);
    canvas.lineTo(length-5, 5);
    canvas.moveTo(length, 0);
    canvas.lineTo(length-5, -5);
    
    canvas.write('y', -3, length+11);
    canvas.moveTo(0, 0);
    canvas.lineTo(0, length);
    canvas.lineTo(5, length-5);
    canvas.moveTo(0, length);
    canvas.lineTo(-5, length-5);
    
    canvas.stroke();
    canvas.restore();
}

export function redraw() {

}