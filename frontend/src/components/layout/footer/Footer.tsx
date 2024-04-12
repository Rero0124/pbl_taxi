import { FooterContainer, FooterTitleContainer, FooterTitleLogo, FooterTitle, FooterTitleSpan } from "./StyledFooter";

const Footer = (): JSX.Element => {
  return (
    <FooterContainer>
      <FooterTitleContainer>
        <FooterTitleLogo alt="로고"/>
        <FooterTitle>
          made by <FooterTitleSpan>rero0124</FooterTitleSpan>
        </FooterTitle>
      </FooterTitleContainer>
    </FooterContainer>
  )
}

export default Footer;