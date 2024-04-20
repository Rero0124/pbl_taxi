import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Login from '../../contents/auth/login/Login';
import Register from '../../contents/auth/register/Register';
import Logout from '../../contents/auth/logout/Logout';
import Tendency from '../../contents/tendency/Tendency';
import MapPage from '../../contents/mapPage/MapPage';
import Main from '../../contents/main/Main';
import MyPage from '../../contents/myPage/MyPage';
import ErrorPage from '../../pages/error/ErrorPage';
import { SectionContainer } from './StyledSection';
import Setting from '../../contents/setting/Setting';
import Popup from '../popup/Popup';
import { useState } from 'react';

const Section = (): JSX.Element => {
  const isLogin = useSelector((state: RootState) => state.user.id !== '');
  

  return (
    <SectionContainer>
      <Popup/>
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
          <Route path="/setting" element={<Setting />}/>
          <Route path="/login" element={<Navigate replace to="/" />} />
          <Route path="/register" element={<Navigate replace to="/" />} />
          <Route path="/logout" element={<Logout />}/>
        </Routes>
      )}
    </SectionContainer>
  )
}

export default Section;