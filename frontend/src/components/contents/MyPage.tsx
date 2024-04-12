import { Link } from "react-router-dom";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const MyPage = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="my-page">
      <div className="my-page-header-container">
        <div className="my-page-header-profile-img-container">
          <img className="my-page-header-profile-img"/>
        </div>
        <div className="my-page-header-name-container">
          <span className="my-page-header-name">{user.name}</span>
        </div>
      </div>
      <div className="my-page-body-container">
        <div className="my-page-body-icon-container">
          <div className="my-page-body-icon-row">
            <div className="my-page-body-icon-col">
              <Link to="/profile">
                <img className="my-page-body-icon"/>
                <span className="my-page-body-icon-name">프로필 설정</span>
              </Link>
            </div>
            <div className="my-page-body-icon-col">
              <Link to="/tendency">
                <img className="my-page-body-icon "/>
                <span className="my-page-body-icon-name">성향 설정</span>
              </Link>
            </div>
            <div className="my-page-body-icon-col">
              <Link to="/setting">
                <img className="my-page-body-icon"/>
                <span className="my-page-body-icon-name">엡 설정</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;