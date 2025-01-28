import LinkedInIcon from '../media/icons8-linkedin-48.png';
import { forwardRef } from 'react';
import { LuMail } from "react-icons/lu";

const Contact = forwardRef(() => {
  
  return (
    <footer className='contact-container'>
      <div className='contact-inner-container'>
        <div className='email-contact-box'>
          <a
            href='mailto:thomasalex06@gmail.com'
            alt='alex-thomas-email'>
            {' '}
            <LuMail className='email-icon'/>
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
