import { CONSERVATION_CARD_TYPE, ENDANGERED, CONSERVATION } from "../../constants";

export const tag = CONSERVATION;
export const type = CONSERVATION_CARD_TYPE;
export const data = {
  status: ENDANGERED,
  title: 'An Endangered Species',
  text: 'Nearly 80 percent of western lowland gorillas live in unprotected areas that are vulnerable to poaching. Habitat loss is the greatest reason for their decline.',
  btnLabel: 'Donate to the Gorillas',
  btnLink: 'https://example.com',
};
