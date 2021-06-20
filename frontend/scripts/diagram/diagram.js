export async function createDiagram() {
    const elements = [];

    const elementTypes = [
        'switch',
        'cylinder'
    ];

    const elementImports = [];
    for (const elementType of elementTypes) {
        elementImports.push(import(`./elements/${elementType}.js`));
    }
    const elementModules = await Promise.all(elementImports);

    const createFunctions = {};
    elementTypes.forEach(function(elementType, index) {
        createFunctions[elementType] = function() {
            elements.unshift(elementModules[index].default());
        }
    });

    function getElements() {
        return elements;
    }

    // function setElements(newElements) {
    //     elements = newElements;
    // }

    function unselectAll() {
        elements.forEach(element => {
            element.unselect();
        })
    };

    function select() {

    };

    function getSelectedElements() {
        const selectedElements = [];
        elements.forEach(element => {
            if (element.isSelected()) {
                selectedElements.push(element);
            }
        })

        return selectedElements;
    }

    return {
        'add': createFunctions,
        getElements,
        getSelectedElements,
        unselectAll,
        select
    };
}