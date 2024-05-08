import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { ComponentProps, FormEvent, forwardRef, useEffect, useRef, useState } from "react";
import markerImage from "../../../images/marker.png";
import { Coordinate } from "ol/coordinate";
import fetchJsonp from "fetch-jsonp";
import Text from "ol/style/Text";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useSearchParams } from "react-router-dom";
import { MapContainer, MapPageContainer, MapSearchContainer, MapSearchForm, MapSearchInput, MapSearchResultContainer, MapSearchResultRow, MapSearchResultRowMainTitle, MapSearchResultRowSubTitle } from "./StyledMapPage";
import { get, post } from "../../../util/ajax";

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
  distance: number,
  inward: boolean,
  quickly: boolean,
  song: boolean,
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

const SearchTxtInput = forwardRef((props:ComponentProps<any>, ref) => {
  return (
      <MapSearchInput ref={ref} id={props.id} name={props.name} autoComplete={"off"} maxLength={props.maxlength} onBlur={props.onBlur} onChange={props.onChange} {...props}></MapSearchInput>
  )
});

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
    post(`${process.env.REACT_APP_BACKEND_URL}/search/match/driver`, { body: JSON.stringify({driverId: searchDriverResult[idx].userId}) }, () => {});
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
              if(item.category.indexOf("중앙행정기관") > -1) administrativeIdx.push(idx);
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
    <MapPageContainer>
      {currentPage === "driver" ? (
        <MapSearchResultContainer>
          {searchDriverResult.length > 0 ? (
            searchDriverResult.map((item, idx) => {
              return <MapSearchResultRow key={idx} onClick={() => { selectDriverRow(idx) }}>
                <MapSearchResultRowMainTitle>{item.userId} / 매칭점수: {item.point}</MapSearchResultRowMainTitle>
                <MapSearchResultRowSubTitle>별점: {item.score} / {item.inward ? "내" : "외"}향적 / {item.inward ? "빠르게" : "안전하게"} / 노래{item.song ? "들음" + (item.songName ? "예시) " + item.song : "") : "안들음" }</MapSearchResultRowSubTitle>
              </MapSearchResultRow>
            })
          ) : (
            <MapSearchResultRow key={0}>검색된 결과가 없습니다.</MapSearchResultRow>
          )}
        </MapSearchResultContainer>
      ) : (
        currentPage === "map" ? (
          <>
            <MapSearchContainer>
              <p>
                <span onClick={() => {moveSearch("start")}}>{startAddress ? startAddress.title : "목적지를 선택해주세요"}</span>
                <span>{" > "}</span>
                <span onClick={() => {moveSearch("end")}} >{endAddress ? endAddress.title : "목적지를 선택해주세요"}</span>
              </p>
            </MapSearchContainer>
            <MapContainer id="map" ref={mapContainerRef}></MapContainer>
          </>
        ) : (
          <>
            <MapSearchForm onSubmit={searchAddress}>
              <SearchTxtInput ref={searchTxtRef} name="searchTxt"/>
              <MapSearchResultContainer>
                {searchResult.length > 0 ? (
                  searchResult.map((item, idx) => {
                    const locateTitle = item.title;
                    const locateAddress = item.address?.road || item.address?.parcel;
                    return <MapSearchResultRow key={idx} onClick={() => { selectRow(idx) }}>
                      <MapSearchResultRowMainTitle>{locateTitle || locateAddress}</MapSearchResultRowMainTitle>
                      { locateTitle ? (<MapSearchResultRowSubTitle>{locateAddress}</MapSearchResultRowSubTitle>) : (<></>) }
                    </MapSearchResultRow>
                  })
                ) : (
                  <MapSearchResultRow key={0}>검색된 결과가 없습니다.</MapSearchResultRow>
                )}
              </MapSearchResultContainer>
            </MapSearchForm>
          </>
        )
      )}
    </MapPageContainer>
  )
}

export default MapPage;