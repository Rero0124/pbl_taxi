import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserView, MobileView, isIE, isMobile } from 'react-device-detect';
import NotSupport from './components/pages/NotSupport';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import { RootState, useStore } from './store/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Section from './components/layout/Section';
import { User, userSet } from './store/userReducer';

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const [serverEvent, setServerEvent] = useState<EventSource | null>(null);
  const [appType, setAppType] = useState<string>("customer");

  useEffect(() => {
    console.log(user.id !== "")
    if(user.id !== "") {
      if(serverEvent !== null) { serverEvent.close(); }
      setServerEvent(new EventSource(`${process.env.REACT_APP_BACKEND_URL}/driver`, { withCredentials: true }));
    }
  }, [user])

  useEffect(() => {
    if(serverEvent) {
      serverEvent.addEventListener('message', (e) => {
        console.log(e.data);
        return;
      })
    }
  }, [serverEvent])

  useEffect(() => {
    if(user.id === '') {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
        method: 'GET',
        credentials: 'include'
      }).then((res: Response) => res.json()).then((data: BackendResponseData<User>) => {
        dispatch(userSet(data.data));
      })
    }

    if(isMobile) setAppType("driver");
  }, [])

  return (
    <div className="App">
      <MobileView>
        <NotSupport browserType="모바일"/> 
      </MobileView>
      <BrowserView>
        { isIE ? ( 
          <NotSupport browserType="IE 브라우저"/> 
        ) : (
          <>
            <Header />
            <Section />
            <Navigation />
            <Footer />
          </>
        )}
      </BrowserView>
    </div>
  );
}

export default App;
