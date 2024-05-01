import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { useEffect, useState } from "react";
import markerImage from "../../../images/marker.png";
import { Coordinate } from "ol/coordinate";
import fetchJsonp from "fetch-jsonp";
import Text from "ol/style/Text";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useSearchParams } from "react-router-dom";
import { MapContainer, MapPageContainer } from "./StyledMapPage";
import { get } from "../../../util/ajax";

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
    record: {
      current: number;
      total: number;
    };
    result?: {
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
  const location = useSelector((state: RootState) => state.location);
  const setting = useSelector((state: RootState) => state.setting);
  
  const [searchParams] = useSearchParams();

  const [currentElement, setCurrentElement] = useState<JSX.Element>(<></>)

  const mapPage = (
    <MapContainer id="map"></MapContainer>
  );

  const searchPage = (
    <></>
  );

  const setMap = async () => {
    let centerCoordinate = [126.97831737391309, 37.566619172927574];
    let centerText = "시청";
    let searchFail = false;

    const searchTxt = searchParams.get("searchTxt");
    if(searchTxt !== null && searchTxt !== "") {
      const res = (await locateSearch(searchTxt)).response;
      if(res.record.current > 0 && res.result?.items[0].address) {
        const point = res.result.items[0].point;
        centerCoordinate = [Number(point.x), Number(point.y)];
        centerText = res.result.items[0].address.road;
      } else {
        searchFail = true;
      }
    }
    
    if(searchTxt === null || searchTxt === "" || searchFail){
      centerCoordinate = [location.location.longitude, location.location.latitude];
      const address = await addressSearch(centerCoordinate)
      centerText = address.response.result[address.response.result.length === 2 ? 1 : 0].text;
    }
    
    const markerSource = new VectorSource();

    const markerFeature = new Feature({
      geometry: new Point(centerCoordinate)
    });

    markerSource.addFeature(markerFeature);
    
    const markerLayerStyle = new Style({
      image: new Icon({
        opacity: 1,
        scale: 0.1,
        src: markerImage
      }),
      text: new Text({
        text: centerText, 
        scale: 1,
      }),
      zIndex: 100
    })

    const markerLayer = new VectorLayer({
      source: markerSource,
      style: markerLayerStyle
    })

    const newMap = new Map({
      target: 'map',
      layers: [baseLayer, markerLayer],
      view: new View({
        center: centerCoordinate,
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
      
      markerFeature.getGeometry()?.setCoordinates(e.coordinate);

      markerLayerStyle.setText(new Text({
        text: addressText, 
        scale: 1,
      }));

      const params = {
        x: e.coordinate[0].toString(),
        y: e.coordinate[1].toString()
      };

      const query = new URLSearchParams(params).toString()
      await get(`${process.env.REACT_APP_BACKEND_URL}/search/${setting.searchType.value}?${query}`, {}, (data: BackendResponseData<UserLocateAndTendency[]>) => {});
    });
  }

  useEffect(() => {
    setCurrentElement(mapPage);
    setMap();
  }, [])

  return (
    <MapPageContainer>
      {currentElement}
    </MapPageContainer>
  )
}

export default MapPage;