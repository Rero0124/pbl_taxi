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

export const SearchInput = styled.input`
  width: 40vh;
  height: 3.2vh;
  max-width: 40vw;
  margin-right: 1vh;
`;

export const SearchSubmitButton = styled.button`
  width: 10vh;
  height: 3.2vh;
  max-width: 10vw;
  border-radius: 0.5vh;
`;

export const BookmarkContainer = styled.div`
  display: flex;
  width: 80vw;
  height: 4vh;
  margin-top: 0.4vh;
  justify-content: center;
  align-items: center;
`;

export const BookmarkLink = styled(Link)`
  height: 3.2vh;
  margin: 0 0.1vh;
  padding: 0 1vh;
  text-decoration: none;
`;

export const BookmarkStick = styled.span`
  display: inline-block;
  width: 2px;
  height: 2.4vh;
  margin-top: -0.9vh;
  background-color: gray;
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
  height: 10vh;
  justify-content: center;
  align-items: center;
`;

export const MenuTableTd = styled.div`
  width: 10vh;
  height: 10vh;
  max-width: 10vw;
  max-height: 10vw;
  margin: 1vh;
`;

export const MenuIconLink = styled(Link)`
  display: flex;
  width: 10vh;
  height: 10vh;
  max-width: 10vw;
  max-height: 10vw;
  flex-direction: column;
  text-decoration: none;
`;

export const MenuIconImg = styled.img`
  width: 10vh;
  height: 8vh;
  max-width: 10vw;
  max-height: 8vw;
  object-fit: fill;
`;

export const MenuIconName = styled.span`
  width: 10vh;
  height: 2vh;
  max-width: 10vw;
  max-height: 2vw;
`;