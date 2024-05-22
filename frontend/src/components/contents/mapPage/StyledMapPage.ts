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

export const MapSearchResultContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MapSearchResultRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const MapSearchResultRowImage = styled.img`
  width: 10vw;
`;

export const MapSearchResultRowTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70vw;
`;

export const MapSearchResultRowMainTitle = styled.h2`
  margin: 0;
`;

export const MapSearchResultRowSubTitle = styled.h4`
  margin: 0;
`;

export const MapContainer = styled.div`
  width: 100vw;
  height: 84vh;
  @supports (-webkit-appearance:none) and (stroke-color: transparent) {
    height: 70vh
  }
`;