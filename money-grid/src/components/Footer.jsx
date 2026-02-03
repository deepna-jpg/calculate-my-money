
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="copyright">
                    © {new Date().getFullYear()} MoneyGrid. All rights reserved.
                </p>
                <div className="social-links">
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
