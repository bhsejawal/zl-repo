import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { LandingPrimary } from 'Components/Buttons';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/pro-regular-svg-icons';
import { faLongArrowRight } from '@fortawesome/pro-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { emailRegex } from '../../../helpers';

import style from './style.scss';

const Footer = () => {
  const [email, setEmail] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  // using this to set these values on the client and prevent basic botsh from spamming
  const [mailLinks, setMailLinks] = useState();
  // this endpoint is a placeholder and it dose not exist yet
  const { post, response } = useFetch(
    buildURL('/subscribeEmail'),
    { cachePolicy: 'no-cache' },
  );

  useEffect(() => {
    // this is a bit more complicated on purpose to prevent basic spam bots
    const m = 'mailto:';
    const h = 'zoolife.tv';
    setMailLinks({ info: `${m}info@${h}`, press: `${m}press@${h}` });
  }, []);

  const changeHandler = ({ target: { value }}) => {
    setEmail(value);
    setErrorMessage();
    setSuccessMessage();
  }

  const subscribeHandler = async (evt) => {
    evt.preventDefault();

    setErrorMessage();
    setSuccessMessage();

    if (!email || !email.match(emailRegex)) {
      setErrorMessage('Invalid Email');
      return;
    }

    const { status } = await post({ email });

    if (response.ok) {
      setErrorMessage();
      setSuccessMessage(status);
    } else {
      setErrorMessage('Please Try Again!');
    }
  }

  return (
    <div className={style.footer}>
      <div className={style.top}>
        <div className={style.subscribe}>
          <h2>Join the Community</h2>
          <span className="body">Subscribe for exclusive deals and Zoolife updates.</span>
          <form onSubmit={subscribeHandler}>
            <div className={style.inputContainer}>
              <input value={email} type="text" placeholder="Enter email" onChange={changeHandler} />
              <LandingPrimary type="submit">
                <FontAwesomeIcon icon={faLongArrowRight} />
              </LandingPrimary>
              {errorMessage && <div className={style.error}>{errorMessage}</div>}
              {successMessage && <div className={style.success}>{successMessage}</div>}
            </div>
          </form>
          <div className={style.social}>
            <a href="https://www.facebook.com/zoolife.tv" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://www.instagram.com/zoolife.tv" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://twitter.com/ZoolifeTv" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://www.youtube.com/channel/UCA-2Sodju4yhbAwDyXmmJdQ" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
          <div className={style.termsAndPolicy}>
            <div>
              <a href="https://assets.zoolife.tv/Brizi_-_Privacy_Policy_v17-03-2021.pdf" target="_blank" rel="noreferrer">
                Read our Privacy Policy
              </a>
            </div>
            <div>
              <a href="https://assets.zoolife.tv/BRIZI_INC_-_Terms_of_Use_v17-03-2021.pdf" target="_blank" rel="noreferrer">
                Read our Terms & Conditions
              </a>
            </div>
          </div>
        </div>
        <div className={style.partners}>
          <h5>
            To ensure responsible animal experiences, Zoolife only partners with fully accredited
            non-for-profit zoos, sanctuaries and rehabilitation centers.
          </h5>
          <img src="https://assets.zoolife.tv/landing/s8_partner_1.png" alt="" />
          <img src="https://assets.zoolife.tv/landing/s8_partner_2.png" alt="" />
          <img src="https://assets.zoolife.tv/landing/s8_partner_3.png" alt="" />
          <img src="https://assets.zoolife.tv/landing/s8_partner_4.png" alt="" />
          <h3>
            Contact:
            {' '}
            <a className={style.mLink} href={mailLinks?.info}>{mailLinks?.info}</a>
          </h3>
          <h3>
            Press:
            {' '}
            <a className={style.mLink} href={mailLinks?.press}>{mailLinks?.press}</a>
          </h3>
          <h3>
            <a
              className={`${style.mLink} ${style.bold}`}
              href="https://brizi.applytojob.com/apply/lQ3Gm5NILz/Director-Of-Partnerships"
              target="_blank"
              rel="noopener noreferrer"
            >
              We&apos;re Hiring! 🦋
            </a>
          </h3>
        </div>
      </div>
      <div className={style.bottom}>
        <span className="body">
          <FontAwesomeIcon icon={faCopyright} />
          &nbsp;
          2021 Zoolife All Rights Reserved
        </span>
        <span className="body">325 Front St. W. Toronto, Canada</span>
      </div>
    </div>
  );
};

export default Footer;
