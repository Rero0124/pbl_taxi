import { useNavigate } from 'react-router-dom';
import { FormEvent } from 'react';
import { formJsonData, formValidationCheck } from '../../../../util/form';
import { userSet } from '../../../../store/userReducer';
import { useDispatch } from 'react-redux';
import { post } from '../../../../util/ajax';
import { LoginContainer, LoginForm, LoginFormTitle, LoginInput, LoginInputContainer, LoginInputInvalidComment, LoginInputLabel, LoginInputSubContainer, LoginMoveContainer, LoginMoveLi, LoginMoveLink, LoginMoveUl, LoginSubmitButton } from './StyledLogin';

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
    <LoginContainer>
      <LoginFormTitle>로그인</LoginFormTitle>
      <LoginForm onSubmit={loginFormSubmit}>
        <LoginInputContainer>
          <LoginInputSubContainer>
            <LoginInputLabel htmlFor="userId">아이디: </LoginInputLabel>
            <LoginInput id="userId" name="userId"/>
          </LoginInputSubContainer>
          <LoginInputInvalidComment id="userIdInvalid">아이디를 입력해주세요.</LoginInputInvalidComment>
        </LoginInputContainer>
        <LoginInputContainer>
          <LoginInputSubContainer>
            <LoginInputLabel htmlFor="userPw">비밀번호: </LoginInputLabel>
            <LoginInput id="userPw" name="userPw"/>
          </LoginInputSubContainer>
          <LoginInputInvalidComment id="userPwInvalid">비밀번호를 입력해주세요.</LoginInputInvalidComment>
        </LoginInputContainer>
        <LoginInputContainer>
          <LoginSubmitButton type="submit">로그인</LoginSubmitButton>
        </LoginInputContainer>
      </LoginForm>
      <LoginMoveContainer>
          <LoginMoveUl>
            <LoginMoveLi>
              <LoginMoveLink to="/register">회원가입</LoginMoveLink>
            </LoginMoveLi>
          </LoginMoveUl>
        </LoginMoveContainer>
    </LoginContainer>
  )
}

export default Login;