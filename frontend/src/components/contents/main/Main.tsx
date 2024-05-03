import { useNavigate } from 'react-router-dom';
import { FormEvent } from 'react';
import icon from "../../../images/test-icon.png";
import { BookmarkLink, BookmarkContainer, MainBodyContainer, MainContainer, MainHeaderContainer, MenuContainer, MenuIconImg, MenuIconLink, MenuIconName, MenuTable, MenuTableTd, MenuTableTr, SearchContainer, SearchInput, SearchSubmitButton, BookmarkStick } from './StyledMain';

const Main = () => {
  const navigation = useNavigate();
  const goSearchAddress = () => {
    navigation("/map");
  }

  return (
    <MainContainer>
      <MainHeaderContainer>
        <SearchContainer>
          <SearchInput placeholder="어디로 갈까요?" onClick={goSearchAddress} />
        </SearchContainer>
        <BookmarkContainer>
          <BookmarkLink to="/map?bookmark=집">집</BookmarkLink>
          <BookmarkStick />
          <BookmarkLink to="/map?bookmark=회사">회사</BookmarkLink>
          <BookmarkStick />
          <BookmarkLink to="/">등록하기</BookmarkLink>
        </BookmarkContainer>
      </MainHeaderContainer>
      <MainBodyContainer>
        <MenuContainer>
          <MenuTable>
            <MenuTableTr>
              <MenuTableTd>
                <MenuIconLink to="/map?target=map">
                  <MenuIconImg alt="택시" src={icon}/>
                  <MenuIconName>택시</MenuIconName>
                </MenuIconLink>
              </MenuTableTd>
              <MenuTableTd>
                <MenuIconLink to="/">
                  <MenuIconImg  alt="택시 예약" src={icon}/>
                  <MenuIconName>택시 예약 (준비중)</MenuIconName>
                </MenuIconLink>
              </MenuTableTd>
              <MenuTableTd>
                <MenuIconLink to="/">
                  <MenuIconImg  alt="길찾기" src={icon}/>
                  <MenuIconName>길찾기(준비중)</MenuIconName>
                </MenuIconLink>
              </MenuTableTd>
            </MenuTableTr>
          </MenuTable>
        </MenuContainer>
      </MainBodyContainer>
    </MainContainer>
  )
}

export default Main;