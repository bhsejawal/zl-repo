import { subMonths } from "date-fns";

import { ANIMAL_PROFILE_CARD_TYPE, CONSERVATION } from "../../constants";
import defaultAnimalImg from '../../../../../../assets/default-animal-card-img.png';

export const tag = CONSERVATION;
export const type = ANIMAL_PROFILE_CARD_TYPE;
export const data = {
  img: defaultAnimalImg,
  name: 'Kobe',
  title: 'The energeting baby',
  sex: 'Male',
  dateOfBirth: subMonths(new Date(), 6).toISOString(),
  text1: 'Baby Kobe was Born in June 7 2018 at Toronto Zoo',
  text2: 'The youngest child of Charlie and Cleo',
  text3: 'Loves to climb, play and annoy his Mom and Aunties',
};
