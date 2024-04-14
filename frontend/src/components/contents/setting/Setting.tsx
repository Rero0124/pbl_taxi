import { customSelect } from "../../../util/form";
import { SettingContainer, SettingList, SettingListItem, SettingListItemTitle, SettingListItemValueOptionContainer, SettingListItemValueContainer, SettingListItemValueInput, SettingListItemValueInputLabel, SettingListItemValueOption, SettingListItemValueSelect, SettingListItemValueSelectView, SettingListItemValueOptionFirst, SettingListItemLink } from "./StyledSetting";

const Setting = () => {
  const customSelectElement = {
    selectId: SettingListItemValueSelect.styledComponentId,
    viewId: SettingListItemValueSelectView.styledComponentId,
    optionContainerId: SettingListItemValueOptionContainer.styledComponentId
  }
  customSelect(customSelectElement, {default: "tendency"})
  return (
    <SettingContainer>
      <SettingList>
        <SettingListItem>
          <SettingListItemTitle>기본 검색 설정</SettingListItemTitle>
          <SettingListItemValueContainer>
            <SettingListItemValueSelect>
              <SettingListItemValueSelectView />
              <SettingListItemValueOptionContainer>
                <SettingListItemValueOptionFirst data-value="tendency">성향 검색 - 맞춤형 검색을 사용합니다</SettingListItemValueOptionFirst>
                <SettingListItemValueOption data-value="speed">빠른 검색 - 맞춤형 검색을 사용하지 않습니다.</SettingListItemValueOption>
              </SettingListItemValueOptionContainer>
            </SettingListItemValueSelect>
          </SettingListItemValueContainer>
        </SettingListItem>
        <SettingListItem>
          <SettingListItemLink to="/logout">로그아웃</SettingListItemLink>
        </SettingListItem>
      </SettingList>
    </SettingContainer>
  );
}

export default Setting;