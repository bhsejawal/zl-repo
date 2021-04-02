import { h } from 'preact';
import { Heading } from 'grommet';

import Accordion from '../../account/Accordion';

import style from './style.scss';

const FAQ = () => (
  <div className={style.FAQ}>
    <Heading level="2" margin="0">Frequently Asked Questions</Heading>

    <Accordion
      className={style.accordion}
      header={<Heading level="3">What is Zoolife?</Heading>}
    >
      Zoolife is the world’s first digital zoo. We showcase immersive animal experiences hosted
      by experts, streaming live from the world&apos;s top accredited zoos, sanctuaries and
      rehabilitation centers. Each animal experience is designed to bring you closer to nature
      and offer innovative new ways of learning, protecting and engaging with the natural
      world, from home.
    </Accordion>

    <Accordion
      className={style.accordion}
      header={<Heading level="3">How much does Zoolife cost?</Heading>}
    >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
      when an unknown printer took a galley of type and scrambled it to make a type specimen
      book. It has survived not only five centuries, but also the leap into electronic
      typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
      release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </Accordion>

    <Accordion
      className={style.accordion}
      header={<Heading level="3">How does Zoolife ensure responsible animal experiences?</Heading>}
    >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
      when an unknown printer took a galley of type and scrambled it to make a type specimen
      book. It has survived not only five centuries, but also the leap into electronic
      typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
      release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </Accordion>

    <Accordion
      className={style.accordion}
      header={<Heading level="3">How does my Zoolife pass fund animal care & conservation?</Heading>}
    >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
      when an unknown printer took a galley of type and scrambled it to make a type specimen
      book. It has survived not only five centuries, but also the leap into electronic
      typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
      release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </Accordion>

    <Accordion
      className={style.accordion}
      header={<Heading level="3">What’s included in a Zoolife pass?</Heading>}
    >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s,
      when an unknown printer took a galley of type and scrambled it to make a type specimen
      book. It has survived not only five centuries, but also the leap into electronic
      typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
      release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </Accordion>
  </div>
);

export default FAQ;
