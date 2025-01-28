import LinkedInIcon from '../media/icons8-linkedin-48.png';
import { forwardRef } from 'react';

const Contact = forwardRef(() => {
  const linkToCopy = 'thomasalex06@gmail.com';
  return (
    <footer className='contact-container'>
      <div className='contact-inner-container'>
        <div className='email-contact-box'>
          <a href='mailto:thomasalex06@gmail.com'
           alt='alex-thomas-email'>
            {' '}
            <span class='material-symbols-outlined'>mail</span>
          </a>
        </div>
        <div className='linked-in-contact-box'>
          <a
            href='https://www.linkedin.com/in/alex-thomas-london/'
            alt='alex-thomas-linked-in'
            target='blank'
            rel='noreferrer'>
            <img
              id='linked-in-icon'
              src={LinkedInIcon}
              alt='linked-in-icon'
            />
          </a>
        </div>
      </div>
    </footer>
  );
});

export default Contact;
