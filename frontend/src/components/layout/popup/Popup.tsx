import { useState } from "react";
import { PopupContainer, PopupContent, PopupTitle } from "./StyledPopup"
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const Popup = () => {
  const popup = useSelector((state: RootState) => state.popup);

  return (
    <PopupContainer display={popup.display}>
      <PopupTitle>{popup.title}</PopupTitle>
      <PopupContent>{popup.content}</PopupContent>
    </PopupContainer>
  )
}

export default Popup;