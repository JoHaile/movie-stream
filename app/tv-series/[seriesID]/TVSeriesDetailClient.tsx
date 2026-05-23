"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import EpisodeList from "@/components/shared/EpisodeList";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TVEpisode, TVSeriesCard, TVSeriesDetails } from "@/utils/tmdb";
import {
  Clock3Icon,
  ExternalLinkIcon,
  FilmIcon,
  GlobeIcon,
  PlayIcon,
  QuoteIcon,
  StarIcon,
  TrendingUpIcon,
  TvMinimalPlayIcon,
} from "lucide-react";

interface TVSeriesDetailClientProps {
  initialEpisodes: TVEpisode[];
  initialSeason: number;
  seriesData: TVSeriesDetails;
  seriesId: string;
}

const pageShell =
  "rounded-[28px] border border-white/10 bg-white/[0.05] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm";

const numberFormatter = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const listFormatter = new Intl.ListFormat("en-US", {
  style: "long",
  type: "conjunction",
});

function tmdbImage(path: string | null | undefined, size = "original") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "TBA";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "TBA";
  }

  return dateFormatter.format(date);
}

function formatRuntime(runtime: number | null | undefined) {
  if (!runtime || runtime <= 0) return "Runtime unavailable";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) return `${minutes}m`;
  if (!minutes) return `${hours}h`;

  return `${hours}h ${minutes}m`;
}

function formatScore(value: number) {
  if (!value) return "NR";
  return `${Math.round(value * 10)}%`;
}

function formatVoteCount(value: number) {
  if (!value) return "No votes yet";
  return `${numberFormatter.format(value)} votes`;
}

function getContentRating(series: TVSeriesDetails, region = "US") {
  return (
    series.content_ratings?.results?.find(
      (entry) => entry.iso_3166_1 === region,
    )?.rating ?? null
  );
}

function pickTrailer(series: TVSeriesDetails) {
  const videos = series.videos?.results ?? [];

  return (
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official,
    ) ??
    videos.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    ) ??
    videos.find((video) => video.site === "YouTube")
  );
}

function pickLogo(series: TVSeriesDetails) {
  const logos = series.images?.logos ?? [];

  return (
    logos.find((logo) => logo.iso_639_1 === "en") ??
    logos.find((logo) => logo.iso_639_1 === null) ??
    logos[0]
  );
}

function getProviders(series: TVSeriesDetails, region = "US") {
  const providers = series["watch/providers"]?.results?.[region];
  if (!providers) return [];

  const order = [
    { key: "flatrate", label: "Stream" },
    { key: "free", label: "Free" },
    { key: "ads", label: "With ads" },
    { key: "rent", label: "Rent" },
    { key: "buy", label: "Buy" },
  ] as const;

  return order
    .map(({ key, label }) => ({
      label,
      link: providers.link,
      providers: providers[key] ?? [],
    }))
    .filter((group) => group.providers.length > 0);
}

function getGallery(series: TVSeriesDetails) {
  const backdrops =
    series.images?.backdrops.reduce<Array<{ file_path: string; vote_average: number }>>(
      (accumulator, image) => {
        if (image.file_path) {
          accumulator.push({
            file_path: image.file_path,
            vote_average: image.vote_average,
          });
        }

        return accumulator;
      },
      [],
    ) ?? [];

  const merged: Array<{ file_path: string; vote_average: number } | null> = [
    series.backdrop_path
      ? {
          file_path: series.backdrop_path,
          vote_average: Number.MAX_SAFE_INTEGER,
        }
      : null,
    ...backdrops,
  ];

  const seen = new Set<string>();

  return merged.filter((item): item is { file_path: string; vote_average: number } => {
    if (!item || seen.has(item.file_path)) {
      return false;
    }

    seen.add(item.file_path);
    return true;
  });
}

function getRelatedTitles(series: TVSeriesDetails) {
  const items = [
    ...(series.recommendations?.results ?? []),
    ...(series.similar?.results ?? []),
  ];
  const seen = new Set<number>();

  return items.filter((item) => {
    if (!item.poster_path || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function getEpisodeEmbedUrl(
  seriesId: string,
  season: number,
  episode: number,
) {
  return `https://vsembed.ru/embed/tv/${encodeURIComponent(seriesId)}/${season}/${episode}?autoplay=1&muted=1`;
}

function getShowYearLabel(series: TVSeriesDetails) {
  const firstYear = series.first_air_date?.slice(0, 4);
  const lastYear = series.last_air_date?.slice(0, 4);

  if (!firstYear) return "Unknown";
  if (series.status === "Ended" && lastYear && firstYear !== lastYear) {
    return `${firstYear} - ${lastYear}`;
  }

  if (series.status !== "Ended" && lastYear) {
    return `${firstYear} - ${lastYear === firstYear ? "Present" : lastYear}`;
  }

  return firstYear;
}

export default function TVSeriesDetailClient({
  initialEpisodes,
  initialSeason,
  seriesData,
  seriesId,
}: TVSeriesDetailClientProps) {
  const [currentEpisode, setCurrentEpisode] = useState({
    episode: initialEpisodes[0]?.episode_number ?? 1,
    season: initialSeason,
  });
  const [currentEpisodeData, setCurrentEpisodeData] = useState<TVEpisode | null>(
    initialEpisodes[0] ?? null,
  );

  const handleEpisodeSelect = (
    seasonNum: number,
    episodeNum: number,
    episode?: TVEpisode,
  ) => {
    setCurrentEpisode({ season: seasonNum, episode: episodeNum });
    if (episode) {
      setCurrentEpisodeData(episode);
    }
  };

  const posterUrl = tmdbImage(seriesData.poster_path, "w780");
  const heroBackdrop = tmdbImage(seriesData.backdrop_path, "w1280");
  const logo = pickLogo(seriesData);
  const trailer = pickTrailer(seriesData);
  const providers = getProviders(seriesData);
  const gallery = getGallery(seriesData).slice(0, 4);
  const relatedTitles = getRelatedTitles(seriesData).slice(0, 12);
  const keywords = (seriesData.keywords?.results ?? []).slice(0, 10);
  const cast = [...(seriesData.credits?.cast ?? [])]
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
    .slice(0, 8);
  const reviews = (seriesData.reviews?.results ?? []).slice(0, 3);
  const creators = seriesData.created_by.slice(0, 3);
  const seasons = seriesData.seasons
    .filter((season) => season.season_number > 0)
    .slice(0, 8);
  const showYears = getShowYearLabel(seriesData);
  const contentRating = getContentRating(seriesData);
  const spokenLanguages = seriesData.spoken_languages
    .map((language) => language.english_name || language.name)
    .filter(Boolean);
  const productionCountries = seriesData.production_countries
    .map((country) => country.name)
    .filter(Boolean);
  const runtime =
    currentEpisodeData?.runtime ??
    seriesData.episode_run_time?.[0] ??
    null;

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10">
        {heroBackdrop ? (
          <Image
            src={heroBackdrop}
            alt={seriesData.name}
            fill
            priority
            className="object-cover object-top opacity-30"
            sizes="100vw"
          />
        ) : null}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,172,254,0.22),transparent_42%),linear-gradient(180deg,rgba(5,11,20,0.14)_0%,rgba(5,11,20,0.82)_56%,#050b14_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 md:px-6 lg:px-8 lg:pb-[4.5rem] lg:pt-10">
          <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-300/70">
            <Link href="/tv-series" className="transition hover:text-white">
              TV Series
            </Link>
            <span className="text-slate-500">/</span>
            <span className="truncate text-slate-100">{seriesData.name}</span>
          </div>

          <div className="max-w-4xl">
            {logo?.file_path ? (
              <div className="relative mb-6 h-[5.5rem] w-full max-w-[420px]">
                <Image
                  src={tmdbImage(logo.file_path, "w500") ?? ""}
                  alt={`${seriesData.name} logo`}
                  fill
                  className="object-contain object-left drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
                  sizes="(max-width: 768px) 280px, 420px"
                />
              </div>
            ) : (
              <h1 className="mb-5 max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                {seriesData.name}
              </h1>
            )}

            {seriesData.tagline ? (
              <p className="mb-5 max-w-3xl text-lg italic text-sky-100/90 md:text-xl">
                {seriesData.tagline}
              </p>
            ) : null}

            <div className="mb-6 flex flex-wrap items-center gap-2.5">
              <Badge
                variant="outline"
                className="border-white/[0.15] bg-white/10 text-slate-100"
              >
                {showYears}
              </Badge>
              {contentRating ? (
                <Badge
                  variant="outline"
                  className="border-white/[0.15] bg-white/10 text-slate-100"
                >
                  {contentRating}
                </Badge>
              ) : null}
              <Badge
                variant="outline"
                className="border-white/[0.15] bg-white/10 text-slate-100"
              >
                {formatRuntime(seriesData.episode_run_time?.[0] ?? null)}
              </Badge>
              {seriesData.genres.slice(0, 4).map((genre) => (
                <Badge
                  key={genre.id}
                  variant="outline"
                  className="border-white/[0.15] bg-white/10 text-slate-100"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            <p className="mb-8 max-w-3xl text-base leading-8 text-slate-200/85 md:text-lg">
              {seriesData.overview ||
                "Story details are not available for this series yet."}
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              <a
                href="#watch-now"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 bg-sky-300 px-5 text-slate-950 hover:bg-sky-200",
                )}
              >
                <PlayIcon className="size-4" fill="currentColor" />
                Watch now
              </a>

              {trailer ? (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "gap-2 border-white/[0.15] bg-white/[0.06] px-5 text-slate-100 hover:bg-white/[0.12]",
                  )}
                >
                  <FilmIcon className="size-4" />
                  Official trailer
                </a>
              ) : null}

              {seriesData.homepage ? (
                <a
                  href={seriesData.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "gap-2 border-white/[0.15] bg-white/[0.06] px-5 text-slate-100 hover:bg-white/[0.12]",
                  )}
                >
                  <GlobeIcon className="size-4" />
                  Official site
                </a>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={StarIcon}
                label="Audience Score"
                value={formatScore(seriesData.vote_average)}
                caption={formatVoteCount(seriesData.vote_count)}
              />
              <MetricCard
                icon={TrendingUpIcon}
                label="Popularity"
                value={numberFormatter.format(Math.round(seriesData.popularity))}
                caption="Live TMDB popularity index"
              />
              <MetricCard
                icon={TvMinimalPlayIcon}
                label="Seasons"
                value={numberFormatter.format(seriesData.number_of_seasons)}
                caption={`${numberFormatter.format(seriesData.number_of_episodes)} total episodes`}
              />
              <MetricCard
                icon={Clock3Icon}
                label="Status"
                value={seriesData.status}
                caption={`Premiered ${formatDate(seriesData.first_air_date)}`}
              />
            </div>

            {creators.length ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <CrewCard
                  eyebrow="Created by"
                  fallback="Creator data unavailable"
                  names={creators.map((creator) => creator.name)}
                />
                <CrewCard
                  eyebrow="Networks"
                  fallback="Network data unavailable"
                  names={seriesData.networks.slice(0, 3).map((network) => network.name)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section id="watch-now" className={pageShell}>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200/70">
                    Now Playing
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {currentEpisodeData?.name
                      ? `S${currentEpisode.season}E${currentEpisode.episode} · ${currentEpisodeData.name}`
                      : `Watch ${seriesData.name}`}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {currentEpisodeData?.air_date
                      ? `Aired ${formatDate(currentEpisodeData.air_date)}`
                      : `${seriesData.status} series`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="border-white/[0.15] bg-white/[0.08] text-slate-100"
                  >
                    {`Season ${currentEpisode.season}`}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/[0.15] bg-white/[0.08] text-slate-100"
                  >
                    {runtime ? formatRuntime(runtime) : "Runtime unavailable"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/[0.15] bg-white/[0.08] text-slate-100"
                  >
                    {seriesData.status}
                  </Badge>
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-b-[28px] bg-black">
                <iframe
                  src={getEpisodeEmbedUrl(
                    seriesId,
                    currentEpisode.season,
                    currentEpisode.episode,
                  )}
                  title={seriesData.name || "TV series player"}
                  className="absolute inset-0 h-full w-full border-none"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="border-t border-white/10 px-5 py-4 md:px-6">
                <p className="text-sm leading-7 text-slate-300/82">
                  {currentEpisodeData?.overview ||
                    seriesData.overview ||
                    "Episode details are not available right now."}
                </p>
              </div>
            </section>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <GlassSection eyebrow="Storyline" title="Series overview">
                <p className="text-sm leading-7 text-slate-200/85 md:text-base">
                  {seriesData.overview ||
                    "TMDB does not have an overview for this series yet."}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <InfoBlock
                    label="Original name"
                    value={seriesData.original_name || seriesData.name}
                  />
                  <InfoBlock
                    label="Original language"
                    value={seriesData.original_language.toUpperCase()}
                  />
                  <InfoBlock
                    label="Spoken languages"
                    value={
                      spokenLanguages.length
                        ? listFormatter.format(spokenLanguages.slice(0, 4))
                        : "Not listed"
                    }
                  />
                  <InfoBlock
                    label="Production countries"
                    value={
                      productionCountries.length
                        ? listFormatter.format(productionCountries.slice(0, 3))
                        : "Not listed"
                    }
                  />
                </div>
              </GlassSection>

              <GlassSection eyebrow="Cast" title="Top billed talent">
                <div className="grid gap-3 sm:grid-cols-2">
                  {cast.length ? (
                    cast.map((member) => (
                      <CastCard
                        key={member.id}
                        member={{
                          character: member.character || "Role unavailable",
                          id: member.id,
                          name: member.name,
                          profile_path: member.profile_path,
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-300/80">
                      Cast details are not available for this series yet.
                    </p>
                  )}
                </div>
              </GlassSection>
            </div>

            {seasons.length ? (
              <GlassSection eyebrow="Seasons" title="Browse the run">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {seasons.map((season) => (
                    <SeasonCard
                      key={season.id}
                      season={season}
                      isActive={season.season_number === currentEpisode.season}
                    />
                  ))}
                </div>
              </GlassSection>
            ) : null}

            {gallery.length ? (
              <GlassSection eyebrow="Gallery" title="Stills and artwork">
                <div className="grid gap-4 md:grid-cols-2">
                  {gallery.map((image, index) => (
                    <div
                      key={`${image.file_path}-${index}`}
                      className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05]"
                    >
                      <Image
                        src={tmdbImage(image.file_path, "w780") ?? ""}
                        alt={`${seriesData.name} still ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </GlassSection>
            ) : null}

            {reviews.length ? (
              <GlassSection eyebrow="Reviews" title="Audience reactions">
                <div className="grid gap-4 lg:grid-cols-3">
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {review.author_details?.name ||
                              review.author ||
                              "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(review.created_at)}
                          </p>
                        </div>

                        {review.author_details?.rating ? (
                          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
                            {review.author_details.rating}/10
                          </span>
                        ) : null}
                      </div>

                      <QuoteIcon className="mb-3 size-4 text-slate-500" />
                      <p className="line-clamp-6 text-sm leading-7 text-slate-200/85">
                        {review.content}
                      </p>

                      <a
                        href={review.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-200 transition hover:text-sky-100"
                      >
                        Read full review
                        <ExternalLinkIcon className="size-3.5" />
                      </a>
                    </article>
                  ))}
                </div>
              </GlassSection>
            ) : null}

            {relatedTitles.length ? (
              <PosterRail title="More Series Like This" items={relatedTitles} />
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className={pageShell}>
              <div className="relative aspect-[2/3] overflow-hidden rounded-[28px] rounded-b-none border-b border-white/10 bg-white/[0.05]">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={`${seriesData.name} poster`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-center text-lg font-semibold text-slate-200">
                    {seriesData.name}
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat
                    label="TMDB Score"
                    value={seriesData.vote_average ? seriesData.vote_average.toFixed(1) : "NR"}
                  />
                  <MiniStat
                    label="Votes"
                    value={numberFormatter.format(seriesData.vote_count)}
                  />
                  <MiniStat
                    label="Seasons"
                    value={numberFormatter.format(seriesData.number_of_seasons)}
                  />
                  <MiniStat
                    label="Episodes"
                    value={numberFormatter.format(seriesData.number_of_episodes)}
                  />
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4 text-sm">
                  <SidebarRow label="First aired">
                    {formatDate(seriesData.first_air_date)}
                  </SidebarRow>
                  <SidebarRow label="Last aired">
                    {formatDate(seriesData.last_air_date)}
                  </SidebarRow>
                  <SidebarRow label="Type">{seriesData.type || "Series"}</SidebarRow>
                  <SidebarRow label="Status">{seriesData.status}</SidebarRow>
                  <SidebarRow label="Networks">
                    {seriesData.networks.length
                      ? seriesData.networks.map((network) => network.name).join(", ")
                      : "Not listed"}
                  </SidebarRow>
                </div>

                {seriesData.next_episode_to_air ? (
                  <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100/75">
                      Next episode
                    </p>
                    <p className="mt-2 font-semibold text-white">
                      {seriesData.next_episode_to_air.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-300/80">
                      Season {seriesData.next_episode_to_air.season_number}, Episode{" "}
                      {seriesData.next_episode_to_air.episode_number}
                    </p>
                    <p className="mt-2 text-sm text-slate-300/78">
                      {formatDate(seriesData.next_episode_to_air.air_date)}
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {seriesData.homepage ? (
                    <a
                      href={seriesData.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/[0.14]"
                    >
                      <GlobeIcon className="size-3.5" />
                      Website
                    </a>
                  ) : null}
                  {trailer ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/[0.14]"
                    >
                      <PlayIcon className="size-3.5" />
                      Trailer
                    </a>
                  ) : null}
                </div>
              </div>
            </section>

            <GlassSection eyebrow="Episodes" title="Season browser">
              <EpisodeList
                currentEpisode={currentEpisode}
                initialEpisodes={initialEpisodes}
                initialSeason={initialSeason}
                onEpisodeSelect={handleEpisodeSelect}
                seasons={seriesData.seasons || []}
                seriesId={seriesId}
              />
            </GlassSection>

            <GlassSection eyebrow="Watch" title="Where to watch in the US">
              {providers.length ? (
                <div className="space-y-4">
                  {providers.map((group) => (
                    <div key={group.label}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">
                          {group.label}
                        </p>
                        {group.link ? (
                          <a
                            href={group.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-sky-200 transition hover:text-sky-100"
                          >
                            Open provider list
                          </a>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {group.providers.slice(0, 6).map((provider) => (
                          <div
                            key={provider.provider_id}
                            className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/20 px-2.5 py-2"
                          >
                            {provider.logo_path ? (
                              <div className="relative size-8 overflow-hidden rounded-lg">
                                <Image
                                  src={tmdbImage(provider.logo_path, "w92") ?? ""}
                                  alt={provider.provider_name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                            ) : null}
                            <span className="text-xs font-medium text-slate-200">
                              {provider.provider_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-7 text-slate-300/80">
                  TMDB does not list US watch providers for this series right now.
                </p>
              )}
            </GlassSection>

            <GlassSection eyebrow="Production" title="Behind the scenes">
              <div className="space-y-3 text-sm">
                <SidebarRow label="Studios">
                  {seriesData.production_companies.length
                    ? seriesData.production_companies
                        .slice(0, 5)
                        .map((company) => company.name)
                        .join(", ")
                    : "Not listed"}
                </SidebarRow>
                <SidebarRow label="Countries">
                  {productionCountries.length
                    ? productionCountries.join(", ")
                    : "Not listed"}
                </SidebarRow>
                <SidebarRow label="Languages">
                  {spokenLanguages.length
                    ? spokenLanguages.slice(0, 5).join(", ")
                    : "Not listed"}
                </SidebarRow>
              </div>
            </GlassSection>

            {keywords.length ? (
              <GlassSection eyebrow="Keywords" title="Themes and topics">
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword.id}
                      variant="outline"
                      className="border-white/10 bg-white/[0.06] text-slate-100"
                    >
                      {keyword.name}
                    </Badge>
                  ))}
                </div>
              </GlassSection>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  caption,
  icon: Icon,
  label,
  value,
}: {
  caption: string;
  icon: typeof StarIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="mb-3 flex items-center gap-2 text-sky-100/80">
        <Icon className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-300/70">{caption}</p>
    </div>
  );
}

function CrewCard({
  eyebrow,
  fallback,
  names,
}: {
  eyebrow: string;
  fallback: string;
  names: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200/70">
        {eyebrow}
      </p>
      <p className="mt-2 text-base font-semibold text-white">
        {names.length ? listFormatter.format(names.slice(0, 3)) : fallback}
      </p>
    </div>
  );
}

function GlassSection({
  children,
  className,
  eyebrow,
  title,
}: {
  children: ReactNode;
  className?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className={cn(pageShell, className)}>
      <div className="border-b border-white/10 px-5 py-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200/70">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-slate-100">{value}</p>
    </div>
  );
}

function CastCard({
  member,
}: {
  member: {
    character: string;
    id: number;
    name: string;
    profile_path: string | null;
  };
}) {
  const profileUrl = tmdbImage(member.profile_path, "w185");

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-3">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={member.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-200">
            {member.name
              .split(" ")
              .slice(0, 2)
              .map((token) => token[0])
              .join("")}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate font-semibold text-white">{member.name}</p>
        <p className="truncate text-sm text-slate-300/80">
          {member.character || "Role unavailable"}
        </p>
      </div>
    </div>
  );
}

function SeasonCard({
  isActive,
  season,
}: {
  isActive: boolean;
  season: TVSeriesDetails["seasons"][number];
}) {
  const posterUrl = tmdbImage(season.poster_path, "w342");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-black/20",
        isActive
          ? "border-sky-300/35 bg-sky-300/10"
          : "border-white/[0.08]",
      )}
    >
      <div className="flex gap-4 p-4">
        <div className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-white/[0.04]">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={season.name}
              fill
              className="object-cover"
              sizes="72px"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs font-semibold text-slate-200">
              {season.name}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-white">{season.name}</p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
            <span>{season.air_date?.slice(0, 4) || "TBA"}</span>
            <span>{season.episode_count} episodes</span>
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300/78">
            {season.overview || "Season synopsis is not available."}
          </p>
        </div>
      </div>
    </div>
  );
}

function PosterRail({
  items,
  title,
}: {
  items: TVSeriesCard[];
  title: string;
}) {
  return (
    <GlassSection eyebrow="More to watch" title={title}>
      <div className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/tv-series/${item.id}`}
            className="group block w-[170px] shrink-0"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05] transition duration-300 group-hover:-translate-y-1 group-hover:border-sky-200/30">
              {item.poster_path ? (
                <Image
                  src={tmdbImage(item.poster_path, "w342") ?? ""}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="170px"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm font-medium text-slate-200">
                  {item.name}
                </div>
              )}
            </div>

            <div className="mt-3 px-1">
              <p className="line-clamp-2 font-semibold text-white transition group-hover:text-sky-100">
                {item.name}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span>{item.first_air_date?.slice(0, 4) || "TBA"}</span>
                {item.vote_average ? (
                  <span className="inline-flex items-center gap-1">
                    <StarIcon className="size-3 fill-amber-300 text-amber-300" />
                    {item.vote_average.toFixed(1)}
                  </span>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </GlassSection>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function SidebarRow({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="min-w-0 text-slate-400">{label}</span>
      <span className="text-right text-slate-100">{children}</span>
    </div>
  );
}
