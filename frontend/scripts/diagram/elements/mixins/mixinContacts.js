import {
    createElectricContact,
    createPneumaticContact
 } from "../utils/contact.js";

export default function mixinContacts({
    element = {},
    getElementPosition = function() { return {x: 0, y: 0} },
    electricContactPositions = [],
    pneumaticContactPositions = [],
}) {
    const electricContacts = electricContactPositions.map(
        function(position = {x, y}) {
            return createElectricContact({
                parentElement: element,
                getParentPosition: getElementPosition,
                position
            });
    });
    
    const pneumaticContacts = pneumaticContactPositions.map(
        function(position = {x, y}) {
            return createPneumaticContact({
                parentElement: element,
                getParentPosition: getElementPosition,
                position
            });
    });
    
    element.getElectricContacts = function() {
        return electricContacts;
    };

    element.getPneumaticContacts = function() {
        return pneumaticContacts;
    };
}