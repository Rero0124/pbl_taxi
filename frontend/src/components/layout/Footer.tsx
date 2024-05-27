import icon from "images/test-icon.png";
import "styles/Layout.css";

const Footer = (): JSX.Element => {
  return (
    <div className="footer-container">
      <div className="container">
        <div className="row jc-bt">
          <img className="col" alt="로고" src={icon}/>
          <div className="col-row">
            made by <span>rero0124</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer;