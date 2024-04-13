import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { MyPageBodyContainer, MyPageBodyIconContainer, MyPageBodyIconImg, MyPageBodyIconLink, MyPageBodyIconName, MyPageBodyIconTable, MyPageBodyIconTableTd, MyPageBodyIconTableTr, MyPageContainer, MyPageHeaderContainer, MyPageHeaderName, MyPageHeaderProfileImg  } from "./StyledMyPage";

const MyPage = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <MyPageContainer>
      <MyPageHeaderContainer>
        <MyPageHeaderProfileImg />
        <MyPageHeaderName>{user.name}</MyPageHeaderName>
      </MyPageHeaderContainer>
      <MyPageBodyContainer>
        <MyPageBodyIconContainer>
          <MyPageBodyIconTable>
            <MyPageBodyIconTableTr>
              <MyPageBodyIconTableTd>
                <MyPageBodyIconLink to="/profile">
                  <MyPageBodyIconImg />
                  <MyPageBodyIconName>프로필 설정</MyPageBodyIconName>
                </MyPageBodyIconLink>
              </MyPageBodyIconTableTd>
              <MyPageBodyIconTableTd>
                <MyPageBodyIconLink to="/tendency">
                  <MyPageBodyIconImg />
                  <MyPageBodyIconName>성향 설정</MyPageBodyIconName>
                </MyPageBodyIconLink>
              </MyPageBodyIconTableTd>
              <MyPageBodyIconTableTd>
                <MyPageBodyIconLink to="/setting">
                  <MyPageBodyIconImg />
                  <MyPageBodyIconName>엡 설정</MyPageBodyIconName>
                </MyPageBodyIconLink>
              </MyPageBodyIconTableTd>
            </MyPageBodyIconTableTr>
          </MyPageBodyIconTable>
        </MyPageBodyIconContainer>
      </MyPageBodyContainer>
    </MyPageContainer>
  );
}

export default MyPage;