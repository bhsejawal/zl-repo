import { parseISO } from "date-fns";
import { useEffect, useState } from "preact/hooks";
import { API_BASE_URL } from "Shared/fetch";
import useFetch from "use-http";

// eslint-disable-next-line import/prefer-default-export
export const useUpcomingTalks = (habitatId, quantity = 3) => {
  const [upcoming, setUpcoming] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const { get, response } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      const params = new URLSearchParams({ limit: quantity });
      await get(habitatId
        ? `/habitats/${habitatId}/schedules/upcoming?${params}`
        : `/schedules/upcoming?${params}`);

      if (!response.ok) {
        setError(true);
        // TODO: log it
        return;
      }

      const now = new Date();
      const list = response.data.events
        .map(({
          _id,
          zoo,
          startTime,
          stopTime,
          habitat,
          camera,
          title,
        }) => ({
          _id,
          zoo,
          title,
          startTime: parseISO(startTime),
          stopTime: parseISO(stopTime),
          profileImage: habitat?.profileImage,
          link: `/h/${habitat?.zoo?.slug}/${habitat?.slug}`,
          description: habitat?.description,
          isStreamLive: camera.cameraStatus !== 'off',
        }))
        .filter(({ startTime, isStreamLive }) => startTime > now || isStreamLive);

      setUpcoming(list)
      setLoading(false);
    };

    // we need explicit null for habitat ID to
    // know if the hook should run without this value
    if (habitatId || habitatId === null) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitatId]);

  return { loading, error, upcoming };
};
