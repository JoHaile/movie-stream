"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTrending, getPopular, getTopRated } from "@/utils/tmdb";
import MediaRow, { MediaItem } from "@/components/shared/MediaRow";
import { PlayIcon, InfoIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// TMDB genre mapping for TV
const tvGenreMap: Record<number, string> = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

export default function TVSeriesPage() {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popular, setPopular] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pick a featured show from trending for the hero
  const featured = trending.length > 0 ? trending[0] : null;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingData, popularData, topRatedData] = await Promise.all([
          getTrending("tv"),
          getPopular("tv"),
          getTopRated("tv"),
        ]);

        if (trendingData?.results) setTrending(trendingData.results);
        if (popularData?.results) setPopular(popularData.results);
        if (topRatedData?.results) setTopRated(topRatedData.results);
      } catch (error) {
        console.error("Error fetching TV data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen">
        {/* Hero skeleton */}
        <div className="relative w-full h-[480px] md:h-[540px]">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        {/* Row skeletons */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex gap-4">
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton
                    key={j}
                    className="w-[170px] aspect-[2/3] rounded-xl flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const featuredBackdrop = featured?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}`
    : null;

  const featuredGenres = featured?.genre_ids
    ?.slice(0, 3)
    .map((id: number) => tvGenreMap[id])
    .filter(Boolean) || [];

  const featuredYear = (featured?.first_air_date || "").slice(0, 4);

  return (
    <div className="w-full min-h-screen">
      {/* Hero Banner */}
      {featured && (
        <section className="relative w-full h-[480px] md:h-[540px] overflow-hidden">
          {/* Background image */}
          {featuredBackdrop && (
            <Image
              src={featuredBackdrop}
              alt={featured.name || "Featured show"}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
          )}

          {/* Gradient overlay */}
          <div className="hero-gradient absolute inset-0 z-10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-end pb-16 md:pb-20">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none mb-3">
                {featured.name || featured.title}
              </h1>

              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {featuredYear && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {featuredYear}
                  </span>
                )}
                {(featured as any).vote_average > 0 && (
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">
                      {(featured as any).vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
                {featuredGenres.map((genre: string) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>

              <p className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed line-clamp-3 mb-5">
                {(featured as any).overview}
              </p>

              <div className="flex items-center gap-3">
                <Link href={`/tv-series/${featured.id}`}>
                  <Button size="lg" className="gap-2 font-semibold px-6">
                    <PlayIcon className="w-4 h-4" fill="currentColor" />
                    Play
                  </Button>
                </Link>
                <Link href={`/tv-series/${featured.id}`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 font-semibold px-6"
                  >
                    <InfoIcon className="w-4 h-4" />
                    More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content rows */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <MediaRow
          title="Trending Now"
          items={trending}
          mediaType="tv"
          seeAllHref="#"
        />

        <MediaRow
          title="Popular TV Series"
          items={popular}
          mediaType="tv"
          seeAllHref="#"
        />

        <MediaRow
          title="Top Rated TV Series"
          items={topRated}
          mediaType="tv"
          seeAllHref="#"
        />
      </div>
    </div>
  );
}
