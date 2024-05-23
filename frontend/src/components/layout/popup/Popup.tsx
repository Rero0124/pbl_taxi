import { ChangeEvent, ComponentProps, forwardRef, useEffect, useRef, useState } from "react";
import { PopupBottomButtonContainer, PopupButton, PopupContainer, PopupContent, PopupContentContainer, PopupMap, PopupProfileImage, PopupTitle, PopupTitleContainer, PopupTopButtonContainer } from "./StyledPopup"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { popupClose } from "../../../store/popupReducer";
import { del, post } from "../../../util/ajax";
import { useNavigate } from "react-router-dom";
import icon from "../../../images/test-icon.png";
import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { LineString } from "ol/geom";
import { Coordinate } from "ol/coordinate";

let coordinates: number[][] = [];

const PopupMapDiv = forwardRef((props: ComponentProps<any>, ref) => {
  return (
    <PopupMap ref={ref} id={props.id} name={props.name} autoComplete={"off"} maxLength={props.maxlength} onBlur={props.onBlur} onChange={props.onChange} {...props}></PopupMap>
  )
})

const baseLayer = new TileLayer({
  visible: true,
  source: new XYZ({
    url: "http://api.vworld.kr/req/wmts/1.0.0/" + process.env.REACT_APP_VWORLD_KEY + "/Base/{z}/{y}/{x}.png",
    crossOrigin: "anonymous",
  }),
  zIndex: -1
})

const lineLayer = new VectorLayer({
  visible: true,
  style: new Style({
      fill: new Fill({ color: '#00FF00' }),
      stroke: new Stroke({ color: '#000000', width: 10 })
  })
})

const map = new Map({
  layers: [baseLayer, lineLayer],
  view: new View({
    zoom: 16,
    minZoom: 7,
    maxZoom: 18,
    projection : 'EPSG:4326',
  }),
  controls: []
});

let i = 0;

export const getDriverLocate = (x: number, y: number) => {
  coordinates.push([x, y + (i++ * 0.0001)]);
  const feature = new Feature({
    geometry: new LineString(coordinates.length > 1 ? coordinates : [coordinates[0], coordinates[0]])
  });
  const lineSource = new VectorSource({});
  lineSource.addFeature(feature);
  const nowCenter = map.getView().getCenter();
  lineLayer.setSource(lineSource);
  map.getView().setCenter(nowCenter ?? [x, y]);
};

const createInterval = (callback: () => void) => {
  return setInterval(callback, 5000);
}

const removeInterval = (id: NodeJS.Timer | undefined) => {
  clearInterval(id);
}

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
  const navigate = useNavigate();

  const popup = useSelector((state: RootState) => state.popup);
  const [topButton, setTopButton] = useState<JSX.Element>(<></>);
  const [bottomButton, setBottomButton] = useState<JSX.Element>(<></>);
  const [titleText, setTitleText] = useState<string>("");
  const [content, setContent] = useState<JSX.Element>(<></>);

  const fileRef = useRef<HTMLInputElement>(null);
  const imageViewRef = useRef<HTMLImageElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const cancelOnClick = () => {
    dispatch(popupClose());
  }

  useEffect(() => {
    map.setTarget(undefined);
    if(popup.type === "called") {
      const saveOnClick = () => {
        post(`${process.env.REACT_APP_BACKEND_URL}/search/match/customer`, { body: JSON.stringify({customerId: popup.data.customer.id}) }, () => {});
        dispatch(popupClose());
      }
      setTopButton(closeButton("닫기", cancelOnClick));
      setBottomButton(saveAndCancelButton("받기", saveOnClick, "거절", cancelOnClick));
      setTitleText("택시 호출");
      setContent(
        <>
          <div>
            <PopupProfileImage src={popup.data.customer.image ? `${process.env.REACT_APP_BACKEND_URL}/file/view/profile/${popup.data.customer.image}` : icon} />
            <p>{popup.data.customer.name ?? popup.data.customer.id}</p>
          </div>
          <p>{popup.data.customer.inward ? "내" : "외"}향적 / {popup.data.customer.quickly ? "빠르게" : "안전하게"} / 노래{popup.data.customer.song ? "들음" + (popup.data.customer.songName ? "예시) " + popup.data.customer.song : "") : "안들음" }</p>
          <p>시작지: {popup.data.address.start.title ?? popup.data.address.start.address}{popup.data.address.start.title ? " / " + popup.data.address.start.address : ""}</p>
          <p>도착지: {popup.data.address.end.title ?? popup.data.address.end.address}{popup.data.address.end.title ? " / " + popup.data.address.end.address : ""}</p>
        </>
      );
    } else if(popup.type.indexOf("matched") > -1) {
      setTopButton(closeButton("닫기", () => {
        del(`${process.env.REACT_APP_BACKEND_URL}/user/locate`, {}, () => {})
        cancelOnClick();
      }));
      setBottomButton(<></>);
      setTitleText("택시 매칭됨");
      if(popup.type.indexOf("Driver") > -1) {
        setContent(
          <>
            <div>
              <PopupProfileImage src={popup.data.driver.image ? `${process.env.REACT_APP_BACKEND_URL}/file/view/profile/${popup.data.driver.image}` : icon} />
              <p>{popup.data.driver.name ?? popup.data.driver.id}</p>
            </div>
            <p>전화번호: {popup.data.driver.phone}</p>
            <p>{popup.data.driver.inward ? "내" : "외"}향적 / {popup.data.driver.quickly ? "빠르게" : "안전하게"} / 노래{popup.data.driver.song ? "들음" + (popup.data.driver.songName ? "예시) " + popup.data.driver.songName : "") : "안들음" }</p>
            <p>시작지: {popup.data.address.start.title ?? popup.data.address.start.address}{popup.data.address.start.title ? " / " + popup.data.address.start.address : ""}</p>
            <p>도착지: {popup.data.address.end.title ?? popup.data.address.end.address}{popup.data.address.end.title ? " / " + popup.data.address.end.address : ""}</p>
            <PopupMapDiv ref={mapRef}></PopupMapDiv>
          </>
        );
      } else {
        setContent(
          <>
            <div>
              <PopupProfileImage src={popup.data.customer.image ? `${process.env.REACT_APP_BACKEND_URL}/file/view/profile/${popup.data.customer.image}` : icon} />
              <p>{popup.data.customer.name ?? popup.data.customer.id}</p>
            </div>
            <p>전화번호: {popup.data.customer.phone}</p>
            <p>{popup.data.customer.inward ? "내" : "외"}향적 / {popup.data.customer.quickly ? "빠르게" : "안전하게"} / 노래{popup.data.customer.song ? "들음" + (popup.data.customer.songName ? "예시) " + popup.data.customer.song : "") : "안들음" }</p>
            <p>시작지: {popup.data.address.start.title ?? popup.data.address.start.address}{popup.data.address.start.title ? " / " + popup.data.address.start.address : ""}</p>
            <p>도착지: {popup.data.address.end.title ?? popup.data.address.end.address}{popup.data.address.end.title ? " / " + popup.data.address.end.address : ""}</p>
          </>
        );
      }
    } else if(popup.type === "image") {
      let selectImage: File;
      const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) {
          const file = e.target.files.item(0);
          if(file) {
            selectImage = file;
            const reader = new FileReader();
            reader.onloadend = () => {
              if(imageViewRef.current && reader.result) {
                imageViewRef.current.src = reader.result.toString();
              }
            }
            reader.readAsDataURL(file);
            e.target.files = null;
          }
        }
      }

      const saveOnClick = () => {
        if(selectImage) {
          const formData = new FormData();
          formData.append("data", selectImage);
          post(`${process.env.REACT_APP_BACKEND_URL}/file/upload/profile`, { body: formData, headerInit: false }, () => {}).then((action) => {
            if(action === "reload") navigate(0);
            dispatch(popupClose());
          });
        }
      }

      const chooseFileClick = () => {
        if(fileRef.current) fileRef.current.click();
      }

      if(imageViewRef.current) imageViewRef.current.src = "";
      
      setTopButton(closeButton("닫기", cancelOnClick));
      setBottomButton(saveAndCancelButton("저장", saveOnClick, "취소", cancelOnClick));
      setContent(
        <>
          <p onClick={chooseFileClick}>이미지 업로드</p>
          <p>등록된 이미지</p>
          <img ref={imageViewRef} />
          <input ref={fileRef} type="file" onChange={selectFile} hidden/>
        </>
      );
      setTitleText("이미지 선택");
    } else {
      setTopButton(closeButton("닫기", cancelOnClick));
      setBottomButton(<></>);
      setTitleText("");
      setContent(<></>);
    }
  }, [popup]);

  useEffect(() => {
    map.setTarget(undefined);
    if(mapRef.current) {
      mapRef.current.innerHTML = "";
      coordinates = [];
      map.setTarget(mapRef.current);
    }
  }, [content])

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