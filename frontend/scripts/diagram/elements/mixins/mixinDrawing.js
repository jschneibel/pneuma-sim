export default function mixinDrawing({
    element = {},
    getElementPosition = function() { return {x: 0, y: 0} },
    draw = function drawLocally() {}
}) {
    // extend draw function if it already has been mixed-in
    const existingDraw = element.draw;

    element.draw = function(ctx) {
        if (existingDraw) {
            existingDraw(ctx);
        }

        const {x, y} = getElementPosition();
        
        ctx.save();
        ctx.translate(x, y);
        draw(ctx);
        ctx.restore();
    };
}