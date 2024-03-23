import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";


const Main = () => {
  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  })

  return (
    <div className="main">
      <div id="map"></div>
    </div>
  )
}

export default Main;