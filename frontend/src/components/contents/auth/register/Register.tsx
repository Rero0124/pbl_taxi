import { useNavigate } from 'react-router-dom';
import { FormEvent } from 'react';
import { formJsonData, formValidationCheck } from '../../../../util/form';
import { post } from '../../../../util/ajax';
import { RegisterContainer, RegisterForm, RegisterFormTitle, RegisterInput, RegisterInputContainer, RegisterInputInvalidComment, RegisterInputLabel, RegisterInputSubContainer, RegisterMoveContainer, RegisterMoveLi, RegisterMoveLink, RegisterMoveUl, RegisterSubmitButton } from './StyledRegister';

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
    <RegisterContainer>
      <RegisterFormTitle>회원가입</RegisterFormTitle>
      <RegisterForm onSubmit={registerFormSubmit}>
        <RegisterInputContainer>
          <RegisterInputSubContainer>
            <RegisterInputLabel htmlFor="userId">아이디: </RegisterInputLabel>
            <RegisterInput id="userId" name="userId"/>
          </RegisterInputSubContainer>
          <RegisterInputInvalidComment id="userIdInvalid">아이디를 입력해주세요.</RegisterInputInvalidComment>
        </RegisterInputContainer>
        <RegisterInputContainer>
          <RegisterInputSubContainer>
            <RegisterInputLabel htmlFor="userPw">비밀번호: </RegisterInputLabel>
            <RegisterInput id="userPw" name="userPw"/>
          </RegisterInputSubContainer>
          <RegisterInputInvalidComment id="userPwInvalid">비밀번호를 입력해주세요.</RegisterInputInvalidComment>
        </RegisterInputContainer>
        <RegisterInputContainer>
          <RegisterInputSubContainer>
            <RegisterInputLabel htmlFor="userPwCheck">비밀번호 확인: </RegisterInputLabel>
            <RegisterInput id="userPwCheck" name="userPwCheck"/>
          </RegisterInputSubContainer>
          <RegisterInputInvalidComment id="userPwCheckInvalid">비밀번호를 동일하게 한번 더 입력해주세요</RegisterInputInvalidComment>
        </RegisterInputContainer>
        <RegisterInputContainer>
          <RegisterInputSubContainer>
            <RegisterInputLabel htmlFor="userName">이름: </RegisterInputLabel>
            <RegisterInput id="userName" name="userName" className="not-validation"/>
          </RegisterInputSubContainer>
        </RegisterInputContainer>
        <RegisterInputContainer>
          <RegisterInputSubContainer>
            <RegisterInputLabel htmlFor="phone">전화번호: </RegisterInputLabel>
            <RegisterInput id="phone" name="phone" className="number-value"/>
          </RegisterInputSubContainer>
          <RegisterInputInvalidComment id="phoneInvalid">전화번호를 입력해주세요</RegisterInputInvalidComment>
        </RegisterInputContainer>
        <RegisterInputContainer>
          <RegisterInputSubContainer>
            <RegisterInputLabel htmlFor="email">이메일: </RegisterInputLabel>
            <RegisterInput id="email" name="email" className="not-validation"/>
          </RegisterInputSubContainer>
        </RegisterInputContainer>
        <RegisterInputContainer>
          <RegisterSubmitButton type="submit">회원가입</RegisterSubmitButton>
        </RegisterInputContainer>
      </RegisterForm>
      <RegisterMoveContainer>
        <RegisterMoveUl>
          <RegisterMoveLi>
            <RegisterMoveLink to="/login">로그인</RegisterMoveLink>
          </RegisterMoveLi>
        </RegisterMoveUl>
      </RegisterMoveContainer>
    </RegisterContainer>
    
  )
}

export default Register;