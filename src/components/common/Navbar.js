import logo from '../../media/mq-logo.png';
import { useNavigate } from 'react-router-dom';
import PortfolioThumb from '../../media/portfolio-thumb.png';
import GitHubProfileThumb from '../../media/github-profile.png';

export default function Navbar() {
  const navigate = useNavigate();
  const goToHomepage = () => navigate('/');
  const goToAbout = () => navigate('/about');

  return (
    <>
      <div className='navbar'>
        <img
          onClick={goToHomepage}
          id='logo'
          src={logo}
          alt={'logo'}
        />
        <ul className='navbar-list'>
          <li onClick={goToAbout}>About</li>

          <div class='dropdown-portfolio'>
            <li>Portfolio </li>
            <div class='dropdown-content'>
              <a
                href='https://alex-thomas.dev/'
                target='_blank'
                rel='noreferrer'>
                <img
                  src={PortfolioThumb}
                  alt='portfolio-thumb'
                  // onClick={goToPortfolio}
                  style={{ cursor: 'pointer' }}
                />
              </a>
            </div>
          </div>

          <div class='dropdown-github'>
            <li>GitHub</li>
            <div class='dropdown-content'>
              <a
                href='https://github.com/thomalex001'
                target='_blank'
                rel='noreferrer'>
                <img
                  src={GitHubProfileThumb}
                  alt='github-profile-thumb'
                  style={{ cursor: 'pointer' }}
                />
              </a>
            </div>
          </div>
        </ul>
      </div>
    </>
  );
}
