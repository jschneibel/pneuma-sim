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
    const mousePosition = getTransformedMousePosition(event, canvasElement);

    diagram.getElements().forEach(function(element) {
        let elementPosition = element.getPosition();
        let relativeMousePosition = {
            x: mousePosition.x - elementPosition.x,
            y: mousePosition.y - elementPosition.y
        };

        element.getElectricContacts().forEach(function(electricContact) {
            if (electricContact.isPositionWithinContact(relativeMousePosition)) {
                electricContact.highlight();
            }
            else {
                electricContact.unhighlight();
            }
        });

        element.getPneumaticContacts().forEach(function(pneumaticContact) {
            if (pneumaticContact.isPositionWithinContact(relativeMousePosition)) {
                pneumaticContact.highlight();
            }
            else {
                pneumaticContact.unhighlight();
            }
        });
    })

    // TODO:
    // when dragging from an contact: create wire/hose
    
    canvasElement.getContext('2d').draw(diagram);
}

export function handleWheel(event, ctx, diagram) {
    const scrollDirection = Math.sign(event.deltaY);
    const zoom = Math.pow(1.1, -scrollDirection);
    ctx.scale(zoom, zoom);

    ctx.draw(diagram);
}

export function handleKeyDown(event, canvas, diagram) {
    console.log(event.key);

    if (event.key === 'Delete' || event.key === 'Backspace') {
        const elements = diagram.getElements();

        for (let i = elements.length-1; i >= 0; i--) {
            if (elements[i].isSelected()) {
                elements.splice(i, 1);
            }
        }

        // diagram.getElements().forEach((element) => !element.isSelected());
        canvas.getContext('2d').draw(diagram);
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

        canvas.getContext('2d').draw(diagram);
    }
}

function handleLeftMouseDown(event, canvas, diagram) {
    const mouseDownPosition = getTransformedMousePosition(event, canvas);
    
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
            canvas.getContext('2d').draw(diagram);
        }

        // ...open selection box, if it's a mouse drag
        return;
    }

    if (event.ctrlKey || event.shiftKey) {
        if (elementUnderMouse.isSelected()) {
            // unselect only on mouseup, if it's not a mouse drag
            function handleLeftMouseUp() {
                elementUnderMouse.unselect();
                canvas.getContext('2d').draw(diagram);
                removeUnselectElementListeners(canvas, handleLeftMouseUp, handleLeftMouseMove);
            }
            canvas.addEventListener('mouseup', handleLeftMouseUp);

            function handleLeftMouseMove() {
                removeUnselectElementListeners(canvas, handleLeftMouseUp, handleLeftMouseMove);
            }
            canvas.addEventListener('mousemove', handleLeftMouseMove);
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
                canvas.getContext('2d').draw(diagram);
                removeReselectElementListeners(canvas, handleLeftMouseUp, handleLeftMouseMove);
            }
            canvas.addEventListener('mouseup', handleLeftMouseUp);

            function handleLeftMouseMove() {
                removeReselectElementListeners(canvas, handleLeftMouseUp, handleLeftMouseMove);
            }
            canvas.addEventListener('mousemove', handleLeftMouseMove);                
        }
        else {
            diagram.unselectAll();
            elementUnderMouse.select();
        }
    }

    canvas.getContext('2d').draw(diagram);

    const originalDistancesToSelectedElements = [];
    diagram.getSelectedElements().forEach(function(selectedElement) {
        const selectedElementPosition = selectedElement.getPosition();
        originalDistancesToSelectedElements.push({
            x: selectedElementPosition.x - mouseDownPosition.x,
            y: selectedElementPosition.y - mouseDownPosition.y
        });
    });

    function handleLeftMouseDrag(event) {
        dragSelectedElements(event, canvas, diagram, originalDistancesToSelectedElements);
    };
    document.addEventListener('mousemove', handleLeftMouseDrag);

    function handleLeftMouseDragEnd(event) {
        removeSelectedElementDragListeners(handleLeftMouseDrag, handleLeftMouseDragEnd);
    }
    document.addEventListener('mouseup', handleLeftMouseDragEnd);
}

function handleMiddleMouseDown(event, canvas, diagram) {
    const mouseDownPosition = getTransformedMousePosition(event, canvas);

    function handleMiddleMouseDrag(event) {
        canvas.getContext('2d').save();
        panView(event, canvas, diagram, mouseDownPosition);
    };
    document.addEventListener('mousemove', handleMiddleMouseDrag);

    function handleMiddleMouseDragEnd(event) {
        removePanViewListeners(handleMiddleMouseDrag, handleMiddleMouseDragEnd);
    }
    document.addEventListener('mouseup', handleMiddleMouseDragEnd);
}

function getTransformedMousePosition(event, canvas) {
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

function dragSelectedElements(event, canvas, diagram, originalDistancesToSelectedElements) {
    const selectedElements = diagram.getSelectedElements();
    const currentMousePosition = getTransformedMousePosition(event, canvas);

    for (let i = 0; i < selectedElements.length; i++) {
        selectedElements[i].setPosition({
            x: currentMousePosition.x + originalDistancesToSelectedElements[i].x,
            y: currentMousePosition.y + originalDistancesToSelectedElements[i].y
        });
    }

    canvas.getContext('2d').draw(diagram);
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

function panView(event, canvas, diagram, mouseDownPosition) {
    const currentMousePosition = getTransformedMousePosition(event, canvas);
    
    const ctx = canvas.getContext('2d');
    ctx.restore();
    ctx.save();
    ctx.translate(currentMousePosition.x - mouseDownPosition.x,
        currentMousePosition.y - mouseDownPosition.y);
    ctx.draw(diagram);
}

function removePanViewListeners(handleMiddleMouseDrag, handleMiddleMouseDragEnd) {
    document.removeEventListener('mouseup', handleMiddleMouseDragEnd);
    document.removeEventListener('mousemove', handleMiddleMouseDrag);
}