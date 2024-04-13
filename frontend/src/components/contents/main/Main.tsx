import { useNavigate } from 'react-router-dom';
import { FormEvent } from 'react';
import { BookmarkButton, BookmarkContainer, MainBodyContainer, MainContainer, MainHeaderContainer, MenuContainer, MenuIconImg, MenuIconLink, MenuIconName, MenuTable, MenuTableTd, MenuTableTr, SearchContainer, SearchForm, SearchInput, SearchSubmitButton } from './StyledMain';

interface SearchFormType extends HTMLFormElement {
  searchTxt: HTMLInputElement;
}

const Main = () => {
  const navigation = useNavigate();
  const searchAddress = (e: FormEvent<SearchFormType>) => {
    e.preventDefault();
    const url = '/map?searchTxt=' + e.currentTarget.searchTxt.value;
    navigation(url);
  }

  return (
    <MainContainer>
      <MainHeaderContainer>
        <SearchContainer>
          <SearchForm action="/map" method="GET" onSubmit={searchAddress}>
            <SearchInput name="searchTxt" placeholder="어디로 갈까요?" />
            <SearchSubmitButton>검색</SearchSubmitButton>
          </SearchForm>
        </SearchContainer>
        <BookmarkContainer>
          <BookmarkButton>집</BookmarkButton>
          <BookmarkButton>회사</BookmarkButton>
        </BookmarkContainer>
      </MainHeaderContainer>
      <MainBodyContainer>
        <MenuContainer>
          <MenuTable>
            <MenuTableTr>
              <MenuTableTd>
                <MenuIconLink to="/map">
                  <MenuIconImg alt="택시"/>
                  <MenuIconName>택시</MenuIconName>
                </MenuIconLink>
              </MenuTableTd>
              <MenuTableTd>
                <MenuIconLink to="/">
                  <MenuIconImg  alt="택시 예약"/>
                  <MenuIconName>택시 예약 (준비중)</MenuIconName>
                </MenuIconLink>
              </MenuTableTd>
              <MenuTableTd>
                <MenuIconLink to="/">
                  <MenuIconImg  alt="길찾기"/>
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