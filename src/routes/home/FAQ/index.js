import { h } from 'preact';

import Accordion from '../../account/Accordion';

import style from './style.scss';

const FAQ = () => (
  <div className={style.FAQ}>
    <h2>Frequently Asked Questions</h2>

    <Accordion
      className={style.accordion}
      header={<h3>What is Zoolife?</h3>}
    >
      <p>
        Zoolife is the world’s first virtual zoo. We showcase immersive animal experiences hosted by
        experts, streaming live from the world&apos;s top accredited zoos, sanctuaries and
        rehabilitation centers. Each animal experience is designed to bring you closer to nature and
        offer innovative new ways of learning, protecting and engaging with the natural world,
        from home.
      </p>
      <p>
        Streaming live 24/7, Zoolife features a growing collection of remarkable animal species.
        Our audience-guided cameras allow you to observe the animals and explore habitats stunningly
        close from your device. Join daily keeper talks and interactive Q&amp;As with animal experts
        and naturalists for in-depth learning and so much more.
      </p>
      <p>
        At Zoolife, our mission is to help humankind reconnect with nature, while working together
        to protect it. 50% of your purchase directly funds animal care &amp; conservation efforts
        led by our partners.
      </p>
    </Accordion>

    <Accordion
      className={style.accordion}
      header={<h3>How much does Zoolife cost?</h3>}
    >
      <p>
        50% of every purchase directly funds animal care &amp; conservation efforts worldwide.
      </p>
      <p>
        Single Day Pass: $4.99
        <br />
        Monthly Membership: $9.99/month
        <br />
        Annual Membership: $97.99/year (Save 30%)
        <br />
        You can cancel or upgrade your Zoolife pass any time.
      </p>
    </Accordion>

    <Accordion
      className={style.accordion}
      header={<h3>How does Zoolife ensure responsible animal experiences?</h3>}
    >
      <p>
        To ensure responsible animal experiences, Zoolife only partners with fully accredited
        non-for-profit zoos, sanctuaries and rehabilitation centers who demonstrate the highest
        standards in animal care. Our platform calls attention to at-risk and endangered species,
        and humankind&apos;s role in creating a protected future for them.
      </p>
    </Accordion>

    <Accordion
      className={style.accordion}
      header={<h3>How does Zoolife fund animal care &amp; conservation?</h3>}
    >
      <p>
        50% of every Zoolife pass directly funds animal care &amp; conservation efforts led by our
        partners – accredited zoos, animal sanctuaries and rehabilitation centers from around the
        globe. These fully accredited non-for-profit institutions are fundamental to conservation
        as they provide expert care, high quality nutrition and enrichment to the at-risk species
        in their care, while supporting field work to save species &amp; ecosystems in the wild.
      </p>
    </Accordion>

    <Accordion
      className={style.accordion}
      header={<h3>What’s included in a Zoolife pass?</h3>}
    >
      <p>
        With a Zoolife pass (Day, Monthly or Annual) you get unlimited access to our collection of
        animal experiences and expert talks, streaming live 24/7 from multiple timezones.
      </p>
      <p>
        {/* eslint-disable-next-line max-len */}
        50% of every purchase directly funds animal care &amp; conservation efforts led by our partners.
      </p>
      <p>
        <div style={{ marginBottom: '10px' }}>The Zoolife experience includes:</div>
        Access to 12 iconic animal families housed at accredited zoos, sanctuaries and
        rehabilitation centers worldwide.
        <br />
        Audience-guided cameras to observe animals and explore habitats stunningly close.
        <br />
        Live keeper talks and Q&amp;As with expert hosts, daily.
      </p>
    </Accordion>
  </div>
);

export default FAQ;
