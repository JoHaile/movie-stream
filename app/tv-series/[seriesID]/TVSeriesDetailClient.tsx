"use client";

import { useState } from "react";
import Image from "next/image";
import EpisodeList from "@/components/shared/EpisodeList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  StarIcon,
  PlusIcon,
  ShareIcon,
  CalendarIcon,
} from "lucide-react";

interface TVSeriesDetailClientProps {
  seriesId: string;
  seriesData: any;
  initialEpisodes: any[];
  initialSeason: number;
}

export default function TVSeriesDetailClient({
  seriesId,
  seriesData,
  initialEpisodes,
  initialSeason,
}: TVSeriesDetailClientProps) {
  const [currentEpisode, setCurrentEpisode] = useState({
    season: initialSeason,
    episode: 1,
  });

  const handleEpisodeSelect = (seasonNum: number, episodeNum: number) => {
    setCurrentEpisode({ season: seasonNum, episode: episodeNum });
  };

  // Build the embed URL for the current episode
  const getEmbedUrl = () => {
    const safeId = encodeURIComponent(seriesId);
    return `https://vsembed.ru/embed/tv/${safeId}/${currentEpisode.season}/${currentEpisode.episode}?autoplay=1&muted=1`;
  };

  // Get current episode data from the list
  const currentEpData = initialEpisodes.find(
    (ep: any) =>
      ep.season_number === currentEpisode.season &&
      ep.episode_number === currentEpisode.episode
  );

  const posterUrl = seriesData.poster_path
    ? `https://image.tmdb.org/t/p/w500${seriesData.poster_path}`
    : null;

  const genres = seriesData.genres?.slice(0, 4) || [];
  const year = seriesData.first_air_date?.slice(0, 4) || "";
  const rating = seriesData.vote_average?.toFixed(1) || "N/A";
  const contentRating =
    seriesData.content_ratings?.results?.find(
      (r: any) => r.iso_3166_1 === "US"
    )?.rating || "TV-MA";

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Main layout: Player + Episode List */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Player + Info */}
          <div className="flex-1 min-w-0">
            {/* Video Player */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
              {/* Episode indicator badge */}
              <div className="absolute top-4 left-4 z-20 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
                S{currentEpisode.season} E{currentEpisode.episode}
              </div>

              <iframe
                src={getEmbedUrl()}
                title={
                  seriesData.name ||
                  seriesData.original_name ||
                  "TV Series player"
                }
                className="absolute inset-0 h-full w-full border-none"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Series Info */}
            <div className="mt-6">
              {/* Title row */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {seriesData.name || seriesData.original_name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Season {currentEpisode.season}, Episode{" "}
                    {currentEpisode.episode}
                    {currentEpData?.name && `: "${currentEpData.name}"`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="default" className="gap-1.5">
                    <PlusIcon className="w-4 h-4" />
                    My List
                  </Button>
                  <Button variant="outline" size="default" className="gap-1.5">
                    <ShareIcon className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Metadata badges */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {rating !== "N/A" && (
                  <div className="flex items-center gap-1 text-sm">
                    <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{rating}</span>
                  </div>
                )}
                {genres.map((g: any) => (
                  <Badge key={g.id} variant="outline" className="text-xs">
                    {g.name}
                  </Badge>
                ))}
                {year && (
                  <Badge variant="outline" className="text-xs">
                    {year}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {contentRating}
                </Badge>
                {seriesData.episode_run_time?.[0] && (
                  <Badge variant="outline" className="text-xs">
                    {seriesData.episode_run_time[0]}min/ep
                  </Badge>
                )}
              </div>

              {/* Overview */}
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                {currentEpData?.overview || seriesData.overview}
              </p>

              {/* Additional info */}
              {seriesData.networks?.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Network:
                  </span>
                  {seriesData.networks.map((n: any) => (
                    <span key={n.id} className="text-xs font-medium">
                      {n.name}
                    </span>
                  ))}
                </div>
              )}

              {seriesData.number_of_seasons && (
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {seriesData.number_of_seasons}{" "}
                    {seriesData.number_of_seasons === 1 ? "Season" : "Seasons"}
                  </span>
                  {seriesData.number_of_episodes && (
                    <span>{seriesData.number_of_episodes} Episodes</span>
                  )}
                  {seriesData.status && <span>Status: {seriesData.status}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Right: Episode List */}
          <div className="w-full lg:w-[380px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <EpisodeList
                seriesId={seriesId}
                seasons={seriesData.seasons || []}
                initialEpisodes={initialEpisodes}
                initialSeason={initialSeason}
                onEpisodeSelect={handleEpisodeSelect}
                currentEpisode={currentEpisode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
