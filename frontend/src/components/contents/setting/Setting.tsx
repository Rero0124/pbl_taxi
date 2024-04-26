import { MouseEvent, useState } from "react";
import { SettingOptionData } from "../../../store/settingReducer";
import { SettingContainer, SettingList, SettingListItem, SettingListItemTitle, SettingListItemValueOptionContainer, SettingListItemValueContainer, SettingListItemValueInput, SettingListItemValueInputLabel, SettingListItemValueOption, SettingListItemValueSelect, SettingListItemValueSelectView, SettingListItemValueOptionFirst, SettingListItemLink } from "./StyledSetting";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const Setting = () => {
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

  return (
    <SettingContainer>
      <form>
        <SettingList>
          <SettingListItem>
            <SettingListItemTitle>기본 검색 설정</SettingListItemTitle>
            <SettingListItemValueContainer>
              <SettingListItemValueSelect data-type="searchType" onClick={clickedSelect}>
                <SettingListItemValueSelectView>{searchType.text}</SettingListItemValueSelectView>
                <SettingListItemValueOptionContainer display={searchTypeSelectClicked}>
                  <SettingListItemValueOptionFirst display={searchType.value !== "tendency"} data-type="searchType" data-value="tendency" onClick={changeSetting}>{searchTypeTendencyOption.text}</SettingListItemValueOptionFirst>
                  <SettingListItemValueOption display={searchType.value !== "speed"} data-type="searchType" data-value="speed" onClick={changeSetting}>{searchTypeSpeedOption.text}</SettingListItemValueOption>
                </SettingListItemValueOptionContainer>
              </SettingListItemValueSelect>
            </SettingListItemValueContainer>
          </SettingListItem>
          <SettingListItem>
            <SettingListItemLink to="/logout">로그아웃</SettingListItemLink>
          </SettingListItem>
        </SettingList>
      </form>
    </SettingContainer>
  );
}

export default Setting;