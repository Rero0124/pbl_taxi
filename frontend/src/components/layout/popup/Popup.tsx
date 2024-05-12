import { useEffect, useState } from "react";
import { PopupBottomButtonContainer, PopupButton, PopupContainer, PopupContent, PopupContentContainer, PopupTitle, PopupTitleContainer, PopupTopButtonContainer } from "./StyledPopup"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { popupClose } from "../../../store/popupReducer";
import { post } from "../../../util/ajax";

const closeButton = (closeText: string, closeOnClick: () => void) => (
  <PopupTopButtonContainer onClick={closeOnClick}>{closeText}</PopupTopButtonContainer>
)

const saveAndCancelButton = (saveText: string, saveOnClick: () => void, cancelText: string, cancelOnClick: () => void) => (
  <PopupBottomButtonContainer>
    <PopupButton onClick={saveOnClick}>{saveText}</PopupButton>
    <PopupButton onClick={cancelOnClick}>{cancelText}</PopupButton>
  </PopupBottomButtonContainer>
);

const Popup = () => {
  const dispatch = useDispatch();

  const popup = useSelector((state: RootState) => state.popup);
  const [topButton, setTopButton] = useState<JSX.Element>(<></>);
  const [bottomButton, setBottomButton] = useState<JSX.Element>(<></>);
  const [titleText, setTitleText] = useState<string>("");
  const [content, setContent] = useState<JSX.Element>(<></>);
  
  const cancelOnClick = () => {
    dispatch(popupClose());
  }

  useEffect(() => {
    if(popup.type === "called") {
      const saveOnClick = () => {
        post(`${process.env.REACT_APP_BACKEND_URL}/search/match/customer`, { body: JSON.stringify({customerId: popup.data.customer.id}) }, () => {});
        dispatch(popupClose());
      }
      setTopButton(closeButton("닫기", cancelOnClick));
      setBottomButton(saveAndCancelButton("받기", saveOnClick, "거절", cancelOnClick));
      setTitleText("택시 호출");
      setContent(<p>{popup.data.customer.id}</p>);
    } else if(popup.type.indexOf("matched") > -1) {
      setTopButton(closeButton("닫기", cancelOnClick));
      setBottomButton(<></>);
      setTitleText("택시 매칭됨");
      if(popup.type.indexOf("Driver") > -1) setContent(<p>{popup.data.driver.id}</p>);
      else setContent(<p>{popup.data.customer.id}</p>);
    } else {
      setTopButton(closeButton("닫기", cancelOnClick));
      setBottomButton(<></>);
      setTitleText("");
      setContent(<></>);
    }
  }, [popup]);

  return (
    <PopupContainer display={popup.display}>
      {topButton}
      <PopupTitleContainer>
        <PopupTitle>{titleText}</PopupTitle>
      </PopupTitleContainer>
      <PopupContentContainer>
        {content}
      </PopupContentContainer>
      {bottomButton}
    </PopupContainer>
  )
}

export default Popup;