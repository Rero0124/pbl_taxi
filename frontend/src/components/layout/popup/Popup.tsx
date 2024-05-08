import { useEffect, useState } from "react";
import { PopupBottomButtonContainer, PopupContainer, PopupContent, PopupContentContainer, PopupTitle, PopupTitleContainer, PopupTopButtonContainer } from "./StyledPopup"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { popupClose } from "../../../store/popupReducer";
import { post } from "../../../util/ajax";

const saveAndCancelButton = (saveText: string, saveOnClick: () => void, cancelText: string, cancelOnClick: () => void) => (
  <div>
    <div onClick={saveOnClick}>{saveText}</div>
    <div onClick={cancelOnClick}>{cancelText}</div>
  </div>
);

const Popup = () => {
  const dispatch = useDispatch();

  const popup = useSelector((state: RootState) => state.popup);
  const [bottomButton, setBottomButton] = useState<JSX.Element>(<></>);
  
  const cancelOnClick = () => {
    dispatch(popupClose());
  }

  useEffect(() => {
    if(popup.type === "called") {
      const saveOnClick = () => {
        post(`${process.env.REACT_APP_BACKEND_URL}/search/match/customer`, { body: JSON.stringify({customerId: popup.content}) }, () => {});
        dispatch(popupClose());
      }
      setBottomButton(saveAndCancelButton("받기", saveOnClick, "거절", cancelOnClick));
    }
  }, [popup]);

  return (
    <PopupContainer display={popup.display}>
      <PopupTopButtonContainer>
        <div onClick={cancelOnClick}>닫기</div>
      </PopupTopButtonContainer>
      <PopupTitleContainer>
        <PopupTitle>{popup.title}</PopupTitle>
      </PopupTitleContainer>
      <PopupContentContainer>
        <p>{popup.content}</p>
      </PopupContentContainer>
      <PopupBottomButtonContainer>
        {bottomButton}
      </PopupBottomButtonContainer>
    </PopupContainer>
  )
}

export default Popup;