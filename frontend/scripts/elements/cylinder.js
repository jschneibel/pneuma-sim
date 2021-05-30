import { createCircle } from '../canvas/components/circle.js'

export default function createCylinder() {
    console.log('Creating Cylinder.');

    function draw(canvas) {
        const width = 120;
        const height = width/4;
        const rodWidth = height/6;
        const hoops = 4;
        let distance = width/6;

        canvas.translate(width, 60);
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
    }

    return {
        draw
    };
}