import { FormEvent } from 'react';
import '../../styles/Contents.css'
import { formJsonData, formValidationCheck } from '../../util/form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { UserTendency, userTendencySet } from '../../store/userReducer';

interface TendencyForm extends HTMLFormElement {
  readonly inward: HTMLInputElement;
  readonly quickly: HTMLInputElement;
  readonly song: HTMLInputElement;
  readonly songName: HTMLInputElement;
}

const Tendency = (): JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const tendencyFormSubmit = (e: FormEvent<TendencyForm>) => {
    e.preventDefault();

    const formData: JsonData = formJsonData(e.currentTarget);

    if(formValidationCheck(e.currentTarget)) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user.id}/tendency`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData
        })
      }).then((res: Response) => res.json()).then((data: UserTendency) => {
        dispatch(userTendencySet(data));
      })
      
    }
  }
  return (
    <div className="tendency">
      <div className="tendency-container">
        <p className="tendency-form-title">성향</p>
        <form className="tendency-form" onSubmit={tendencyFormSubmit}>
          <div className="tendency-inward-container">
            <span className="style-label">대화여부: </span>
            <div className="tendency-song-inward-container style-input-container">
              <div>
                <label htmlFor="inwardYes" className="tendency-inward-label">예: </label>
                <input id="inwardYes" type="radio" name="inward" className="tendency-inward-radio boolean-value" value="true" />
              </div>
              <div>
                <label htmlFor="inwardNo" className="tendency-inward-label">아니요: </label>
                <input id="inwardNo" type="radio" name="inward" className="tendency-inward-radio boolean-value" value="false" />
              </div>
            </div>
            <p id="inwardInvalid" className="tendency-form-comment display-none">대화여부를 선택해주세요</p>
          </div>
          <div className="tendency-quickly-container">
            <span className="style-label">운전스타일: </span>
            <div className="tendency-quickly-radio-container style-input-container">
              <div>
                <label htmlFor="quicklyYes" className="tendency-quickly-label">빠르게: </label>
                <input id="quicklyYes" type="radio" name="quickly" className="tendency-quickly-radio boolean-value" value="true" />
              </div>
              <div>
                <label htmlFor="quicklyNo" className="tendency-quickly-label">안전하게: </label>
                <input id="quicklyNo" type="radio" name="quickly" className="tendency-quickly-radio boolean-value" value="false" />
              </div>
            </div>
            <p id="quicklyInvalid" className="tendency-form-comment display-none">운전 스타일을 선택해주세요</p>
          </div>
          <div className="tendency-song-container">
            <span className="style-label">음악: </span>
            <div className="tendency-song-radio-container style-input-container">
              <div>
                <label htmlFor="songYes" className="tendency-song-label">듣는다: </label>
                <input id="songYes" type="radio" name="song" className="tendency-song-radio boolean-value" value="true" />
              </div>
              <div>
                <label htmlFor="songNo" className="tendency-song-label">안듣는다: </label>
                <input id="songNo" type="radio" name="song" className="tendency-song-radio boolean-value" value="false" />
              </div>
            </div>
            <p id="songInvalid" className="tendency-form-comment display-none">노래 여부를 선택해주세요</p>
          </div>
          <div className="tendency-songName-container">
            <label htmlFor="songName" className="tendency-songName-label style-label">즐겨듣는 노래: </label>
            <input id="songName" name="songName" className="tendency-songName-input not-validation" />
            <p id="songNameInvalid" className="tendency-form-comment display-none">전화번호를 입력해주세요</p>
          </div>
          <div className="tendency-submit-container">
            <button type="submit" className="tendency-submit-button">등록</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Tendency;