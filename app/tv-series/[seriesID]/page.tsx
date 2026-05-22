import { getTVDetails, getTVSeasonDetails } from "@/utils/tmdb";
import TVSeriesDetailClient from "./TVSeriesDetailClient";

type Props = {
  params: Promise<{ seriesID: string }>;
};

export default async function TVSeriesDetailPage({ params }: Props) {
  const { seriesID } = await params;

  // Fetch TV show details and first season episodes in parallel
  const seriesData = await getTVDetails(seriesID);

  // Find the first real season (skip specials / season 0)
  const realSeasons =
    seriesData.seasons?.filter(
      (s: any) => s.season_number > 0
    ) || [];
  const firstSeasonNumber = realSeasons.length > 0 ? realSeasons[0].season_number : 1;

  const seasonData = await getTVSeasonDetails(seriesID, firstSeasonNumber);

  return (
    <TVSeriesDetailClient
      seriesId={seriesID}
      seriesData={seriesData}
      initialEpisodes={seasonData.episodes || []}
      initialSeason={firstSeasonNumber}
    />
  );
}
