import icon from "../../../images/test-icon.png";
import { HeaderContainer, HeaderTitleContainer, HeaderTitleLogo, HeaderTitle, HeaderTitleSpan } from './StyledHeader';

const Header = (): JSX.Element => {

  return (
    <HeaderContainer>
      <HeaderTitleContainer>
        <HeaderTitleLogo alt="로고" src={icon} />
        <HeaderTitle>
          PBL_TAXT <HeaderTitleSpan>0.1</HeaderTitleSpan>
        </HeaderTitle>
      </HeaderTitleContainer>
    </HeaderContainer>
  )
}

export default Header;
