import icon from "images/test-icon.png";
import "styles/Layout.css";

const Header = (): JSX.Element => {

  return (
    <div className="header-container">
      <div className="container">
        <div className="row">
          <div className="col-row ">
            <img alt="로고" src={icon} />
            <p>
              TaxiMate
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;
