import { Link } from "react-router-dom";
import styled from "styled-components";

export const MyPageContainer = styled.div`
  width: 80vw;
  height: 84vh;
  padding: 0 10vw;
`;

export const MyPageHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 80vw;
  height: 11vh;
`;

export const MyPageHeaderProfileImg = styled.img`

`;

export const MyPageHeaderName = styled.p`

`;

export const MyPageBodyContainer = styled.div`
  width: 80vw;
  height: 73vh;
`;

export const MyPageBodyIconContainer = styled.div`
  width: 80vw;
  height: 73vh;
`;

export const MyPageBodyIconTable = styled.div`
  display: flex;
  width: 80vw;
  flex-direction: column;
  justify-content: center;
`;

export const MyPageBodyIconTableTr = styled.div`
  display: flex;
  width: 80vw;
  height: 10vh;
  justify-content: center;
  align-items: center;
`;

export const MyPageBodyIconTableTd = styled.div`
  width: 10vh;
  height: 10vh;
  max-width: 10vw;
  max-height: 10vw;
  margin: 1vh;
`;

export const MyPageBodyIconLink = styled(Link)`
  display: flex;
  width: 10vh;
  height: 10vh;
  max-width: 10vw;
  max-height: 10vw;
  flex-direction: column;
  text-decoration: none;
`;

export const MyPageBodyIconImg = styled.img`

`;

export const MyPageBodyIconName = styled.span`

`;