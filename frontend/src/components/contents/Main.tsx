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
            <input className="p-1 w-p300 text-center" placeholder="어디로 갈까요?" onClick={goSearchAddress} />
          </div>
        </div>
        <div className="row pt-1">
          <Link className="col p-1" to="/map?bookmark=집">집</Link>
          <span className="col mt-1 partition" />
          <Link className="col p-1" to="/map?bookmark=회사">회사</Link>
          <span className="col mt-1 partition" />
          <Link className="col p-1" to="/">등록하기</Link>
        </div>
      </div>
      <div className="container pt-1 m-auto">
        <div className="row">
          <Link className="col w-p100" to="/map?target=map">
            <img className="w-p100 h-p100" alt="택시" src={icon}/>
            <span>택시</span>
          </Link>
          <Link className="col w-p100" to="/">
            <img className="w-p100 h-p100" alt="택시 예약" src={icon}/>
            <span>택시 예약(준비중)</span>
          </Link>
          <Link className="col w-p100" to="/">
            <img className="w-p100 h-p100" alt="길찾기" src={icon}/>
            <span>길찾기(준비중)</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Main;