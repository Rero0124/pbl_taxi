
import { Link } from 'react-router-dom';
import '../../styles/Layout.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Header = (): JSX.Element => {
  const isLogin = useSelector((state: RootState) => state.user.id !== '');

  return (
    <div className="header">
      <div className="header-title-container">
        <img className="header-logo" alt="로고"></img>
        <p className="header-title">
          PBL_TAXT <span className="header-title-span">0.1</span>
        </p>
      </div>
      {
        isLogin ? (
          <div className="header-logout-container">
            <p><Link className="header-logout-link" to="/logout">로그아웃</Link></p>
          </div>
        ) : (<></>)
      }
    </div>
  )
}

export default Header;
