import { RootState } from "store/store";
import { useDispatch, useSelector } from "react-redux";
import icon from "images/test-icon.png";
import { PopupParam, popupSet, popupShow } from "store/popupReducer";
import { Link } from "react-router-dom";
import "styles/Contents.css";

const MyPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const profileOnClick = () => {
    const popupSetting: PopupParam = {
      type: "image",
      data: "",
    };

    dispatch(popupSet(popupSetting));
    dispatch(popupShow());
  }

  return (
    <div>
      <div className="container pt-1 m-auto">
        <div className="row">
          <img className="col mr-2" src={user.image ? `${process.env.REACT_APP_BACKEND_URL}/file/view/profile/${user.image}` : icon} onClick={profileOnClick} alt="사용자 프로필"/>
          <span className="col">{user.name}의 마이페이지</span>
        </div>
      </div>
      <div className="container pt-1 m-auto">
        <div className="row">
          <Link className="col w-p100" to="/profile">
            <img className="w-p100 h-p100" alt="프로필 설정" src={icon} />
            <span>프로필 설정</span>
          </Link>
          <Link className="col w-p100" to="/tendency">
            <img className="w-p100 h-p100" alt="성향 설정" src={icon} />
            <span>성향 설정</span>
          </Link>
          <Link className="col w-p100" to="/setting">
            <img className="w-p100 h-p100" alt="설정 아이콘" src={icon} />
            <span>앱 설정</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyPage;