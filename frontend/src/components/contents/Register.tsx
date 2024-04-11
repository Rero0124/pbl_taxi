import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Contents.css'
import { FormEvent, useEffect, useState } from 'react';
import { formJsonData, formValidationCheck } from '../../util/form';
import { post } from '../../util/ajax';

interface RegisterForm extends HTMLFormElement {
  readonly userId: HTMLInputElement;
  readonly userPw: HTMLInputElement;
  readonly userPwCheck: HTMLInputElement;
  readonly userName: HTMLInputElement;
  readonly number: HTMLInputElement;
  readonly email: HTMLInputElement;
}

const Register = (): JSX.Element => {
  const navigate = useNavigate();

  const registerFormSubmit = async (e: FormEvent<RegisterForm>) => {
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
    <div className="register">
      <div className="register-container">
        <p className="register-form-title">회원가입</p>
        <form className="register-form" onSubmit={registerFormSubmit}>
          <div className="register-id-container">
            <label htmlFor="userId" className="register-id-label">아이디: </label>
            <input id="userId" name="userId" className="register-id-input" />
            <p id="userIdInvalid" className="register-form-comment display-none">아이디를 입력해주세요</p>
          </div>
          <div className="register-pw-container">
            <label htmlFor="userPw" className="register-pw-label">비밀번호: </label>
            <input id="userPw" name="userPw" className="register-pw-input" />
            <p id="userPwInvalid" className="register-form-comment display-none">비밀번호를 입력해주세요</p>
          </div>
          <div className="register-pw-check-container">
            <label htmlFor="userPwCheck" className="register-pw-check-label">비밀번호 확인: </label>
            <input id="userPwCheck" name="userPwCheck" className="register-pw-check-input" />
            <p id="userPwCheckInvalid" className="register-form-comment display-none">비밀번호를 동일하게 한번 더 입력해주세요</p>
          </div>
          <div className="register-name-container">
            <label htmlFor="userName" className="register-name-label">이름: </label>
            <input id="userName" name="userName" className="register-name-input" />
            <p id="userNameInvalid" className="register-form-comment display-none">이름을 입력해주세요</p>
          </div>
          <div className="register-phone-container">
            <label htmlFor="number" className="register-phone-label">전화번호: </label>
            <input id="number" name="phone" className="register-phone-input number-value" />
            <p id="numberInvalid" className="register-form-comment display-none">전화번호를 입력해주세요</p>
          </div>
          <div className="register-email-container">
            <label htmlFor="email" className="register-email-label">이메일: </label>
            <input id="email" name="email" className="register-email-input" />
            <p id="emailInvalid" className="register-form-comment display-none">이메일을 입력해주세요</p>
          </div>
          <div className="register-submit-container">
            <button type="submit" className="register-submit-button">회원가입</button>
          </div>
          <div className="register-move-container">
            <ul className="register-move-ul" >
              <li className="register-move-li">
                <Link className="register-move-link" to="/login">로그인</Link>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;