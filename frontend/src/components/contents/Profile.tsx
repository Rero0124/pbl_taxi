import { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store/store";
import { userSet } from "store/userReducer";
import { patch } from "util/ajax";
import { formJsonData, formValidationCheck } from "util/form";

interface ProfileForm extends HTMLFormElement {
  readonly userName: HTMLInputElement;
  readonly number: HTMLInputElement;
  readonly email: HTMLInputElement;
}

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const profileFormSubmit = (e: FormEvent<ProfileForm>) => {
    e.preventDefault();

    const formData: JsonData = formJsonData(e.currentTarget);

    if(formValidationCheck(e.currentTarget)) {
      patch(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, { body: JSON.stringify(formData)}, (data: BackendResponseData) => {
        if(data.message === "success") {
          dispatch(userSet(data.data));
          navigate(-1);
        } else {
          alert(data.message);
        }
      })
    }
  }

  return (
    <div>
      <form onSubmit={profileFormSubmit}>
        <div className="container">
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
            <button className="col" type="button" onClick={() => {navigate(-1)}}>취소</button>
            <button className="col">저장</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;