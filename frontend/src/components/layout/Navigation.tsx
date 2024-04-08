import { Link } from "react-router-dom";

const Navigation = () => {
  return (
		<div className="navigation">
			<ul className="navigation-ul">
				<li className="navigation-li">
					<Link className="navigation-link" to="/">홈</Link>
				</li>
				<li className="navigation-li">
					<Link className="navigation-link" to="/event">이용내역/알림</Link>
				</li>
				<li className="navigation-li">
					<Link className="navigation-link" to="/my">내 정보</Link>
				</li>
			</ul>
		</div>
  )
}

export default Navigation;