import { Link, useNavigate, useNavigation } from 'react-router-dom';
import '../../styles/Contents.css';
import { FormEvent } from 'react';

interface SearchForm extends HTMLFormElement {
  searchTxt: HTMLInputElement;
}

const Main = () => {
  const navigation = useNavigate();
  const searchAddress = (e: FormEvent<SearchForm>) => {
    e.preventDefault();
    const url = '/map?searchTxt=' + e.currentTarget.searchTxt.value;
    navigation(url);
  }

  return (
    <div className="main">
      <div className="main-container">
        <div className="main-header">
          <div className="search-container">
            <form action="/map" method="GET" onSubmit={searchAddress}>
              <input className="search-input" name="searchTxt" placeholder="어디로 갈까요?" />
              <button className="search-button">검색</button>
            </form>
          </div>
          <div className="favorite-container">
            <button className="favorite-button">집</button>
            <button className="favorite-button">회사</button>
          </div>
        </div>
        <div className="main-body">
          <div className="menu-button-container">
            <div>
              <Link to="/map">택시</Link>
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