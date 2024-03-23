import '../../styles/Layout.css'

const Footer = (): JSX.Element => {
  return (
    <div className="footer">
      <div className="footer-logo-container">
        <img className="footer-logo"></img>
      </div>
      <div className="footer-title-container">
        <p className="footer-title">
          made by <span className="footer-title-span">rero0124</span>
        </p>
      </div>
    </div>
  )
}

export default Footer;