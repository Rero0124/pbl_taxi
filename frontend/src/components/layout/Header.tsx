
import { Link } from 'react-router-dom';
import '../../styles/Layout.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Header = (): JSX.Element => {
  const isLogin = useSelector((state: RootState) => state.user.id !== '');

  return (
    <div className="header">
      <div className="header-logo-container">
        <img className="header-logo"></img>
        <p className="header-title">
          JOB-MANAGEMENT <span className="header-title-span">0.1</span>
        </p>
      </div>
      {
        isLogin ? (
          <div className="header-logout-container">
            <Link className="header-logout-link" to="/logout">로그아웃</Link>
          </div>
        ) : (<></>)
      }
    </div>
  )
}

export default Header;
