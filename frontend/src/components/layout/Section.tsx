import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import Login from 'components/contents/auth/Login';
import Register from 'components/contents/auth/Register';
import Logout from 'components/contents/auth/Logout';
import Tendency from 'components/contents/Tendency';
import MapPage from 'components/contents/MapPage';
import Main from 'components/contents/Main';
import MyPage from 'components/contents/MyPage';
import ErrorPage from 'components/pages/ErrorPage';
import Setting from 'components/contents/Setting';
import Popup from 'components/pages/Popup';
import Profile from 'components/contents/Profile';
import "styles/Layout.css";

const Section = (): JSX.Element => {
  const isLogin = useSelector((state: RootState) => state.user.id !== '');
  

  return (
    <div className="section-container">
      <Popup />
      {!isLogin ? (
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/logout" element={<Navigate replace to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<ErrorPage contentType="404" />} />
          <Route path="/" element={<Main />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/tendency" element={<Tendency/>} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/setting" element={<Setting />}/>
          <Route path="/login" element={<Navigate replace to="/" />} />
          <Route path="/register" element={<Navigate replace to="/" />} />
          <Route path="/logout" element={<Logout />}/>
        </Routes>
      )}
    </div>
  )
}

export default Section;