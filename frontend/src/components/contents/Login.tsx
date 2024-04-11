import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Contents.css'
import { FormEvent } from 'react';
import { formJsonData, formValidationCheck } from '../../util/form';
import { userSet } from '../../store/userReducer';
import { useDispatch } from 'react-redux';
import { post } from '../../util/ajax';

interface LoginForm extends HTMLFormElement {
  readonly userId: HTMLInputElement;
  readonly userPw: HTMLInputElement;
}

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginFormSubmit = async (e: FormEvent<LoginForm>) => {    
    e.preventDefault();

    if(formValidationCheck(e.currentTarget)) {
      const formData: JsonData = formJsonData(e.currentTarget);
      const action = await post(`${process.env.REACT_APP_BACKEND_URL}/auth`, { 
        body: JSON.stringify(formData) 
      }, (data: BackendResponseData) => {
        if(data.message === "success") {
          dispatch(userSet(data.data)); 
        } else {
          alert(data.message);
        }
      });

      switch(action) {
        case "back": navigate(-1); break;
        case "main": navigate('/'); break;
        case "reload": navigate(0); break;
      }
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