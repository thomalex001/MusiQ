import logo from '../../media/mq-logo.png';
import { useNavigate, Navigate} from 'react-router-dom';




export default function Navbar() {
  const navigate = useNavigate()
  const goToHomepage = () => navigate('/search')
  
  return (
    <div className='navbar'>
        <img
        onClick={goToHomepage}
          id='logo'
          src={logo}
          alt={'logo'}
        />
      <ul className='navbar-list'>
        <li>MusiQ</li>
        <li>Portfolio</li>
        <li>Alex Thomas</li>
      </ul>
    </div>
  );
}
