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
  z-index: 50;
`;

export const PopupTitle = styled.p`
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 20vh;
  margin: 0 20vw;
`;

export const PopupContent = styled.div`
  position: relative;
  top: 20vh;
  left: 0;
  width: 100vw;
  height: 64vh;
  margin: 0 20vw;
`;