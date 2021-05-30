import { createCircle } from '../canvas/components/circle.js'

export default function createSwitch() {
    console.log('Creating Switch.');
    const components = [];

    // components.push(createCircle(0, 0, 30));
    // components.push(createCircle(60, 0, 30));
    // components.push(createCircle(0, 60, 30));
    // components.push(createCircle(60, 60, 30));

    function draw(canvas) {
        // components.forEach(component => component.draw(canvas));
        const width = 50;
        canvas.translate(-width, 30);
        canvas.beginPath();
        canvas.moveTo(0, 0);
        canvas.lineTo(4/5*width, 0);
        canvas.lineTo(9/5*width, width/3);
        canvas.moveTo(9/5*width, 0);
        canvas.lineTo(13/5*width, 0);
        canvas.stroke();
    }

    return {
        draw
    };
}