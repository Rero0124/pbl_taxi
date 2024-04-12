import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6vh;
`;

export const HeaderTitleContainer = styled.div`
  display: flex;
  width: 80%;
  text-align: left;
`;

export const HeaderTitleLogo = styled.img`
  margin-left: 3vh;
`;

export const HeaderTitle = styled.p`
  
`;

export const HeaderTitleSpan = styled.span`
  
`;

export const HeaderLogoutContainer = styled.div`
  width: 20%;
  margin-right: 3vh;
  text-align: end;
`;

export const HeaderLogout = styled.p`

`;

export const HeaderLogoutLink = styled(Link)`

`;