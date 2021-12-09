import { route } from "preact-router";

// eslint-disable-next-line import/prefer-default-export
export const goToHabitatPage = (zooSlug, habitatSlug) => {
  route(`/h/${zooSlug}/${habitatSlug}`);
}
