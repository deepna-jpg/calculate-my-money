
/**
 * Footer Component
 * 애플리케이션 하단에 저작권 정보와 GitHub 링크를 표시하는 컴포넌트입니다.
 */
import './Footer.css';

const Footer = () => {
    return (
        // 푸터의 전체 컨테이너 역할을 합니다.
        <footer className="footer">
            {/* 내부 콘텐츠를 중앙 정렬하기 위한 래퍼입니다 */}
            <div className="footer-content">

                {/* 저작권 문구 표시: 현재 연도를 자동으로 가져와서 표시합니다 */}
                <p className="copyright">
                    © {new Date().getFullYear()} MoneyGrid. All rights reserved.
                </p>

                {/* 소셜 미디어 또는 외부 링크들을 담는 영역입니다 */}
                <div className="social-links">
                    {/* GitHub 리포지토리로 연결되는 링크입니다 */}
                    {/* target="_blank"는 새 탭에서 열기, rel="noopener noreferrer"는 보안을 위해 사용합니다 */}
                    <a
                        href="https://github.com/deepna-jpg/calculate-my-money"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label="GitHub Repository"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
