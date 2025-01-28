import logo from '../../media/mq-logo.png';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import PortfolioThumb from '../../media/portfolio-thumb.png';
import GitHubProfileThumb from '../../media/github-profile.png';

export default function Navbar() {
  const navigate = useNavigate();
  const goToHomepage = () => navigate('/');
  const location = useLocation();

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
          <li>
            {location.pathname === '/about' ? (
              <span className='is-active'>About</span>
            ) : (
              <Link to='/about'>About</Link>
            )}
          </li>
          <div className='dropdown-portfolio'>
            <li>
              <a
                href='https://alex-thomas.dev/'
                target='_blank'
                rel='noreferrer'>
                Portfolio
              </a>
            </li>
            <div className='dropdown-content'>
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
          <div className='dropdown-github'>
            <li>
              <a
                href='https://github.com/thomalex001'
                target='_blank'
                rel='noreferrer'>
                GitHub
              </a>
            </li>
            <div className='dropdown-content'>
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
