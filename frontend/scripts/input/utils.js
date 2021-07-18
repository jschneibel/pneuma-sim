export function getTransformedMousePosition(event, canvas) {
    // const canvasElement = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const untransformedX = event.clientX - rect.left;
    const untransformedY = event.clientY - rect.top;
    
    // a: horizontal scaling
    // d: vertical scaling
    // e: horizontal translation
    // f: vertical translation
    const {a, d, e, f} = canvas.getContext('2d').getTransform();
    
    const transformedX = (untransformedX - e) / a;
    const transformedY = (untransformedY - f) / d;

    return {x: transformedX, y: transformedY};
}