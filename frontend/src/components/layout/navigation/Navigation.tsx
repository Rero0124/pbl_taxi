import { NavigationContainer, NavigationLi, NavigationLink, NavigationUl } from "./StyledNavigation";

const Navigation = () => {
  return (
		<NavigationContainer className="navigation">
			<NavigationUl className="navigation-ul">
				<NavigationLi>
					<NavigationLink to="/">홈</NavigationLink>
				</NavigationLi>
				<NavigationLi>
					<NavigationLink to="/event">이용내역/알림</NavigationLink>
				</NavigationLi>
				<NavigationLi>
					<NavigationLink to="/my">내 정보</NavigationLink>
				</NavigationLi>
			</NavigationUl>
		</NavigationContainer>
  )
}

export default Navigation;