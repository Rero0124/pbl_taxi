import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { CSSProperties, useEffect, useRef } from "react";


const Main = () => {
  const mapContent = useRef(null);
  const style: CSSProperties = {
    width: "100%",
    height: "84vh"
  }
  useEffect(() => {
    if(!mapContent.current) return;
    const map = new Map({
      target: mapContent.current,
      layers: [
        new TileLayer({
          visible: true,
          source: new XYZ({
            url: "http://api.vworld.kr/req/wmts/1.0.0/" + process.env.REACT_APP_VWORLD_KEY + "/Base/{z}/{y}/{x}.png",
            crossOrigin: "anonymous",
          })
        })
      ],
      view: new View({
        center: [126.97831737391309, 37.566619172927574],
        zoom: 14,
        minZoom: 7,
        maxZoom: 18,
        projection : 'EPSG:4326'
      }),
      controls: []
    })
    
    return () => map.setTarget(undefined);
  }, [])
  

  return (
    <div className="main">
      <div ref={mapContent} style={style}></div>
    </div>
  )
}

export default Main;