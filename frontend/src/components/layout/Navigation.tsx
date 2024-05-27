import { Link } from "react-router-dom";
import "styles/Layout.css";

const Navigation = () => {
  return (
		<div className="navigation-container">
			<ul className="w100">
				<li>
					<Link className="navigation-link" to="/">홈</Link>
				</li>
				<li>
					<Link className="navigation-link" to="/event">이용내역/알림</Link>
				</li>
				<li>
					<Link className="navigation-link" to="/my">내 정보</Link>
				</li>
			</ul>
		</div>
  )
}

export default Navigation;