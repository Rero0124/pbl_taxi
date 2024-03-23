import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserView, MobileView, isIE } from 'react-device-detect';
import NotSupport from './components/pages/NotSupport';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import { useStore } from './store/store';
import { Provider } from 'react-redux';
import Section from './components/layout/Section';

function App() {
  const store = useStore;

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
            <Provider store={store}>
              <Header />
              <Section />
              <Navigation />
              <Footer />
            </Provider>
          </>
        )}
      </BrowserView>
    </div>
  );
}

export default App;
