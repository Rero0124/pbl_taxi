import { Link, useNavigate } from 'react-router-dom';
import { FormEvent } from 'react';
import { formJsonData, formValidationCheck } from 'util/form';
import { post } from 'util/ajax';
import "styles/Contents.css";

interface RegisterFormType extends HTMLFormElement {
  readonly userId: HTMLInputElement;
  readonly userPw: HTMLInputElement;
  readonly userPwCheck: HTMLInputElement;
  readonly userName: HTMLInputElement;
  readonly number: HTMLInputElement;
  readonly email: HTMLInputElement;
}

const Register = (): JSX.Element => {
  const navigate = useNavigate();

  const registerFormSubmit = async (e: FormEvent<RegisterFormType>) => {
    e.preventDefault();

    const formData: JsonData = formJsonData(e.currentTarget);
    if(formValidationCheck(e.currentTarget)) {
      const action = await post(`${process.env.REACT_APP_BACKEND_URL}/user`, {
        body: JSON.stringify(formData)
      }, (data: BackendResponseData) => {
        if(data.message === "success") {
          alert("성공");
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
      <p className="title">회원가입</p>
      <form onSubmit={registerFormSubmit}>
        <div className="container">
          <div className="row">
            <label className="col" htmlFor="userId">아이디: </label>
            <input id="userId" name="userId" className="col" />
          </div>
          <div className="row">
            <p className="col invaild-comment" id="userIdInvalid">아이디를 입력해주세요.</p>
          </div>
          <div className="row">
            <label className="col" htmlFor="userPw">비밀번호: </label>
            <input id="userPw" name="userPw" className="col" />
          </div>
          <div className="row">
            <p className="col invaild-comment" id="userPwInvalid">비밀번호를 입력해주세요.</p>
          </div>
          <div className="row">
            <label className="col" htmlFor="userPwCheck">비밀번호 확인: </label>
            <input id="userPwCheck" name="userPwCheck" className="col" />
          </div>
          <div className="row">
            <p className="col invaild-comment" id="userPwCheckInvalid">비밀번호를 동일하게 한번 더 입력해주세요</p>
          </div>
          <div className="row">
            <label className="col" htmlFor="userName">이름: </label>
            <input id="userName" name="userName" className="col not-validation"/>
          </div>
          <div className="row">
            <label className="col" htmlFor="phone">전화번호: </label>
            <input id="phone" name="phone" className="col number-value"/>
          </div>
          <div className="row">
            <p className="col invaild-comment" id="phoneInvalid">전화번호를 입력해주세요</p>
          </div>
          <div className="row">
            <label className="col" htmlFor="email">이메일: </label>
            <input id="email" name="email" className="col not-validation"/>
          </div>
          <div className="row">
            <button className="col" type="submit">회원가입</button>
          </div>
        </div>
      </form>
      <div>
        <ul>
          <li>
            <Link to="/login">로그인</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Register;