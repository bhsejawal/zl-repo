import { ORIGIN_AND_HABITAT_CARD_TYPE, ORIGIN_AND_HABITAT } from "../../constants";

export const tag = ORIGIN_AND_HABITAT;
export const type = ORIGIN_AND_HABITAT_CARD_TYPE;
export const data = {
  title: 'Title',
  location: 'Africa',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
  img: `https://maps.googleapis.com/maps/api/staticmap?center=Africa&size=250x250&key=${process.env.PREACT_APP_MAPS_API_KEY}`,
};
