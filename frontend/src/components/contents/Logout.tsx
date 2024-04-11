import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import '../../styles/Contents.css';
import { userUnset } from "../../store/userReducer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { del } from "../../util/ajax";

const Logout = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const [logoutComment, setLogoutComment] = useState<string>("로그아웃중");

  useEffect(() => {
    (async () => {
      if(user.id !== '') {
        const action = await del(`${process.env.REACT_APP_BACKEND_URL}/auth`, {},
        (data: BackendResponseData) => {
          if(data.message === "success") {
            dispatch(userUnset());
            setLogoutComment("로그아웃 성공");
          } else {
            setLogoutComment("로그아웃 실패");
          }
        })

        switch(action) {
          case "back": navigate(-1); break;
          case "main": navigate('/'); break;
          case "reload": navigate(0); break;
        }
      }
    })()
  }, []);

  return (
    <div className="logout">
      <div className="logout-container">
        <p className="logout-comment">{logoutComment}</p>
      </div>
    </div>
  )
}

export default Logout;
