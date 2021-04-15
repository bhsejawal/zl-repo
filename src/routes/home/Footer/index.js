import { Heading, Text } from 'grommet';
import { useState } from 'preact/hooks';
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
  // this endpoint is a placeholder and it dose not exist yet
  const { post, response } = useFetch(
    buildURL('/subscribeEmail'),
    { cachePolicy: 'no-cache' },
  );

  const changeHandler = ({ target: { value }}) => {
    setEmail(value);
    setErrorMessage();
    setSuccessMessage();
  }

  const subscribeHandler = async () => {
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
          <Heading level="2">Join the Community</Heading>
          <Text size="xlarge">Subscribe for exclusive deals and Zoolife updates.</Text>
          <div className={style.inputContainer}>
            <input value={email} type="text" placeholder="Enter email" onChange={changeHandler} />
            <LandingPrimary onClick={subscribeHandler}>
              <FontAwesomeIcon icon={faLongArrowRight} />
            </LandingPrimary>
            {errorMessage && <div className={style.error}>{errorMessage}</div>}
            {successMessage && <div className={style.success}>{successMessage}</div>}
          </div>
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
            <a href="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/Brizi+-+Privacy+Policy+v17-03-2021.pdf" target="_blank" rel="noreferrer">
              Read our Privacy Policy
            </a>
            <a href="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/BRIZI+INC+-+Terms+of+Use+v17-03-2021.pdf" target="_blank" rel="noreferrer">
              Read our Terms & Conditions
            </a>
          </div>
        </div>
        <div className={style.partners}>
          <Heading level="5">
            To ensure responsible animal experiences, Zoolife only partners with fully accredited
            non-for-profit zoos, sanctuaries and rehabilitation centers.
          </Heading>
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s8_partner_1.png" alt="" />
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s8_partner_2.png" alt="" />
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s8_partner_3.png" alt="" />
          <img src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s8_partner_4.png" alt="" />
          <Heading level="3">Contact: info@zoolife.tv</Heading>
          <Heading level="3">Press: press@zoolife.tv</Heading>
        </div>
      </div>
      <div className={style.bottom}>
        <Text size="xlarge">
          <FontAwesomeIcon icon={faCopyright} />
          &nbsp;
          2021 Zoolife All Rights Reserved
        </Text>
        <Text size="xlarge">325 Front St. W. Toronto, Canada</Text>
      </div>
    </div>
  );
};

export default Footer;
