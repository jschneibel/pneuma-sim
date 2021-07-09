import { ZOOM_SPEED } from "./constants.js";

export function handleMouseDown(event, canvasElement, diagram) {
    switch (event.button) {
        case 2: // right click
            break;
        case 1: // middle click
            handleMiddleMouseDown(event, canvasElement, diagram);
            break;
        case 0: // left click
        default:
            handleLeftMouseDown(event, canvasElement, diagram);
    }
    
}

// to colorize elements to be selected?
export function handleMouseMove(event, canvasElement, diagram) {
    const {x, y} = getTransformedMousePosition(event, canvasElement);

    // some() applies the function to each element in array order
    // until the function returns true
    diagram.getElements().some(function(element) {
        const pneumaticInterfaces = element.getPneumaticInterfaces();

        for (let i = 0; i < pneumaticInterfaces.length; i++) {
            if (element.isPositionWithinSelectionBox({x, y})) {
                console.log('pneumatic interface');
                // drawPneumaticInterface(canvas, pneumaticInterfaces[i]);
                return true;
            }
        }

        // TODO:
        // on hover if no element is selected: show interfaces
        // if an element is selected: show interfaces
        // when dragging from an interface: show all interfaces and create wire/hose

        return false;
    });

    canvasElement.getContext('2d').draw(diagram);
}

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

function handleLeftMouseDown(event, canvasElement, diagram) {
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
            function handleLeftMouseUp() {
                elementUnderMouse.unselect();
                canvasElement.getContext('2d').draw(diagram);
                removeUnselectElementListeners(canvasElement, handleLeftMouseUp, handleLeftMouseMove);
            }
            canvasElement.addEventListener('mouseup', handleLeftMouseUp);

            function handleLeftMouseMove() {
                removeUnselectElementListeners(canvasElement, handleLeftMouseUp, handleLeftMouseMove);
            }
            canvasElement.addEventListener('mousemove', handleLeftMouseMove);
        }
        else {
            elementUnderMouse.select();
        }
    }
    else {
        if (elementUnderMouse.isSelected()) {
            // re-select element on mouseup, if it's not a mouse drag
            function handleLeftMouseUp() {
                diagram.unselectAll();
                elementUnderMouse.select();
                canvasElement.getContext('2d').draw(diagram);
                removeReselectElementListeners(canvasElement, handleLeftMouseUp, handleLeftMouseMove);
            }
            canvasElement.addEventListener('mouseup', handleLeftMouseUp);

            function handleLeftMouseMove() {
                removeReselectElementListeners(canvasElement, handleLeftMouseUp, handleLeftMouseMove);
            }
            canvasElement.addEventListener('mousemove', handleLeftMouseMove);                
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

    function handleLeftMouseDrag(event) {
        dragSelectedElements(event, canvasElement, diagram, originalDistancesToSelectedElements);
    };
    document.addEventListener('mousemove', handleLeftMouseDrag);

    function handleLeftMouseDragEnd(event) {
        removeSelectedElementDragListeners(handleLeftMouseDrag, handleLeftMouseDragEnd);
    }
    document.addEventListener('mouseup', handleLeftMouseDragEnd);
}

function handleMiddleMouseDown(event, canvasElement, diagram) {
    const mouseDownPosition = getTransformedMousePosition(event, canvasElement);

    function handleMiddleMouseDrag(event) {
        canvasElement.getContext('2d').save();
        panView(event, canvasElement, diagram, mouseDownPosition);
    };
    document.addEventListener('mousemove', handleMiddleMouseDrag);

    function handleMiddleMouseDragEnd(event) {
        removePanViewListeners(handleMiddleMouseDrag, handleMiddleMouseDragEnd);
    }
    document.addEventListener('mouseup', handleMiddleMouseDragEnd);
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

function removeSelectedElementDragListeners(handleLeftMouseDrag, handleLeftMouseDragEnd) {
    document.removeEventListener('mousemove', handleLeftMouseDrag);
    document.removeEventListener('mouseup', handleLeftMouseDragEnd);
}

function removeUnselectElementListeners(canvasElement, handleLeftMouseUp, handleLeftMouseMove) {
    canvasElement.removeEventListener('mouseup', handleLeftMouseUp);
    canvasElement.removeEventListener('mousemove', handleLeftMouseMove);
}

function removeReselectElementListeners(canvasElement, handleLeftMouseUp, handleLeftMouseMove) {
    canvasElement.removeEventListener('mouseup', handleLeftMouseUp);
    canvasElement.removeEventListener('mousemove', handleLeftMouseMove);
}

function panView(event, canvasElement, diagram, mouseDownPosition) {
    const currentMousePosition = getTransformedMousePosition(event, canvasElement);
    
    const canvas = canvasElement.getContext('2d');
    canvas.restore();
    canvas.save();
    canvas.translate(currentMousePosition.x - mouseDownPosition.x,
        currentMousePosition.y - mouseDownPosition.y);
    canvas.draw(diagram);
}

function removePanViewListeners(handleMiddleMouseDrag, handleMiddleMouseDragEnd) {
    document.removeEventListener('mouseup', handleMiddleMouseDragEnd);
    document.removeEventListener('mousemove', handleMiddleMouseDrag);
}