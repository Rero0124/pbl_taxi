import { Link } from "react-router-dom";
import "styles/Layout.css";

const Navigation = () => {
  return (
		<div className="navigation-container">
			<div className="container">
				<div className="row">
					<Link className="navigation-link col w-v33" to="/">
						<div className="home-icon w-p30 h-p30 m-auto"></div>
						<span>홈</span>
					</Link>
					<Link className="navigation-link col w-v33" to="/event">
						<div className="alerm-icon w-p30 h-p30 m-auto"></div>
						<span>이용내역/알림</span>
					</Link>
					<Link className="navigation-link col w-v33" to="/my">
						<div className="mypage-icon w-p30 h-p30 m-auto"></div>
						<span>내 정보</span>
					</Link>
				</div>
			</div>
		</div>
  )
}

export default Navigation;