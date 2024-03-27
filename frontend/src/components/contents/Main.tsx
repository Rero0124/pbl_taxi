import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import markerImage from "../../images/marker.png";
import { Coordinate, add } from "ol/coordinate";
import fetchJsonp from "fetch-jsonp";
import Text from "ol/style/Text";

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

const Main = () => {
  const geolocation = useGeolocation();
  const [map, setMap] = useState<Map | null>();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [addLayer, setAddLayer] = useState<Layer | null>();
  const [center, setCenter] = useState<Coordinate | [number, number]>([126.97831737391309, 37.566619172927574]);
  const [resetMap, setResetMap] = useState<boolean>(false);
  const init = useRef(true);
  const isGetLocation = useRef(true);

  useEffect(() => {
    if(resetMap) {
      (async () => {
        const centerAddress = await addressSearch(center)
        const centerAddressText = centerAddress.response.result[centerAddress.response.result.length === 2 ? 1 : 0].text
        const markerSource = new VectorSource();
      
        const markerFeature = new Feature({
          geometry: new Point(center)
        })
      
        const markerStyle = new Style({
          image: new Icon({
            opacity: 1,
            scale: 0.1,
            src: markerImage
          }),
          text: new Text({
            text: centerAddressText,
            scale: 1,
          }),
          zIndex: 100
        }) 
      
        markerSource.addFeature(markerFeature);
    
        const markerLayer = new VectorLayer({
          source: markerSource,
          style: markerStyle
        })

        const newMap = new Map({
          target: 'map',
          layers: [markerLayer, baseLayer],
          view: new View({
            center: center,
            zoom: 16,
            minZoom: 7,
            maxZoom: 18,
            projection : 'EPSG:4326'
          }),
          controls: []
        });

        newMap.on('click', async function (e) {
          const address = await addressSearch(e.coordinate);
          const addressText = address.response.result[address.response.result.length === 2 ? 1 : 0].text
          markerFeature.getGeometry()?.setCoordinates(e.coordinate);
          markerStyle.setText(new Text({
            text: addressText,
            scale: 1,
          }));
        });

        setMap(newMap);
        setLayers([baseLayer, markerLayer]);
        setResetMap(false);
      })()
    }
  }, [resetMap])

  useEffect(() => {
    if(isGetLocation.current) {
      if(geolocation.error?.PERMISSION_DENIED) {
        isGetLocation.current = false;
        if(init.current) {
          setCenter([126.97831737391309, 37.566619172927574]);
          init.current = false;
          setResetMap(true);
        }
      } else if(geolocation.longitude && geolocation.latitude) {
        setCenter([geolocation.longitude, geolocation.latitude]);
        if(init.current) {
          init.current = false;
          setResetMap(true);
        }
      }
    }
  }, [geolocation])
  

  useEffect(() => {
    if(addLayer) {
      if(map) map.addLayer(addLayer);
      const nowLayers = layers;
      setLayers([...nowLayers, addLayer])
      setAddLayer(null);
    }
  }, [addLayer]);

  return (
    <div className="main">
      <div id='map' style={style}></div>
    </div>
  )
}

export default Main;