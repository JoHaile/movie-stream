"use client";

import { getPopular, getTopRated, getTrending } from "@/utils/tmdb";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import MediaRow, { MediaItem } from "@/components/shared/MediaRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayIcon, InfoIcon, StarIcon } from "lucide-react";

// TMDB genre mapping
const allGenres: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

function Page() {
  const [trendingAll, setTrendingAll] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingData, popularData, topRatedData] = await Promise.all([
          getTrending("all"),
          getPopular("movie"),
          getTopRated("tv"),
        ]);

        if (trendingData?.results) setTrendingAll(trendingData.results);
        if (popularData?.results) setPopularMovies(popularData.results);
        if (topRatedData?.results) setTopRatedTV(topRatedData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Pick featured item from trending
  const featured = trendingAll.length > 0 ? trendingAll[0] : null;

  if (loading) {
    return (
      <div className="w-full min-h-screen">
        <div className="relative w-full h-[480px] md:h-[540px]">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
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

  const featuredBackdrop = (featured as any)?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${(featured as any).backdrop_path}`
    : null;

  const featuredGenres = (featured as any)?.genre_ids
    ?.slice(0, 3)
    .map((id: number) => allGenres[id])
    .filter(Boolean) || [];

  const featuredYear = (
    (featured as any)?.release_date ||
    (featured as any)?.first_air_date ||
    ""
  ).slice(0, 4);

  const featuredType = (featured as any)?.media_type === "tv" ? "tv" : "movie";
  const featuredHref =
    featuredType === "tv"
      ? `/tv-series/${featured?.id}`
      : `/movies/${featured?.id}`;

  return (
    <div className="w-full min-h-screen">
      {/* Hero Banner */}
      {featured && (
        <section className="relative w-full h-[480px] md:h-[540px] overflow-hidden">
          {featuredBackdrop && (
            <Image
              src={featuredBackdrop}
              alt={featured.name || featured.title || "Featured"}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
          )}

          <div className="hero-gradient absolute inset-0 z-10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />

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
                <Badge variant="outline" className="text-xs">
                  {featuredType === "tv" ? "TV Series" : "Movie"}
                </Badge>
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
                <Link href={featuredHref}>
                  <Button size="lg" className="gap-2 font-semibold px-6">
                    <PlayIcon className="w-4 h-4" fill="currentColor" />
                    Play
                  </Button>
                </Link>
                <Link href={featuredHref}>
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
          items={trendingAll}
          seeAllHref="#"
        />

        <MediaRow
          title="Popular Movies"
          items={popularMovies}
          mediaType="movie"
          seeAllHref="/movies"
        />

        <MediaRow
          title="Top Rated TV Series"
          items={topRatedTV}
          mediaType="tv"
          seeAllHref="/tv-series"
        />
      </div>
    </div>
  );
}

export default Page;
