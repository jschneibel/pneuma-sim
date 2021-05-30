export async function createDiagram() {
    const elements = [];

    const elementNames = [
        'switch',
        'cylinder'
    ];

    const elementImports = [];
    for (const elementName of elementNames) {
        elementImports.push(import(`./elements/${elementName}.js`));
    }
    const elementModules = await Promise.all(elementImports);

    const createFunctions = {};
    elementNames.forEach(function(elementName, index) {
        createFunctions[elementName] = function() {
            elements.push(elementModules[index].default());
        }
    });

    const draw = function(canvas) {
        canvas.clear();
        elements.forEach(function(element) {
            canvas.save();
            element.draw(canvas)
            canvas.restore();
        });
    }

    return {
        elements,
        'add': createFunctions,
        draw
    };
}