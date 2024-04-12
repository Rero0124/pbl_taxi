import { Link } from "react-router-dom";
import styled from "styled-components"

export const NavigationContainer = styled.div`
  position: absolute;
  display: flex;
  left: 0px;
  bottom: 6vh;
  width: 100%;
  height: 4vh;
`;

export const NavigationUl = styled.ul`
  display: flex;
  width: 100%;
  justify-content: space-around;
  list-style: none;
`;

export const NavigationLi = styled.li`
  display: inline;
  float: left;
`;

export const NavigationLink = styled(Link)`
  padding: 20px;
  text-decoration: none;
  color: black;
`;