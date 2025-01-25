import LinkedInIcon from '../media/icons8-linkedin-48.png';
import CopyButton from './common/CopyButton';
import { forwardRef } from 'react';

const Contact = forwardRef((props, ref) => {
  const linkToCopy = 'thomasalex06@gmail.com';
  return (
    <footer
      className='contact-container'
      ref={ref}>
      <h1>Contact</h1>
      <div className='contact-inner-container'>
        <div className='email-contact-box'>
          <span class='material-symbols-outlined'>mail</span>

          <h2>thomasalex06@gmail</h2>
          <CopyButton link={linkToCopy} />
        </div>
        <div className='linked-in-contact-box'>
          <img
            id='linked-in-icon'
            src={LinkedInIcon}
            alt='linked-in-icon'
          />

          <a
            href='https://www.linkedin.com/in/alex-thomas-london/'
            alt='alex-thomas-linked-in'
            target='blank'
            rel='noreferrer'>
            <h2>in/alex-thomas-london</h2>
          </a>
        </div>
      </div>
    </footer>
  );
});

export default Contact;
