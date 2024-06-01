import { ChangeEvent, ComponentProps, forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { popupClose, popupUnSet } from "store/popupReducer";
import { del, post } from "util/ajax";
import { useNavigate } from "react-router-dom";
import icon from "images/test-icon.png";
import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { LineString } from "ol/geom";
import "styles/Pages.css";

interface RatingForm extends HTMLFormElement {
  readonly rate: HTMLInputElement;
  readonly follow: HTMLInputElement;
}

let coordinates: number[][] = [];

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

export const getDriverLocate = (x: number, y: number) => {
  coordinates.push([x, y]);
  const feature = new Feature({
    geometry: new LineString(coordinates.length > 1 ? coordinates : [coordinates[0], coordinates[0]])
  });
  const lineSource = new VectorSource({});
  lineSource.addFeature(feature);
  const nowCenter = map.getView().getCenter();
  lineLayer.setSource(lineSource);
  map.getView().setCenter(nowCenter ?? [x, y]);
};

const closeButton = (closeText: string, closeOnClick: () => void) => (
  <div className="popup-top-button-container">
    <button onClick={closeOnClick}>{closeText}</button>
  </div>
)

const saveAndCancelButton = (saveText: string, saveOnClick: () => void, cancelText: string, cancelOnClick: () => void) => (
  <div className="popup-bottom-button-container">
    <button className="wvw50" onClick={saveOnClick}>{saveText}</button>
    <button className="wvw50" onClick={cancelOnClick}>{cancelText}</button>
  </div>
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
  const ratingFormRef = useRef<RatingForm>(null);

  const cancelOnClick = () => {
    dispatch(popupUnSet());
  }

  useEffect(() => {
    map.setTarget(undefined);
    if(popup.type === "called") {
      const saveOnClick = () => {
        post(`${process.env.REACT_APP_BACKEND_URL}/search/match/customer`, { body: JSON.stringify({customerId: popup.data.customer.id}) }, () => {});
        dispatch(popupUnSet());
      }
      setTopButton(closeButton("닫기", cancelOnClick));
      setBottomButton(saveAndCancelButton("받기", saveOnClick, "거절", cancelOnClick));
      setTitleText("택시 호출");
      setContent(
        <>
          <div>
            <img src={popup.data.customer.image ? `${process.env.REACT_APP_BACKEND_URL}/file/view/profile/${popup.data.customer.image}` : icon} />
            <p>{popup.data.customer.name ?? popup.data.customer.id}</p>
          </div>
          <p>성향: {popup.data.customer.inward === 0 ? "상관없음" : (popup.data.customer.inward === -1 ? "내" : "외") + "향적"}/ 목적지까지: {popup.data.customer.quickly === 0 ? "상관없음" : popup.data.customer.quickly === -1 ? "빠르게" : "안전하게"} / 노래: {popup.data.customer.song === 0 ? "상관없음" : popup.data.customer.song ? "들음" + (popup.data.customer.songName ? "예시) " + popup.data.customer.songName : "") : "안들음" }</p>
          <p>시작지: {popup.data.address.start.title ?? popup.data.address.start.address}{popup.data.address.start.title ? " / " + popup.data.address.start.address : ""}</p>
          <p>도착지: {popup.data.address.end.title ?? popup.data.address.end.address}{popup.data.address.end.title ? " / " + popup.data.address.end.address : ""}</p>
        </>
      );
    } else if(popup.type.indexOf("matched") > -1) {
      setTopButton(<></>);
      setTitleText("택시 매칭됨");
      if(popup.type.indexOf("Driver") > -1) {
        setContent(
          <>
            <div>
              <img src={popup.data.driver.image ? `${process.env.REACT_APP_BACKEND_URL}/file/view/profile/${popup.data.driver.image}` : icon} />
              <p>{popup.data.driver.name ?? popup.data.driver.id}</p>
            </div>
            <p>전화번호: {popup.data.driver.phone}</p>
            <p>성향 {popup.data.driver.inward === 0 ? "상관없음" : (popup.data.driver.inward === -1 ? "내" : "외") + "향적"}/ 목적지까지: {popup.data.driver.quickly === 0 ? "상관없음" : popup.data.driver.quickly === -1 ? "빠르게" : "안전하게"} / 노래: {popup.data.driver.song === 0 ? "상관없음" : popup.data.driver.song === -1 ? "들음" + (popup.data.driver.songName ? "예시) " + popup.data.driver.songName : "") : "안들음" }</p>
            <p>시작지: {popup.data.address.start.title ?? popup.data.address.start.address}{popup.data.address.start.title ? " / " + popup.data.address.start.address : ""}</p>
            <p>도착지: {popup.data.address.end.title ?? popup.data.address.end.address}{popup.data.address.end.title ? " / " + popup.data.address.end.address : ""}</p>
            <div className="popup-map" ref={mapRef}></div>
          </>
        );
        setBottomButton(<></>);
      } else {
        setContent(
          <>
            <div>
              <img src={popup.data.customer.image ? `${process.env.REACT_APP_BACKEND_URL}/file/view/profile/${popup.data.customer.image}` : icon} />
              <p>{popup.data.customer.name ?? popup.data.customer.id}</p>
            </div>
            <p>전화번호: {popup.data.customer.phone}</p>
            <p>성향: {popup.data.customer.inward === 0 ? "상관없음" : (popup.data.customer.inward === -1 ? "내" : "외") + "향적"}/ 목적지까지: {popup.data.customer.quickly === 0 ? "상관없음" : popup.data.customer.quickly === -1 ? "빠르게" : "안전하게"} / 노래: {popup.data.customer.song === 0 ? "상관없음" : popup.data.customer.song ? "들음" + (popup.data.customer.songName ? "예시) " + popup.data.customer.songName : "") : "안들음" }</p>
            <p>시작지: {popup.data.address.start.title ?? popup.data.address.start.address}{popup.data.address.start.title ? " / " + popup.data.address.start.address : ""}</p>
            <p>도착지: {popup.data.address.end.title ?? popup.data.address.end.address}{popup.data.address.end.title ? " / " + popup.data.address.end.address : ""}</p>
          </>
        );
        setBottomButton(saveAndCancelButton("취소", () => {
          del(`${process.env.REACT_APP_BACKEND_URL}/search/match/cancel/${popup.data.customer.id}`, {}, () => {})
          cancelOnClick();
        }, "도착", () => {
          del(`${process.env.REACT_APP_BACKEND_URL}/search/match/end/${popup.data.customer.id}`, {}, () => {})
          cancelOnClick();
        }));
      }
    } else if (popup.type === "matchEnd") {
      if(popup.data.type === "cancel") {
        dispatch(popupUnSet());
      } else if (popup.data.type === "end") {
        const saveDriverRating = () => {
          if(ratingFormRef.current) {
            const followData = {
              userId: popup.data.driverId
            }

            const rateData = {
              userId: popup.data.driverId,
              rate: Number(ratingFormRef.current.rate.value)
            }

            if(ratingFormRef.current.follow.value === "follow") post(`${process.env.REACT_APP_BACKEND_URL}/user/follow`, { body: JSON.stringify(followData) }, () => {})
            else if(ratingFormRef.current.follow.value === "ban") post(`${process.env.REACT_APP_BACKEND_URL}/user/ban`, { body: JSON.stringify(followData) }, () => {})
            post(`${process.env.REACT_APP_BACKEND_URL}/user/rate`, { body: JSON.stringify(rateData) }, () => { dispatch(popupUnSet()); navigate('/'); })
          }
        }
        setTopButton(<></>);
        setBottomButton(saveAndCancelButton("닫기", cancelOnClick, "평가하기", saveDriverRating));
        setTitleText("기사 평가하기");
        setContent(
          <>
            <form ref={ratingFormRef}>
              <div className="container">
                <div className="row">
                  <label className="col" htmlFor="rate">점수: </label>
                  <input id="rate" className="col" name="rate"/>
                </div>
                <div className="row">
                  <label className="col" htmlFor="follow">팔로잉 여부: </label>
                  <div className="col-row">
                    <label htmlFor="follow">팔로우: </label>
                    <input id="follow" name="follow" type="radio" value="follow"/>
                    <label htmlFor="ban">밴: </label>
                    <input id="ban" name="follow" type="radio" value="ban"/>
                    <label htmlFor="none">안함: </label>
                    <input id="none" name="follow" type="radio" value="none"/>
                  </div>
                </div>
              </div>
            </form>
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
            dispatch(popupUnSet());
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
    <div className={"popup-container " + (popup.display ? "d-block" : "d-none")}>
      {topButton}
      <div className="popup-title-container title">
        <p>{titleText}</p>
      </div>
      <div className="popup-content-container">
        {content}
      </div>
      {bottomButton}
    </div>
  )
}

export default Popup;