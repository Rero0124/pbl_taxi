import { useEffect, useState } from 'react';
import './App.css';
import { BrowserView, MobileView, isIE, isMobile } from 'react-device-detect';
import Header from './components/layout/header/Header';
import ErrorPage from './components/pages/error/ErrorPage';
import Navigation from './components/layout/navigation/Navigation';
import Footer from './components/layout/footer/Footer';
import { RootState } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import Section from './components/layout/section/Section';
import { User, userSet } from './store/userReducer';
import { GeoLocationPosition, locationDeny, locationSet, schdulerSet, schdulerUnSet } from './store/locationReducer';
import { put } from './util/ajax';

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const location = useSelector((state: RootState) => state.location);
  const [serverEvent, setServerEvent] = useState<EventSource | null>(null);
  const [appType, setAppType] = useState<string>("customer");

  const updateGeoLocation = async (callback?: Function) => {
    navigator.geolocation.getCurrentPosition((geoloc) => {
      const locpos: GeoLocationPosition = geoloc.coords
      dispatch(locationSet(locpos))
      if(callback) callback();
      put(`${process.env.REACT_APP_BACKEND_URL}/user/locate`, {
        body: JSON.stringify({ x: locpos.longitude, y: locpos.latitude })
      }, (data: BackendResponseData) => {
        
      });
    }, (err) => {
      if(err.code === err.PERMISSION_DENIED) {
        dispatch(schdulerUnSet());
        dispatch(locationDeny());
      }
    })
  }

  useEffect(() => {
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

    if(location.isEnable) {
      updateGeoLocation();
      const timer = setInterval(updateGeoLocation, 5000);
      dispatch(schdulerSet(timer));
    } else {
      dispatch(schdulerUnSet());
    }
  }, [])

  return (
    <div className="App">
      <MobileView>
        <ErrorPage contentType="모바일"/> 
      </MobileView>
      <BrowserView>
        { isIE ? ( 
          <ErrorPage contentType="IE 브라우저"/> 
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
