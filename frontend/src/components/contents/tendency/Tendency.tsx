import { FormEvent } from 'react';
import { formJsonData, formValidationCheck } from '../../../util/form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { UserTendency, userTendencySet } from '../../../store/userReducer';
import { TendencyContainer, TendencyForm, TendencyFormTitleP, TendencyInput, TendencyInputContainer, TendencyInputInvalid, TendencyInputLabel, TendencyInputRadio, TendencyInputRadioContainer, TendencyInputRadioLabel, TendencyInputRadioSubContainer, TendencyInputSubContainer, TendencySubmitButton } from './StyledTendency';

interface TendencyFormType extends HTMLFormElement {
  readonly inward: HTMLInputElement;
  readonly quickly: HTMLInputElement;
  readonly song: HTMLInputElement;
  readonly songName: HTMLInputElement;
}

const Tendency = (): JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const tendencyFormSubmit = (e: FormEvent<TendencyFormType>) => {
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
    <TendencyContainer>
      <TendencyFormTitleP>성향</TendencyFormTitleP>
      <TendencyForm onSubmit={tendencyFormSubmit}>
        <TendencyInputContainer>
          <TendencyInputSubContainer>
            <TendencyInputLabel>대화여부: </TendencyInputLabel>
            <TendencyInputRadioContainer>
              <TendencyInputRadioSubContainer>
                <TendencyInputRadioLabel htmlFor="inwardYes">예: </TendencyInputRadioLabel>
                <TendencyInputRadio id="inwardYes" type="radio" name="inward" className="boolean-value" value="true" />
              </TendencyInputRadioSubContainer>
              <TendencyInputRadioSubContainer>
                <TendencyInputLabel htmlFor="inwardNo" className="tendency-inward-label">아니요: </TendencyInputLabel>
                <TendencyInputRadio id="inwardNo" type="radio" name="inward" className="boolean-value" value="false" />
              </TendencyInputRadioSubContainer>
            </TendencyInputRadioContainer>
          </TendencyInputSubContainer>
          <TendencyInputInvalid id="inwardInvalid">대화여부를 선택해주세요</TendencyInputInvalid>
        </TendencyInputContainer>
        <TendencyInputContainer>
          <TendencyInputSubContainer>
            <TendencyInputLabel>운전스타일: </TendencyInputLabel>
            <TendencyInputRadioContainer>
              <TendencyInputRadioSubContainer>
                <TendencyInputRadioLabel htmlFor="quicklyYes" className="tendency-quickly-label">빠르게: </TendencyInputRadioLabel>
                <TendencyInputRadio id="quicklyYes" type="radio" name="quickly" className="boolean-value" value="true" />
              </TendencyInputRadioSubContainer>
              <TendencyInputRadioSubContainer>
                <TendencyInputRadioLabel htmlFor="quicklyNo" className="tendency-quickly-label">안전하게: </TendencyInputRadioLabel>
                <TendencyInputRadio id="quicklyNo" type="radio" name="quickly" className="boolean-value" value="false" />
              </TendencyInputRadioSubContainer>
            </TendencyInputRadioContainer>
          </TendencyInputSubContainer>
          <TendencyInputInvalid id="quicklyInvalid">운전 스타일을 선택해주세요</TendencyInputInvalid>
        </TendencyInputContainer>
        <TendencyInputContainer>
          <TendencyInputSubContainer>
            <TendencyInputLabel>음악: </TendencyInputLabel>
            <TendencyInputRadioContainer>
              <TendencyInputRadioSubContainer>
                <TendencyInputRadioLabel htmlFor="songYes" className="tendency-song-label">듣는다: </TendencyInputRadioLabel>
                <TendencyInputRadio id="songYes" type="radio" name="song" className="boolean-value" value="true" />
              </TendencyInputRadioSubContainer>
              <TendencyInputRadioSubContainer>
                <TendencyInputRadioLabel htmlFor="songNo" className="tendency-song-label">안듣는다: </TendencyInputRadioLabel>
                <TendencyInputRadio id="songNo" type="radio" name="song" className="boolean-value" value="false" />
              </TendencyInputRadioSubContainer>
            </TendencyInputRadioContainer>
          </TendencyInputSubContainer>
          <TendencyInputInvalid id="songInvalid">노래 여부를 선택해주세요</TendencyInputInvalid>
        </TendencyInputContainer>
        <TendencyInputContainer>
          <TendencyInputLabel htmlFor="songName">즐겨듣는 노래: </TendencyInputLabel>
          <TendencyInput id="songName" name="songName" className="not-validation" />
        </TendencyInputContainer>
        <TendencyInputContainer>
          <TendencySubmitButton type="submit">등록</TendencySubmitButton>
        </TendencyInputContainer>
      </TendencyForm>
    </TendencyContainer>
  )
}

export default Tendency;