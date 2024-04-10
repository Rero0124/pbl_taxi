import { Link } from 'react-router-dom';
import '../../styles/Contents.css'
import { FormEvent, useEffect } from 'react';
import { formJsonData, formValidationCheck } from '../../util/form';
import { User, userSet } from '../../store/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface LoginForm extends HTMLFormElement {
  readonly userId: HTMLInputElement;
  readonly userPw: HTMLInputElement;
}

interface LoginResponseData {
  session: string;
  user: User;
}

const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if(user.id === '' && sessionStorage.getItem('session')) {
      const session = sessionStorage.getItem('session');
      fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/${session}`, {
        method: 'GET',
        credentials: 'include'
      }).then((res: Response) => res.json()).then((data: LoginResponseData) => {
        sessionStorage.setItem("session", data.session);
        dispatch(userSet(data.user));
        return () => {
          window.location.reload()
        }
      }).catch(() => {
        sessionStorage.removeItem("session");
      })
    }
  }, []);

  const loginFormSubmit = (e: FormEvent<LoginForm>) => {    
    e.preventDefault();

    if(formValidationCheck(e.currentTarget)) {
      const formData: JsonData = formJsonData(e.currentTarget);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }).then((res: Response) => res.json()).then((data: LoginResponseData) => {
        sessionStorage.setItem("session", data.session)
        dispatch(userSet(data.user));
      }).catch(() => {
        alert('로그인에 실패하였습니다')
      });
    }
  }

  return (
    <div className="login">
      <div className="login-container">
        <p className="login-form-title">로그인</p>
        <form className="login-form" onSubmit={loginFormSubmit}>
          <div className="login-id-container">
            <label htmlFor="userId" className="login-id-label">아이디: </label>
            <input id="userId" name="userId" className="login-id-input" />
          </div>
          <div className="login-pw-container">
            <label htmlFor="userPw" className="login-pw-label">비밀번호: </label>
            <input id="userPw" name="userPw" className="login-pw-input" />
          </div>
          <div className="login-submit-container">
            <button type="submit" className="login-submit-button">로그인</button>
          </div>
          <div className="login-move-container">
            <ul className="login-move-ul" >
              <li className="login-move-li">
                <Link className="login-move-link" to="/register">회원가입</Link>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;