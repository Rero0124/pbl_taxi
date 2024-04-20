import styled from "styled-components";

interface Props {
  display?: string;
}

export const PopupContainer = styled.div<Props>`
  display: ${props => ( props.display == "none" ? "none" : "block" )};
  position: absolute;
  top: 0;
  left: -20vw;
  width: 100vw;
  height: 84vh;
  margin: 0 20vw;
  background-color: white;
  z-index: 50;
`;