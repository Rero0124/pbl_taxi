import { useEffect, useState } from 'react';
import './App.css';
import { BrowserView, MobileView, isChrome, isEdge, isIE, isMobile } from 'react-device-detect';
import Header from 'components/layout/Header';
import ErrorPage from 'components/pages/ErrorPage';
import Navigation from 'components/layout/Navigation';
import Footer from 'components/layout/Footer';
import { RootState } from 'store/store';
import { useDispatch, useSelector } from 'react-redux';
import Section from 'components/layout/Section';
import { User, userSet } from 'store/userReducer';
import { GeoLocationPosition, locationDeny, locationSet, schdulerSet, schdulerUnSet } from 'store/locationReducer';
import { del, put } from 'util/ajax';
import { PopupParam, popupSet, popupShow } from 'store/popupReducer';
import { getDriverLocate } from 'components/pages/Popup';
import { useSearchParams } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const location = useSelector((state: RootState) => state.location);
  const [params] = useSearchParams()
  const [serverEvent, setServerEvent] = useState<EventSource | null>(null);
  const [appType, setAppType] = useState<string>("customer");

  const updateGeoLocation = async (callback?: Function) => {
    navigator.geolocation.getCurrentPosition((geoloc) => {
      const locpos: GeoLocationPosition = geoloc.coords
      dispatch(locationSet(locpos))
      if(callback) callback();
      if(appType === "driver") put(`${process.env.REACT_APP_BACKEND_URL}/user/locate`, { body: JSON.stringify({ x: locpos.longitude, y: locpos.latitude })}, () => {});
    }, (err) => {
      if(err.code === err.PERMISSION_DENIED) {
        dispatch(schdulerUnSet());
        dispatch(locationDeny());
      }
    })
  }

  useEffect(() => {
    if(user.id !== "") {
      if(serverEvent !== null) { 
        del(`${process.env.REACT_APP_BACKEND_URL}/message`, {}, () => {});
        serverEvent.close(); 
      }
      setServerEvent(new EventSource(`${process.env.REACT_APP_BACKEND_URL}/message/${appType}`, { withCredentials: true }));
    }
  }, [user, appType])

  useEffect(() => {
    if(serverEvent) {
      serverEvent.addEventListener('message', (e: MessageEvent<string>) => {
        const event: {event: string, data: any} = JSON.parse(e.data);
        const eventType = event.event;
        const data = event.data;
        const popupSetting: PopupParam = {
          type: eventType,
          data: data,
        };

        if(eventType === "called") {
          dispatch(popupSet(popupSetting));
          dispatch(popupShow());
        } else if(eventType.indexOf("matched") > -1) {
          dispatch(popupSet(popupSetting));
          dispatch(popupShow());
        } else if (eventType === "driverLocate") {
          getDriverLocate(data.x, data.y);
        } else if(eventType === "matchEnd") {
          dispatch(popupSet(popupSetting));
        }
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

    if(isMobile && params.get("setType") === "driver") setAppType("driver");

    if(location.isEnable) {
      updateGeoLocation();
      const timer = setInterval(updateGeoLocation, 5000);
      dispatch(schdulerUnSet())
      dispatch(schdulerSet(timer));
    } else {
      dispatch(schdulerUnSet());
    }
  }, [])

  useEffect(() => {
    if(location.isEnable) {
      const timer = setInterval(updateGeoLocation, 5000);
      dispatch(schdulerUnSet())
      dispatch(schdulerSet(timer));
    } else {
      dispatch(schdulerUnSet());
    }
  }, [appType])

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
