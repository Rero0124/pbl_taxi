import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import icon from "../../../images/test-icon.png";
import { HeaderContainer, HeaderLogoutContainer, HeaderLogoutLink, HeaderLogout, HeaderTitleContainer, HeaderTitleLogo, HeaderTitle, HeaderTitleSpan } from './StyledHeader';

const Header = (): JSX.Element => {
  const isLogin = useSelector((state: RootState) => state.user.id !== '');

  return (
    <HeaderContainer>
      <HeaderTitleContainer>
        <HeaderTitleLogo alt="로고" src={icon} />
        <HeaderTitle>
          PBL_TAXT <HeaderTitleSpan>0.1</HeaderTitleSpan>
        </HeaderTitle>
      </HeaderTitleContainer>
      {
        isLogin ? (
          <HeaderLogoutContainer>
            <HeaderLogout>
              <HeaderLogoutLink to="/logout">로그아웃</HeaderLogoutLink>
            </HeaderLogout>
          </HeaderLogoutContainer>
        ) : (<></>)
      }
    </HeaderContainer>
  )
}

export default Header;
