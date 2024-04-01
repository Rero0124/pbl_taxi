import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserView, MobileView, isIE } from 'react-device-detect';
import NotSupport from './components/pages/NotSupport';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import { RootState, useStore } from './store/store';
import { Provider, useSelector } from 'react-redux';
import Section from './components/layout/Section';

function App() {
  const user = useSelector((state: RootState) => state.user);
  const [serverEvent, setServerEvent] = useState<EventSource | null>(null);

  useEffect(() => {
    if(user.id !== "") {
      if(serverEvent !== null) { serverEvent.close(); }
      setServerEvent(new EventSource(`${process.env.REACT_APP_BACKEND_URL}/driver/${user.id}`));
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
