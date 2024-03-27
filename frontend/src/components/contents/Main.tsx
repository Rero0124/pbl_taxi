import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { CSSProperties, useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import markerImage from "../../images/marker.png";

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
  zIndex: 1
})


const Main = () => {
  const geolocation = useGeolocation();
  const [map, setMap] = useState<Map | null>();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [addLayer, setAddLayer] = useState<Layer | null>();
  const [resetMap, setResetMap] = useState<boolean>(false);
  const [nowLocation, setNowLocation] = useState<[number, number]>([126.97831737391309, 37.566619172927574]);
  
  const createMarkerLayer = () => {
    const markerSource = new VectorSource();
    
    const markerFeature = new Feature({
      geometry: new Point(nowLocation)
    })
  
    const markerStyle = new Style({
      image: new Icon({
        opacity: 1,
        scale: 0.1,
        src: markerImage
      }),
      zIndex: 100
    }) 
  
    markerSource.addFeature(markerFeature);
  
    return new VectorLayer({
      source: markerSource,
      style: markerStyle
    })
  }

  useEffect(() => {
    setResetMap(true);
  }, [])

  useEffect(() => {
    if(resetMap) {
      const newMap = new Map({
        target: 'map',
        view: new View({
          zoom: 16,
          minZoom: 7,
          maxZoom: 18,
          projection : 'EPSG:4326'
        }),
        controls: []
      });
      
      if(geolocation.longitude && geolocation.latitude) {
        setNowLocation([geolocation.longitude, geolocation.latitude]);
        if(newMap) newMap.getView().setCenter(nowLocation);
      }
  
      const makerLayer = createMarkerLayer();
  
      newMap.addLayer(baseLayer);
      newMap.addLayer(makerLayer);
      setMap(newMap);
      setLayers([baseLayer, makerLayer]);
      setResetMap(false);
    }
  }, [resetMap])

  useEffect(() => {
    if(geolocation.longitude && geolocation.latitude) {
      setNowLocation([geolocation.longitude, geolocation.latitude]);
    }
  }, [geolocation]);

  useEffect(() => {
    if(addLayer) {
      if(map) map.addLayer(addLayer);
      setLayers([...layers, addLayer])
      setAddLayer(null);
    }
  }, [addLayer])

  return (
    <div className="main">
      <div id='map' style={style}></div>
    </div>
  )
}

export default Main;