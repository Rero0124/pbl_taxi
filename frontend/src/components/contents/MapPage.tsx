import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { FormEvent, useEffect, useRef, useState } from "react";
import markerImage from "images/marker.png";
import { Coordinate } from "ol/coordinate";
import fetchJsonp from "fetch-jsonp";
import Text from "ol/style/Text";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useSearchParams } from "react-router-dom";
import { get, post } from "util/ajax";
import icon from "images/test-icon.png";
import "styles/Contents.css";

interface UserLocateAndTendency {
  userId: string,
  geom: string,
  distance: number,
  inward: boolean,
  quickly: boolean,
  song: boolean,
  songName: string | null
}

interface SearchFormType extends HTMLFormElement {
  searchTxt: HTMLInputElement;
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

interface LocateResponseItem {
  id: string;
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
      items: LocateResponseItem[]
    }
  }
}

interface AddressType {
  title: string;
  address: string;
  point: {
    x: number;
    y: number;
  }
}

interface SearchDriverResult {
  userId: string,
  geom: string,
  image: string | null,
  distance: number,
  inward: number,
  quickly: number,
  song: number,
  point: number,
  score: number,
  songName: string | null
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

const locateSearch = async (searchTxt: string, type: string, point?: {x: number; y: number}): Promise<LocateResponse> => {
  const getUrl = (type: string) => `https://api.vworld.kr/req/search?service=search&request=search&version=2.0&crs=EPSG:4326&size=1000&query=${searchTxt}&type=${type}${point ? `&bbox=${point.x - 0.00015},${point.y - 0.00015},${point.x + 0.00015},${point.y + 0.00015}` : ""}&format=json&errorformat=json&key=${process.env.REACT_APP_VWORLD_KEY}${type === "ADDRESS" ? "&category=PARCEL" : ""}`
  
  const data: LocateResponse = await (await fetchJsonp(getUrl(type))).json();
  data.response.record = { current: Number(data.response.record.current), total: Number(data.response.record.total) };
  data.response.result?.items.forEach((item: LocateResponseItem, idx: number) => {
    if(data.response.result?.items[idx]) {
      data.response.result.items[idx].point = { x: Number(item.point.x), y: Number(item.point.y) };
    }
  })
  return data;
}

const MapPage = () => {
  const location = useSelector((state: RootState) => state.location);
  const setting = useSelector((state: RootState) => state.setting);

  const [searchParams] = useSearchParams();

  const [map, setMap] = useState<Map>();
  const [markerFeature, setMarkerFeature] = useState<Feature<Point>>();
  const [markerLayerStyle, setMarkerLayerStyle] = useState<Style>();
  const [currentPage, setCurrentPage] = useState<string>("map");
  const [startAddress, setStartAddress] = useState<AddressType>();
  const [endAddress, setEndAddress] = useState<AddressType>();
  const [searchTarget, setSearchTarget] = useState<string>("start");
  const [searchResult, setSearchResult] = useState<LocateResponseItem[]>([]);
  const [matchedDriver, setMatchedDriver] = useState<SearchDriverResult>();
  const [searchDriverResult, setSearchDriverResult] = useState<SearchDriverResult[]>([]);
  const [selectedSearchResultRow, setSelectedSearchResultRow] = useState<number>(-1);
  const [selectedSearchDriverResultRow, setSelectedSearchDriverResultRow] = useState<number>(-1);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchTxtRef = useRef<HTMLInputElement>(null);

  const renderMap = () => {
    if(map && markerFeature && markerLayerStyle) {
      let centerCoordinate = [126.97831737391309, 37.566619172927574];
      let centerText = "시청";
  
      if(selectedSearchResultRow > -1) {
        centerText = searchResult[selectedSearchResultRow].title || searchResult[selectedSearchResultRow].address?.road || searchResult[selectedSearchResultRow].address?.parcel || "";
        centerCoordinate = [searchResult[selectedSearchResultRow].point.x, searchResult[selectedSearchResultRow].point.y];
  
        const addressData: AddressType = {
          title: centerText,
          address: searchResult[selectedSearchResultRow].address?.road || searchResult[selectedSearchResultRow].address?.parcel || "",
          point: searchResult[selectedSearchResultRow].point
        }
  
        if(searchTarget === "start") {
          setStartAddress(addressData);
        } else if(searchTarget === "end") {
          setEndAddress(addressData);
        }

        markerFeature.getGeometry()?.setCoordinates(centerCoordinate);
        markerLayerStyle.setText(new Text({
          text: centerText,
          scale: 1,
        }));

        map.getView().setCenter(centerCoordinate);
        
        map.setTarget(mapContainerRef.current ?? undefined);
      }

      map.setTarget("map");
    }
  }

  const selectRow = (idx: number) => {
    setSelectedSearchResultRow(idx);
    setCurrentPage("map");
  }

  const moveSearch = (target: string) => {
    setSearchTarget(target);
    setCurrentPage("search");
  }

  const searchAddress = async (e: FormEvent<SearchFormType>) => {
    e.preventDefault();
    const res = (await locateSearch(e.currentTarget.searchTxt.value, "PLACE")).response;
    if(res.record.current > 0 && res.result?.items !== undefined) { setSearchResult(res.result?.items); }
  }

  const searchDriver = async () => {
    if(startAddress) {
      const params = {
        x: startAddress.point.x.toString(),
        y: startAddress.point.y.toString()
      };
  
      const query = new URLSearchParams(params).toString()
  
      get(`${process.env.REACT_APP_BACKEND_URL}/search/tendency?${query}`, {}, (data: BackendResponseData<SearchDriverResult[]>) => {
        setSearchDriverResult(data.data);
      })
    }
  }

  const selectDriverRow = (idx: number) => {
    setSelectedSearchDriverResultRow(idx);
    post(`${process.env.REACT_APP_BACKEND_URL}/search/match/driver`, { body: JSON.stringify({driverId: searchDriverResult[idx].userId, address: {start: startAddress, end: endAddress}})}, () => {});
  }

  useEffect(() => {
    (async () => {
      let centerCoordinate = [126.97831737391309, 37.566619172927574];
      let centerText = "시청";

      centerCoordinate = [location.location.longitude, location.location.latitude];
      const address = await addressSearch(centerCoordinate)
      centerText = address.response.result[address.response.result.length === 2 ? 1 : 0].text;
      
      const newMarkerSource = new VectorSource();
  
      const newMarkerFeature = new Feature({
        geometry: new Point(centerCoordinate)
      });
  
      newMarkerSource.addFeature(newMarkerFeature);
      
      const newMarkerLayerStyle = new Style({
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
        source: newMarkerSource,
        style: newMarkerLayerStyle
      })
  
      const newMap = new Map({
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
        const locate = (await locateSearch(address.response.result[0].text, "PLACE", {
          x: e.coordinate[0],
          y: e.coordinate[1]
        })).response;
  
        let selectedIdx = -1;
  
        if(locate.result?.items) {
          const administrativeIdx: number[] = [];
          const hospitalIdx: number[] = [];
          const subwayEnteranceIdx: number[] = [];
          const subwayIdx: number[] = [];
          const busStationIdx: number[] = [];
          const buildingIdx: number[] = [];
          const commonIdx: number[] = [];
  
          locate.result.items.forEach((item, idx) => {
            if(item.category) {
              if(item.category.indexOf("행정") > -1) administrativeIdx.push(idx);
              if(item.category.indexOf("지하철역입구") > -1) subwayEnteranceIdx.push(idx);
              if(item.category.indexOf("지하철") > -1) subwayIdx.push(idx);
              if(item.category.indexOf("건물") > -1) buildingIdx.push(idx);
              if(item.category.indexOf("병원") > -1 || item.category.indexOf("의원") > -1) hospitalIdx.push(idx);
              if(item.category.indexOf("버스") > -1) busStationIdx.push(idx);
              if(item.category.indexOf("기타") === -1 && item.category.indexOf("도로시설") === -1) commonIdx.push(idx);
            }
          })
  
          if(administrativeIdx.length > 0) {
            selectedIdx = administrativeIdx[0];
          } else if(subwayEnteranceIdx.length > 0) {
            selectedIdx = subwayEnteranceIdx[0];
          } else if(subwayIdx.length > 0) {
            selectedIdx = subwayIdx[0];
          } else if(buildingIdx.length > 0) {
            selectedIdx = buildingIdx[0];
          } else if(hospitalIdx.length > 0) {
            selectedIdx = hospitalIdx[0];
          } else if(busStationIdx.length > 0) {
            selectedIdx = busStationIdx[0];
          } else if(commonIdx.length > 0) {
            selectedIdx = commonIdx[0];
          }
  
          if(selectedIdx !== -1) {
            newMarkerLayerStyle.setText(new Text({
              text: locate.result.items[selectedIdx].title, 
              scale: 1,
            }));
    
            const searchedData: AddressType = {
              title: locate.result.items[selectedIdx].title || locate.result.items[selectedIdx].address?.road || locate.result.items[selectedIdx].address?.parcel || "",
              address: locate.result.items[selectedIdx].address?.road || locate.result.items[selectedIdx].address?.parcel || "",
              point: {
                x: e.coordinate[0],
                y: e.coordinate[1]
              }
            }
    
            if(searchTarget === "start") {
              setStartAddress(searchedData);
            } else if(searchTarget === "end") {
              setEndAddress(searchedData);
            }
          }
        } 
        
        if(selectedIdx === -1){
          newMarkerLayerStyle.setText(new Text({
            text: addressText, 
            scale: 1,
          }));
  
          const searchedData: AddressType = {
            title: addressText,
            address: addressText,
            point: {
              x: e.coordinate[0],
              y: e.coordinate[1]
            }
          }
  
          if(searchTarget === "start") {
            setStartAddress(searchedData);
          } else if(searchTarget === "end") {
            setEndAddress(searchedData);
          }
        }
        
        newMarkerFeature.getGeometry()?.setCoordinates(e.coordinate);
  
        const params = {
          x: e.coordinate[0].toString(),
          y: e.coordinate[1].toString()
        };
  
        const query = new URLSearchParams(params).toString()
        await get(`${process.env.REACT_APP_BACKEND_URL}/search/${setting.searchType.value}?${query}`, {}, (data: BackendResponseData<UserLocateAndTendency[]>) => {});
      });

      setMap(newMap);
      setMarkerFeature(newMarkerFeature);
      setMarkerLayerStyle(newMarkerLayerStyle);

      newMap.setTarget(mapContainerRef.current ?? undefined);

      const target = searchParams.get("target");
      if(target) {
        if(target === "map") {
          setCurrentPage("map");
        } else {
          setCurrentPage("search")
        }
      } else {
        setCurrentPage("search")
      }
    })()
  }, []);

  useEffect(() => {
    if(currentPage === "map") {
      renderMap();
    } else if(currentPage === "search") {
      setSearchResult([]);
      setSelectedSearchResultRow(-1);
      if(searchTxtRef.current !== null) searchTxtRef.current.focus();
    } else if (currentPage === "driver") {
      setSearchDriverResult([]);
      setSelectedSearchDriverResultRow(-1);
    }
  }, [currentPage]);

  useEffect(() => {
    if(startAddress && endAddress) {
      setCurrentPage("driver");
      if(setting.searchType.value === "speed") {
        setMatchedDriver(undefined);
      } else {
        searchDriver();
      }
    }
  }, [startAddress, endAddress])

  return (
    <div className="h-v79 scroll">
      {currentPage === "driver" ? (
        <>
          <p className="title">기사검색</p>
          <div className="container">
            {searchDriverResult.length > 0 ? (
              searchDriverResult.map((item, idx) => {
                return <div className="row" key={idx} onClick={() => { selectDriverRow(idx) }}>
                  <img className="col" src={item.image ? `${process.env.REACT_APP_BACKEND_URL}/file/view/profile/${item.image}` : icon}/>
                  <div className="col">
                    <p>{item.userId} / 매칭점수: {item.point}</p>
                    <p>별점: {item.score} / 성향 {item.inward === 0 ? "상관없음" : (item.inward === -1 ? "내" : "외") + "향적"}/ 목적지까지: {item.quickly === 0 ? "상관없음" : item.quickly === -1 ? "빠르게" : "안전하게"} / 노래: {item.song === 0 ? "상관없음" : item.song === -1 ? "들음" + (item.songName ? "예시) " + item.songName : "") : "안들음" }</p>
                  </div>
                </div>
              })
            ) : (
              <div className="row">
                <p className="col">검색된 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        currentPage === "map" ? (
          <>
            <div className="map-over-search-container bg-white container pt-1 pb-1">
              <div className="row">
                <div className="col-row">
                  <input className="p-1 w-p150 font-small" onClick={() => {moveSearch("start")}} value={startAddress ? startAddress.title : "목적지를 선택해주세요"} />
                  <span className="p-1">{" > "}</span>
                  <input className="p-1 w-p150 font-small" onClick={() => {moveSearch("end")}} value={endAddress ? endAddress.title : "목적지를 선택해주세요"} />
                </div>
              </div>
            </div>
            <div className="col map-container" id="map" ref={mapContainerRef} />
          </>
        ) : (
          <>
            <p className="title">주소검색</p>
            <form onSubmit={searchAddress}>
              <input className="block-center" ref={searchTxtRef} name="searchTxt"/>
            </form>
            <div className="container">
              {searchResult.length > 0 ? (
                searchResult.map((item, idx) => {
                  if(item.category && (item.category.indexOf("민방위") > -1 || item.category.indexOf("따릉이") > -1 || item.category.indexOf("진출입") > -1 || item.category.indexOf("기타") > -1 || item.category.indexOf("서비스업") > -1 || item.category.indexOf("도로시설") > -1 || item.category.indexOf("입구") > -1 || item.category.indexOf("데이터") > -1 || item.category.indexOf("무인민원") > -1)) {
                    return;
                  } else {
                    const locateTitle = item.title;
                    const locateAddress = item.address?.road || item.address?.parcel;
                    return <div className="row mb-1" key={idx} onClick={() => { selectRow(idx) }}>
                      <div className="col">
                        <span>{locateTitle || locateAddress}</span>
                        { locateTitle ? (<span>{locateAddress}</span>) : (<></>) }
                      </div>
                    </div>
                  }
                })
              ) : (
                <div className="row" key={0}>
                  <p className="col">검색된 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </>
        )
      )}
    </div>
  )
}

export default MapPage;