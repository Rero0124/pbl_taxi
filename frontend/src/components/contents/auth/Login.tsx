import { Link, useNavigate } from 'react-router-dom';
import { FormEvent } from 'react';
import { formJsonData, formValidationCheck } from 'util/form';
import { userSet } from 'store/userReducer';
import { useDispatch } from 'react-redux';
import { post } from 'util/ajax';
import "styles/Contents.css";

interface LoginFormType extends HTMLFormElement {
  readonly userId: HTMLInputElement;
  readonly userPw: HTMLInputElement;
}

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginFormSubmit = async (e: FormEvent<LoginFormType>) => {    
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
    <div>
      <p className="title">로그인</p>
      <form onSubmit={loginFormSubmit}>
        <div className="container">
          <div className="row">
            <label className="col" htmlFor="userId">아이디: </label>
            <input id="userId" name="userId" className="col"/>
          </div>
          <div className="row">
            <p className="col invaild-comment" id="userIdInvalid">아이디를 입력해주세요.</p>
          </div>
          <div className="row">
            <label className="col" htmlFor="userPw">비밀번호: </label>
            <input id="userPw" name="userPw" className="col"/>
          </div>
          <div className="row">
            <p className="col invaild-comment" id="userPwInvalid">비밀번호를 입력해주세요.</p>
          </div>
          <div className="row">
            <button className="col" type="submit">로그인</button>
          </div>
        </div>
      </form>
      <div>
        <ul>
          <li>
            <Link to="/register">회원가입</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Login;