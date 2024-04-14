import { Link } from "react-router-dom";
import styled from "styled-components";

export const SettingContainer = styled.div`
  
`;

export const SettingList = styled.div`
  display: flex;
  width: 100vw;
  border-top: 0.1vh solid black;
  flex-direction: column;
  align-items: center;
`;

export const SettingListItem = styled.div`
  display: flex;
  width: 100vw;
  height: 9vh;
  border-bottom: 0.1vh solid black;
  justify-content: space-around;
  align-items: center;
`;

export const SettingListItemLink = styled(Link)`
  width: 100vw;
  height: 9vh;
  line-height: 9vh;
`;

export const SettingListItemTitle = styled.label`
  width: calc(50vw - 0.1vh);
  height: 9vh;
  border-right: 0.1vh solid black;
  line-height: 9vh;
`;

export const SettingListItemValueContainer = styled.div`
  display: flex;
  width: 50vw;
  justify-content: space-around;
`;

export const SettingListItemValueSelect = styled.div`
  position: relative;
  width: 50vw;
  height: 9vh;
  cursor: point;
`;

export const SettingListItemValueSelectView = styled.div`
  width: 50vw;
  height: 9vh;
  line-height: 9vh;
`;

export const SettingListItemValueOptionContainer = styled.ul`
  display: none;
  position: absolute;
  top: 9vh;
  left: 0px;
  width: 50vw;
  height: 9vh;
  margin: 0px;
  padding: 0px;
  list-style: none;
  z-index: 10;
`;

export const SettingListItemValueOption = styled.li`
  display: block;
  text-align: center;
  line-height: 9vh;
  border: 0.1vh solid black;
  background-color: white;
  opacity: 1;
`;

export const SettingListItemValueOptionFirst = styled(SettingListItemValueOption)`
  border-bottom: 0;
`;

export const SettingListItemValueInput = styled.input`

`;

export const SettingListItemValueInputLabel = styled.label`

`;