import '../../styles/Contents.css';

const Main = () => {
  return (
    <div className="main">
      <div className="main-container">
        <div className="main-header">
          <div className="search-container">
            <input className="search-input" />
            <button className="search-button">검색</button>
          </div>
          <div className="favorite-container">
            <button className="favorite-button">집</button>
            <button className="favorite-button">회사</button>
          </div>
        </div>
        <div className="main-body">
          <div className="menu-button-container">
            <div>
              택시
            </div>
            <div>
              택시예약(준비중)
            </div>
            <div>
              길찾기(준비중)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main;