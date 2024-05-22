import styled from "styled-components";

interface Props {
  display?: number;
}

export const PopupContainer = styled.div<Props>`
  display: ${props => ( props.display ? "block" : "none" )};
  position: absolute;
  top: 0;
  left: -20vw;
  width: 100vw;
  height: 84vh;
  margin: 0 20vw;
  background-color: white;
  z-index: 100;
`;

export const PopupTopButtonContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 4vh;
`;

export const PopupTitleContainer = styled.div`
  position: absolute;
  top: 4vh;
  left: 0;
  width: 100vw;
  height: 10vh;
`;

export const PopupTitle = styled.p`

`;

export const PopupContentContainer = styled.div`
  position: absolute;
  top: 14vh;
  left: 0;
  width: 100vw;
  height: 66vh;
`
export const PopupContent = styled.p`
  
`;

export const PopupBottomButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 80vh;
  left: 0;
  width: 100vw;
  height: 4vh;
`;

export const PopupButton = styled.div`
  width: 50vw;
`;

export const PopupProfileImage = styled.img`
  max-width: 10vw;
`

export const PopupMap = styled.div`
  margin: auto;
  width: 60vw;
  height: 40vh;
`;