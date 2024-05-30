import { FormEvent } from 'react';
import { formJsonData, formValidationCheck } from 'util/form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { UserTendency, userTendencySet } from 'store/userReducer';
import "styles/Contents.css";
import { useNavigate } from 'react-router-dom';
import { put } from 'util/ajax';

interface TendencyFormType extends HTMLFormElement {
  readonly inward: HTMLInputElement;
  readonly quickly: HTMLInputElement;
  readonly song: HTMLInputElement;
  readonly songName: HTMLInputElement;
}

const Tendency = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const tendencyFormSubmit = (e: FormEvent<TendencyFormType>) => {
    e.preventDefault();

    const formData: JsonData = formJsonData(e.currentTarget);

    if(formValidationCheck(e.currentTarget)) {
      put(`${process.env.REACT_APP_BACKEND_URL}/user/${user.id}/tendency`, { body: JSON.stringify(formData)}, (data: BackendResponseData) => {
        if(data.message === "success") {
          dispatch(userTendencySet(data.data));
        } else {
          alert(data.message);
        }
      })
    }
  }
  return (
    <div>
      <span className="title">성향 설정</span>
      <form className="container" onSubmit={tendencyFormSubmit}>
        <div className="row">
          <label className="col">대화여부: </label>
          <div className="col-row">
            <label htmlFor="inwardYes">예: </label>
            <input id="inwardYes" type="radio" name="inward" className="number-value" value="1" />
            <label htmlFor="inwardNo" className="tendency-inward-label">아니요: </label>
            <input id="inwardNo" type="radio" name="inward" className="number-value" value="-1" />
            <label htmlFor="inwardNoMatter" className="tendency-inward-label">상관없음: </label>
            <input id="inwardNoMatter" type="radio" name="inward" className="number-value" value="0" />
          </div>
        </div>
        <div className="row">
          <p className="invaild-comment" id="inwardInvalid">대화여부를 선택해주세요</p>
        </div>
        <div className="row">
            <label className="col">운전스타일: </label>
            <div className="col-row">
              <label htmlFor="quicklyYes">빠르게: </label>
              <input id="quicklyYes" type="radio" name="quickly" className="number-value" value="1" />
              <label htmlFor="quicklyNo">안전하게: </label>
              <input id="quicklyNo" type="radio" name="quickly" className="number-value" value="-1" />
              <label htmlFor="quicklyNoMatter">상관없음: </label>
              <input id="quicklyNoMatter" type="radio" name="quickly" className="number-value" value="0" />
            </div>
        </div>
        <div className="row">
          <p className="invaild-comment" id="quicklyInvalid">운전 스타일을 선택해주세요</p>
        </div>
        <div>
          <div className="row">
            <label className="col">음악: </label>
            <div className="col-row">
                <label htmlFor="songYes">듣는다: </label>
                <input id="songYes" type="radio" name="song" className="number-value" value="1" />
                <label htmlFor="songNo">안듣는다: </label>
                <input id="songNo" type="radio" name="song" className="number-value" value="-1" />
                <label htmlFor="songNoMatter">안듣는다: </label>
                <input id="songNoMatter" type="radio" name="song" className="number-value" value="0" />
            </div>
          </div>
        </div>
        <div className="row">
          <p className="invaild-comment" id="songInvalid">노래 여부를 선택해주세요</p>
        </div>
        <div className="row">
          <div className="col-row">
            <label htmlFor="songName">즐겨듣는 노래: </label>
            <input id="songName" name="songName" className="not-validation" />
          </div>
        </div>
        <div className="row">
          <button type="button" onClick={() => {navigate(-1)}}>취소</button>
          <button type="submit">등록</button>
        </div>
      </form>
    </div>
  )
}

export default Tendency;