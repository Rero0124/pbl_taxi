import { Link, useNavigate } from 'react-router-dom';
import { FormEvent } from 'react';
import { BookmarkButton, BookmarkContainer, MainBodyContainer, MainContainer, MainHeaderContainer, MenuContainer, MenuIconImg, MenuIconLink, MenuIconName, MenuTable, MenuTableTd, MenuTableTr, SearchContainer, SearchForm, SearchInput, SearchSubmitButton } from './StyledMain';

interface SearchForm extends HTMLFormElement {
  searchTxt: HTMLInputElement;
}

const Main = () => {
  const navigation = useNavigate();
  const searchAddress = (e: FormEvent<SearchForm>) => {
    e.preventDefault();
    const url = '/map?searchTxt=' + e.currentTarget.searchTxt.value;
    navigation(url);
  }

  return (
    <MainContainer className="main-container">
      <MainHeaderContainer className="main-header">
        <SearchContainer className="search-container">
          <SearchForm action="/map" method="GET" onSubmit={searchAddress}>
            <SearchInput className="search-input" name="searchTxt" placeholder="어디로 갈까요?" />
            <SearchSubmitButton className="search-button">검색</SearchSubmitButton>
          </SearchForm>
        </SearchContainer>
        <BookmarkContainer className="favorite-container">
          <BookmarkButton className="favorite-button">집</BookmarkButton>
          <BookmarkButton className="favorite-button">회사</BookmarkButton>
        </BookmarkContainer>
      </MainHeaderContainer>
      <MainBodyContainer className="main-body">
        <MenuContainer>
          <MenuTable className="menu-button-container">
            <MenuTableTr>
              <MenuTableTd>
                <MenuIconLink to="/map">
                  <MenuIconImg />
                  <MenuIconName>택시</MenuIconName>
                </MenuIconLink>
              </MenuTableTd>
              <MenuTableTd>
                <MenuIconLink to="/">
                  <MenuIconImg />
                  <MenuIconName>택시 예약(준비중)</MenuIconName>
                </MenuIconLink>
              </MenuTableTd>
              <MenuTableTd>
                <MenuIconLink to="/">
                  <MenuIconImg />
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