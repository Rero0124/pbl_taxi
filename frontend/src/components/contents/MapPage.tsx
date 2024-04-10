import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { CSSProperties, useEffect, useRef, useState } from "react";
import markerImage from "../../images/marker.png";
import { Coordinate } from "ol/coordinate";
import fetchJsonp from "fetch-jsonp";
import Text from "ol/style/Text";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { GeoLocationPosition, locationDeny, locationSet, schdulerSet, schdulerUnSet } from "../../store/locationReducer";
import { useSearchParams } from "react-router-dom";

interface UserLocateAndTendency {
  userId: string,
  geom: string,
  distance: number,
  inward: boolean,
  quickly: boolean,
  song: boolean,
  songName: string | null
}

interface AddressResponse {
  response: {
    result: {
      structure: {
        detail: string;
        level0: string;
        level1: string;
        level2: string;
        level3: string;
        level4A: string;
        level4AC: string;
        level4L: string;
        level4LC: string;
        level5: string;
      },
      text: string;
      type: string;
      zipcode: string;
    }[]
  }
}

interface LocateResponse {
  response: {
    result: {
      crs: string;
      type: string;
      items: {
        id: number;
        title?: string;
        category?: string;
        district?: string;
        address?: {
          zipcode?: string,
          category?: string,
          road: string,
          parcel: string;
          bldnm?: string;
          bldnmdc?: string;
        };
        geometry?: string;
        point: {
          x: number;
          y: number;
        };
      }[]
    }
  }
}

const style: CSSProperties = {
  width: "100%",
  height: "84vh"
}

const baseLayer = new TileLayer({
  visible: true,
  source: new XYZ({
    url: "http://api.vworld.kr/req/wmts/1.0.0/" + process.env.REACT_APP_VWORLD_KEY + "/Base/{z}/{y}/{x}.png",
    crossOrigin: "anonymous",
  }),
  zIndex: -1
})

const addressSearch = async (coordinate: Coordinate): Promise<AddressResponse> => {
  const url = `https://api.vworld.kr/req/address?key=${process.env.REACT_APP_VWORLD_KEY}&` +
                `service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${coordinate[0]},${coordinate[1]}&format=json&type=both&zipcode=true&simple=false`
  
  const data: AddressResponse = await (await fetchJsonp(url)).json();
  return data;
}

const locateSearch = async (searchTxt: string): Promise<LocateResponse> => {
  const getUrl = (type: string) => `https://api.vworld.kr/req/search?service=search&request=search&version=2.0&crs=EPSG:4326&query=${searchTxt}&type=${type}&format=json&errorformat=json&key=${process.env.REACT_APP_VWORLD_KEY}`
  
  const data: LocateResponse = await (await fetchJsonp(getUrl("place"))).json();
  return data;
}

const MapPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const location = useSelector((state: RootState) => state.location);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [map, setMap] = useState<Map | null>();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [marker, setMarker] = useState<Feature<Point>>();
  const [markerStyle, setMarkerStyle] = useState<Style>();
  const [addLayer, setAddLayer] = useState<Layer | null>();
  const [resetMap, setResetMap] = useState<boolean>(false);
  const [runFunction, setRunFunction] = useState<Function | null>(null);
  const [nearUsers, setNearUsers] = useState<UserLocateAndTendency[]>([]);
  const init = useRef(true);

  const updateGeoLocation = async (callback?: Function) => {
    navigator.geolocation.getCurrentPosition((geoloc) => {
      const locpos: GeoLocationPosition = geoloc.coords
      dispatch(locationSet(locpos))
      if(callback) callback();
      fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user.id}/locate`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ x: locpos.longitude, y: locpos.latitude })
      });
    }, (err) => {
      if(err.code === err.PERMISSION_DENIED) {
        dispatch(schdulerUnSet());
        dispatch(locationDeny());
      }
    })
  }

  useEffect(() => {
    if(resetMap && marker && markerStyle) {
      (async () => {
        const centerAddress = await addressSearch([location.location.longitude, location.location.latitude])
        const centerAddressText = centerAddress.response.result[centerAddress.response.result.length === 2 ? 1 : 0].text
        const markerSource = new VectorSource();
        
        markerStyle?.setText(new Text({
          text: centerAddressText, 
          scale: 1,
        }));
        
        markerSource.addFeature(marker);
    
        const markerLayer = new VectorLayer({
          source: markerSource,
          style: markerStyle
        })

        const newMap = new Map({
          target: 'map',
          layers: [markerLayer, baseLayer],
          view: new View({
            center: [location.location.longitude, location.location.latitude],
            zoom: 16,
            minZoom: 7,
            maxZoom: 18,
            projection : 'EPSG:4326'
          }),
          controls: []
        });

        newMap.on('click', async function (e) {
          const address = await addressSearch(e.coordinate);
          const addressText = address.response.result[address.response.result.length === 2 ? 1 : 0].text;
          marker.getGeometry()?.setCoordinates(e.coordinate);
          markerStyle?.setText(new Text({
            text: addressText, 
            scale: 1,
          }));
          const params = {
            x: e.coordinate[0].toString(),
            y: e.coordinate[1].toString()
          };
          const query = new URLSearchParams(params).toString()
          const users: UserLocateAndTendency[] = await fetch(`${process.env.REACT_APP_BACKEND_URL}/search/near/user/${user.id}/locate?${query}`).then(res => res.json());
          fetch(`${process.env.REACT_APP_BACKEND_URL}/driver/message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: "테스트임",
              messageType: "search",
              userIds: [user.id]
            })
          })
          setNearUsers(users);
        });

        setMap(newMap);
        setLayers([baseLayer, markerLayer]);
        setResetMap(false);
        
      })()
    }
  }, [resetMap])

  useEffect(() => {
    if(location.isEnable) {
      if(init.current) {
        updateGeoLocation(() => {
          init.current = false;
          setResetMap(true);
        });
      }
      const timer = setInterval(updateGeoLocation, 5000);
      dispatch(schdulerSet(timer));
    } else {
      if(init.current) {
        init.current = false;
        setMarker(new Feature({
          geometry: new Point([location.location.longitude, location.location.latitude])
        }));

        setMarkerStyle(new Style({
          image: new Icon({
            opacity: 1,
            scale: 0.1,
            src: markerImage
          }),
          zIndex: 100
        }));

        setResetMap(true);
      }
      dispatch(schdulerUnSet());
    }
  }, [])
  

  useEffect(() => {
    if(addLayer) {
      if(map) map.addLayer(addLayer);
      const nowLayers = layers;
      setLayers([...nowLayers, addLayer])
      setAddLayer(null);
    }
  }, [addLayer]);

  useEffect(() => {
    if(map !== null && runFunction !== null) {
      (async () => {
        await runFunction();
        setRunFunction(null);
      })()
    }
  }, [map, runFunction])

  useEffect(() => {
    const searchTxt = searchParams.get("searchTxt");
    if(searchTxt) {
      setRunFunction(() => async () => {
        if(map) {
          const result = (await locateSearch(searchTxt)).response.result;
          if(result.items.length > 0) {
            const point = result.items[0].point;
            const nowCenter = map.getView().getCenter();
            if(nowCenter) {
              map.getView().setCenter([point.x, point.y]);
              marker?.getGeometry()?.setCoordinates([point.x, point.y]);
              markerStyle?.setText(new Text({
                text: result.items[0].address?.road,  
                scale: 1,
              }))
            }
          }
        } 
      });
    }
  }, [searchParams])

  return (
    <div className="main">
      <div id='map' style={style}></div>
    </div>
  )
}

export default MapPage;