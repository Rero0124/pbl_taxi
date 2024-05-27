import { Link, useNavigate } from 'react-router-dom';
import icon from "images/test-icon.png";
import "styles/Contents.css";

const Main = () => {
  const navigation = useNavigate();
  const goSearchAddress = () => {
    navigation("/map");
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col">
            <input placeholder="어디로 갈까요?" onClick={goSearchAddress} />
          </div>
        </div>
        <div className="row">
          <Link className="col" to="/map?bookmark=집">집</Link>
          <span className="col partition" />
          <Link className="col" to="/map?bookmark=회사">회사</Link>
          <span className="col partition" />
          <Link className="col" to="/">등록하기</Link>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <Link className="col" to="/map?target=map">
            <img alt="택시" src={icon}/>
            <span>택시</span>
          </Link>
          <Link className="col" to="/">
            <img  alt="택시 예약" src={icon}/>
            <span>택시 예약 (준비중)</span>
          </Link>
          <Link className="col" to="/">
            <img alt="길찾기" src={icon}/>
            <span>길찾기(준비중)</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Main;