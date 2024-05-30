import { FormEvent, MouseEvent, useState } from "react";
import { SettingType, SettingOptionData, settingSet } from "../../store/settingReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import "styles/Contents.css";

const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setting = useSelector((state: RootState) => state.setting);
  const [searchType, setSearchType] = useState<SettingOptionData>(setting.searchType);
  const [searchTypeSelectClicked, setSearchTypeSelectClicked] = useState<boolean>(false);

  const searchTypeTendencyOption: SettingOptionData = {
    value: "tendency",
    text: "성향 검색 - 맞춤형 검색 사용"
  }

  const searchTypeSpeedOption: SettingOptionData = {
    value: "speed",
    text: "빠른 검색 - 맞춤형 검색 사용안함"
  }

  const clickedSelect = (e: MouseEvent<HTMLDivElement>) => {
    const selectedElement = e.currentTarget;
    if(selectedElement.dataset.type === "searchType") {
      setSearchTypeSelectClicked(!searchTypeSelectClicked);
    }
  }

  const changeSetting = (e: MouseEvent<HTMLLIElement>) => {
    const selectedElement = e.currentTarget;
    if(selectedElement.dataset.type === "searchType") {
      if(selectedElement.dataset.value === "tendency") {
        setSearchType(searchTypeTendencyOption);
      } else if (selectedElement.dataset.value === "speed"){
        setSearchType(searchTypeSpeedOption);
      }
    }
  }

  const saveSetting = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const settings: SettingType = {
      searchType: searchType
    }

    dispatch(settingSet(settings));
    navigate(-1);
  }

  return (
    <div>
      <form onSubmit={saveSetting}>
        <div className="container pt-1">
          <div className="row border-top-1 h-v9">
            <p className="col setting-row-title">기본 검색 설정</p>
            <div className="col pointer" data-type="searchType" onClick={clickedSelect}>
              <div className="w-v50 h-v9 lh-9vh">{searchType.text}</div>
              <ul className={"setting-select-ul " + (searchTypeSelectClicked ? "d-block" : "d-none")}>
                <li className={"setting-select-li border-1 border-bottom-0 " + (searchType.value === "tendency" ? "d-none" : "d-block")} data-type="searchType" data-value="tendency" onClick={changeSetting}>{searchTypeTendencyOption.text}</li>
                <li className={"setting-select-li border-1 " + (searchType.value === "speed" ? "d-none" : "d-block")} data-type="searchType" data-value="speed" onClick={changeSetting}>{searchTypeSpeedOption.text}</li>
              </ul>
            </div>
          </div>
          <div className="row border-top-1 border-bottom-1 h-v9">
            <Link className="col w-v100 h-v9 lh-9vh text-center" to="/logout">로그아웃</Link>
          </div>
        </div>
        <div className="setting-save-container container">
          <div className="row">
            <button className="setting-cancle-button pointer" type="button" onClick={() => { navigate(-1) }}>취소</button>
            <button className="setting-save-button pointer">확인</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Setting;