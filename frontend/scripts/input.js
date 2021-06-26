import { ZOOM_SPEED } from "./constants.js";

export function handleMouseDown(event, canvasElement, diagram) {
    const mouseDownPosition = getTransformedMousePosition(event, canvasElement);
    
    let elementUnderMouse;
    diagram.getElements().some(function(element) {
        if (element.isPositionWithinSelectionBox(mouseDownPosition)) {
            elementUnderMouse = element;
            return true;
        }
        return false;
    });

    if (!elementUnderMouse) {
        if (event.ctrlKey || event.shiftKey) {
            // do nothing
        }
        else {
            diagram.unselectAll();
            canvasElement.getContext('2d').draw(diagram);
        }

        // ...open selection box, if it's a mouse drag
        return;
    }

    if (event.ctrlKey || event.shiftKey) {
        if (elementUnderMouse.isSelected()) {
            // unselect only on mouseup, if it's not a mouse drag
            function handleMouseUp() {
                elementUnderMouse.unselect();
                canvasElement.getContext('2d').draw(diagram);
                removeUnselectElementListeners(canvasElement, handleMouseUp, handleMouseMove);
            }
            canvasElement.addEventListener('mouseup', handleMouseUp);

            function handleMouseMove() {
                removeUnselectElementListeners(canvasElement, handleMouseUp, handleMouseMove);
            }
            canvasElement.addEventListener('mousemove', handleMouseMove);
        }
        else {
            elementUnderMouse.select();
        }
    }
    else {
        if (elementUnderMouse.isSelected()) {
            // re-select element on mouseup, if it's not a mouse drag
            function handleMouseUp() {
                diagram.unselectAll();
                elementUnderMouse.select();
                canvasElement.getContext('2d').draw(diagram);
                removeReselectElementListeners(canvasElement, handleMouseUp, handleMouseMove);
            }
            canvasElement.addEventListener('mouseup', handleMouseUp);

            function handleMouseMove() {
                removeReselectElementListeners(canvasElement, handleMouseUp, handleMouseMove);
            }
            canvasElement.addEventListener('mousemove', handleMouseMove);                
        }
        else {
            diagram.unselectAll();
            elementUnderMouse.select();
        }
    }

    canvasElement.getContext('2d').draw(diagram);

    const originalDistancesToSelectedElements = [];
    diagram.getSelectedElements().forEach(function(selectedElement) {
        const selectedElementPosition = selectedElement.getPosition();
        originalDistancesToSelectedElements.push({
            x: selectedElementPosition.x - mouseDownPosition.x,
            y: selectedElementPosition.y - mouseDownPosition.y
        });
    });

    function handleMouseDrag(event) {
        dragSelectedElements(event, canvasElement, diagram, originalDistancesToSelectedElements);
    };
    document.addEventListener('mousemove', handleMouseDrag);

    function handleMouseDragEnd(event) {
        removeSelectedElementDragListeners(handleMouseDrag, handleMouseDragEnd);
    }
    document.addEventListener('mouseup', handleMouseDragEnd);
}

// to colorize elements to be selected?
// export function handleMouseMove(event, canvasElement, diagram) {
//     // const {x, y} = getTransformedMousePosition(event, canvasElement);

//     // // unselect all elements, except if Ctrl or Shift are pressed
//     // if (!(event.ctrlKey || event.shiftKey)) {
//     //     diagram.unselectAll();
//     // }

//     // // some() applies the function to each element in array order
//     // // until the function returns true
//     // diagram.elements.some(function(element) {
//     //     if (element.isPositionWithinSelectionBox(x, y)) {
//     //         element.select();
//     //         return true;
//     //     }
//     //     return false;
//     // });

//     // canvasElement.getContext('2d').draw(diagram);
// }

export function handleWheel(event, canvas, diagram) {
    const scrollDirection = Math.sign(event.deltaY);
    const zoom = Math.pow(1.1, -scrollDirection);
    canvas.scale(zoom, zoom);

    canvas.draw(diagram);
}

export function handleKeyDown(event, canvasElement, diagram) {
    console.log(event.key);

    if (event.key === 'Delete' || event.key === 'Backspace') {
        const elements = diagram.getElements();

        for (let i = elements.length-1; i >= 0; i--) {
            if (elements[i].isSelected()) {
                elements.splice(i, 1);
            }
        }

        // diagram.getElements().forEach((element) => !element.isSelected());
        canvasElement.getContext('2d').draw(diagram);
    }

    if (event.key === 'ArrowLeft'
    || event.key === 'ArrowRight'
    || event.key === 'ArrowUp'
    || event.key === 'ArrowDown') {
        let moveDistance;
        if (event.shiftKey) {
            moveDistance = 64;
        }
        else if (event.ctrlKey) {
            moveDistance = 1;
        }
        else {
            moveDistance = 8;
        }
        
        let moveVector;
        if (event.key === 'ArrowLeft') {
            moveVector = {x: -moveDistance, y: 0};
        }
        else if (event.key === 'ArrowRight') {
            moveVector = {x: moveDistance, y: 0};
        }
        else if (event.key === 'ArrowUp') {
            moveVector = {x: 0, y: moveDistance};
        }
        else if (event.key === 'ArrowDown') {
            moveVector = {x: 0, y: -moveDistance};
        }

        diagram.getSelectedElements().forEach(function(selectedElement) {
            const currentPosition = selectedElement.getPosition();
            selectedElement.setPosition({
                x: currentPosition.x + moveVector.x,
                y: currentPosition.y + moveVector.y
            });
        });

        canvasElement.getContext('2d').draw(diagram);
    }
}

function getTransformedMousePosition(event, canvasElement) {
    // const canvasElement = event.currentTarget;
    const rect = canvasElement.getBoundingClientRect();
    const untransformedX = event.clientX - rect.left;
    const untransformedY = event.clientY - rect.top;
    
    // a: horizontal scaling
    // d: vertical scaling
    // e: horizontal translation
    // f: vertical translation
    const {a, d, e, f} = canvasElement.getContext('2d').getTransform();
    
    const transformedX = (untransformedX - e) / a;
    const transformedY = (untransformedY - f) / d;

    return {x: transformedX, y: transformedY};
}

function dragSelectedElements(event, canvasElement, diagram, originalDistancesToSelectedElements) {
    const selectedElements = diagram.getSelectedElements();
    const currentMousePosition = getTransformedMousePosition(event, canvasElement);

    for (let i = 0; i < selectedElements.length; i++) {
        selectedElements[i].setPosition({
            x: currentMousePosition.x + originalDistancesToSelectedElements[i].x,
            y: currentMousePosition.y + originalDistancesToSelectedElements[i].y
        });
    }

    canvasElement.getContext('2d').draw(diagram);
}

function removeSelectedElementDragListeners(handleMouseDrag, handleMouseDragEnd) {
    document.removeEventListener('mousemove', handleMouseDrag);
    document.removeEventListener('mouseup', handleMouseDragEnd);
}

function removeUnselectElementListeners(canvasElement, handleMouseUp, handleMouseMove) {
    canvasElement.removeEventListener('mouseup', handleMouseUp);
    canvasElement.removeEventListener('mousemove', handleMouseMove);
}

function removeReselectElementListeners(canvasElement, handleMouseUp, handleMouseMove) {
    canvasElement.removeEventListener('mouseup', handleMouseUp);
    canvasElement.removeEventListener('mousemove', handleMouseMove);
}