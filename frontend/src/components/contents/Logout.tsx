
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import '../../styles/Contents.css';
import { userUnset } from "../../store/userReducer";
import { useEffect, useState } from "react";

const Logout = (): JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [logoutComment, setLogoutComment] = useState<string>("로그아웃중");

  useEffect(() => {
    if(user.id !== '' && sessionStorage.getItem('session')) {
      const session = sessionStorage.getItem('session');
      fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/delete`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({id: session})
      }).then((res) => {
        if(res.status === 200) {
          sessionStorage.removeItem("session");
          dispatch(userUnset());
          setLogoutComment("로그아웃 성공");
        }
      }).catch(() => {
        setLogoutComment("로그아웃 실패");
      })
    }
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
