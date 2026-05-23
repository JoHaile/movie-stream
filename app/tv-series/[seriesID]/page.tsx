import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TVSeriesDetailClient from "./TVSeriesDetailClient";
import { getTVDetails, getTVSeasonDetails } from "@/utils/tmdb";

type Props = {
  params: Promise<{ seriesID: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesID } = await params;
  const series = await getTVDetails(seriesID);

  if (!series) {
    return {
      title: "TV Series not found | StreamFlix",
    };
  }

  const year = series.first_air_date?.slice(0, 4);
  const title = year
    ? `${series.name} (${year}) | StreamFlix`
    : `${series.name} | StreamFlix`;
  const description =
    series.overview || `Watch ${series.name} and explore cast, seasons, and streaming details.`;
  const backdrop = series.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${series.backdrop_path}`
    : null;

  return {
    title,
    description,
    openGraph: {
      description,
      images: backdrop ? [{ url: backdrop }] : undefined,
      title,
      type: "website",
    },
  };
}

export default async function TVSeriesDetailPage({ params }: Props) {
  const { seriesID } = await params;
  const seriesData = await getTVDetails(seriesID);

  if (!seriesData) {
    notFound();
  }

  const realSeasons =
    seriesData.seasons?.filter((season) => season.season_number > 0) || [];
  const firstSeasonNumber =
    realSeasons.length > 0 ? realSeasons[0].season_number : 1;
  const seasonData = await getTVSeasonDetails(seriesID, firstSeasonNumber);

  return (
    <TVSeriesDetailClient
      initialEpisodes={seasonData?.episodes || []}
      initialSeason={firstSeasonNumber}
      seriesData={seriesData}
      seriesId={seriesID}
    />
  );
}
