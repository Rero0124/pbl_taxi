import "styles/Pages.css";

interface Props {
  contentType: string;
}

const Page404 = ({ contentType }: Props): JSX.Element => {
  let message = ""; 

  switch (contentType) {
    case "404": message = `잘못된 페이지입니다.`; break;
    case "500": message = `서버 오류입니다.`; break;
    default: message = `현재 ${contentType}은/는 지원되지 않습니다. 다른 브라우저로 접속해주세요`; break;
  }

  return (
    <div>
      <p>{message}</p>
    </div>
  )
}

export default Page404;