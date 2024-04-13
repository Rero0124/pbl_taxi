import { Link } from "react-router-dom";
import styled from "styled-components"

export const MainContainer = styled.div`
  padding: 0 10vw;
  width: 80vw;
  height: 84vh;
`;

export const MainHeaderContainer = styled.div`
  display: flex;
  width: 80vw;
  height: 8.4vh;
  flex-direction: column;
`;

export const SearchContainer = styled.div`
  width: 80vw;
  height: 4vh;
`;

export const SearchForm = styled.form`
  display: flex;
  width: 80vw;
  height: 4vh;
  justify-content: center;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 30vw;
  height: 3.2vh;
  margin-right: 3vh;
`;

export const SearchSubmitButton = styled.button`
  width: 10vw;
  height: 3.2vh;
  border-radius: 0.5vh;
`;

export const BookmarkContainer = styled.div`
  display: flex;
  width: 80vw;
  height: 4vh;
  margin-top: 0.4vh;
  justify-content: center;
`;

export const BookmarkButton = styled.button`
  width: 6vw;
  height: 3.2vh;
  margin-right: 0.3vh;
  border-radius: 0.5vh;
`;

export const MainBodyContainer = styled.div`
  display: flex;
  width: 80vw;
  height: 75.6vh;
  flex-direction: column;
`;

export const MenuContainer = styled.div`
  width: 80vw;
  height: 75.6vh;
`;

export const MenuTable = styled.div`
  display: flex;
  width: 80vw;
  flex-direction: column;
  justify-content: center;
`;

export const MenuTableTr = styled.div`
  display: flex;
  width: 80vw;
  height: 8.5vw;
  justify-content: center;
  align-items: center;
`;

export const MenuTableTd = styled.div`
  width: 8.5vw;
  height: 8.5vw;
  margin: 1vw;
`;

export const MenuIconLink = styled(Link)`
  display: flex;
  width: 8.5vw;
  height: 8.5vw;
  flex-direction: column;
`;

export const MenuIconImg = styled.img`
  width: 8.5vw;
  height: 7vw;
`;

export const MenuIconName = styled.span`
  width: 8.5vw;
  height: 1.5vw;
`;