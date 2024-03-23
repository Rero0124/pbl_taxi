interface Props {
    browserType: string;
}

const NotSupport = ({ browserType }: Props) => {
	return (
		<div>
			<p>
				현재 { browserType }은/는 지원되지 않습니다.<br />
				다른 브라우저로 접속해주세요
			</p>
		</div>
	)
}

export default NotSupport;