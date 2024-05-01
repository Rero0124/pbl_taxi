import styled from "styled-components"

export const MapPageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 84vh;
`;

export const MapSearchContainer = styled.div`
  position: absolute;
  top: 0%;
  left: 0;
  width: 100vw;
  height: 10vh;
  z-index: 150;
`

export const MapSearchForm = styled.form`
  
`;

export const MapSearchInput = styled.input`
  
`;

export const MapContainer = styled.div`
  width: 100vw;
  height: 84vh;
  @supports (-webkit-appearance:none) and (stroke-color: transparent) {
    height: 70vh
  }
`;