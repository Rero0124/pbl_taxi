import { Route, Routes, Navigate } from 'react-router-dom';
import Page404 from '../pages/Page404';
import '../../styles/Layout.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Login from '../contents/Login';
import Register from '../contents/Register';
import Logout from '../contents/Logout';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Tendency from '../contents/Tendency';
import MapPage from '../contents/MapPage';
import Main from '../contents/Main';
import MyPage from '../contents/MyPage';

const Section = (): JSX.Element => {
  const isLogin = useSelector((state: RootState) => state.user.id !== '');

  return (
    <div className="section">
      {!isLogin ? (
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/logout" element={<Navigate replace to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<Page404 />} />
          <Route path="/" element={<Main />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/tendency" element={<Tendency/>} />
          <Route path="/login" element={<Navigate replace to="/" />} />
          <Route path="/register" element={<Navigate replace to="/" />} />
          <Route path="/logout" element={<Logout />}/>
        </Routes>
      )}
    </div>
  )
}

export default Section;