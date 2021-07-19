import {
  createElectricContact,
  createPneumaticContact,
} from "../utils/contacts.js";

export default function mixinContacts({
  element = {},
  getElementPosition = () => ({ x: 0, y: 0 }),
  electricContactPositions = [],
  pneumaticContactPositions = [],
}) {
  const electricContacts = electricContactPositions.map((position) =>
    createElectricContact({
      parentElement: element,
      getParentPosition: getElementPosition,
      position,
    })
  );

  const pneumaticContacts = pneumaticContactPositions.map((position) =>
    createPneumaticContact({
      parentElement: element,
      getParentPosition: getElementPosition,
      position,
    })
  );

  element.getElectricContacts = () => electricContacts;

  element.getPneumaticContacts = () => pneumaticContacts;
}
