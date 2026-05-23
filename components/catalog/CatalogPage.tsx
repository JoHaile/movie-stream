import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import CatalogControls from "@/components/catalog/CatalogControls";
import CatalogGridCard from "@/components/catalog/CatalogGridCard";
import CatalogPagination from "@/components/catalog/CatalogPagination";
import {
  type CatalogItem,
  type CatalogMediaType,
  type CatalogQueryState,
  type SelectOption,
  getMediaHref,
  getMediaTitle,
  getMediaYear,
  getPrimaryGenreLabel,
} from "@/utils/catalog";
import { ClapperboardIcon, FilmIcon, SparklesIcon, TvMinimalPlayIcon } from "lucide-react";

type Props = {
  description: string;
  emptyDescription?: string;
  emptyTitle?: string;
  eyebrow: string;
  featured?: CatalogItem | null;
  genreOptions: SelectOption[];
  items: CatalogItem[];
  mediaType: CatalogMediaType;
  mediaTypeOptions?: SelectOption[];
  pathname: string;
  query: CatalogQueryState;
  sortOptions: SelectOption[];
  title: string;
  totalPages: number;
  totalResults: number;
  yearOptions: SelectOption[];
};

export default function CatalogPage({
  description,
  emptyDescription = "Try changing the sort order or clearing one of the active filters.",
  emptyTitle = "No titles match these filters",
  eyebrow,
  featured,
  genreOptions,
  items,
  mediaType,
  mediaTypeOptions,
  pathname,
  query,
  sortOptions,
  title,
  totalPages,
  totalResults,
  yearOptions,
}: Props) {
  const heroTitle = featured ? getMediaTitle(featured) : title;
  const heroBackdrop = featured?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${featured.backdrop_path}`
    : null;
  const heroHref = featured ? getMediaHref(featured, mediaType) : null;
  const heroYear = featured ? getMediaYear(featured) : "";
  const heroGenre = featured ? getPrimaryGenreLabel(featured, mediaType) : "";
  const queryRecord = {
    genre: query.genre || undefined,
    sort: query.sort !== "default" ? query.sort : undefined,
    type: mediaType === "all" && query.type !== "all" ? query.type : undefined,
    year: query.year || undefined,
  };
  const activeGenreLabel = query.genre
    ? genreOptions.find((option) => option.value === query.genre)?.label
    : "";

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10">
        {heroBackdrop ? (
          <Image
            src={heroBackdrop}
            alt={heroTitle}
            fill
            priority
            className="object-cover object-top opacity-30"
            sizes="100vw"
          />
        ) : null}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,172,254,0.22),transparent_42%),linear-gradient(180deg,rgba(5,11,20,0.2)_0%,rgba(5,11,20,0.84)_56%,#050b14_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-6 lg:px-8 lg:pb-16 lg:pt-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">
            <SparklesIcon className="size-3.5" />
            <span>{eyebrow}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="max-w-4xl">
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200/82 md:text-lg">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="outline"
                  className="border-white/[0.15] bg-white/10 text-slate-100"
                >
                  {`${totalResults.toLocaleString()} results`}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/[0.15] bg-white/10 text-slate-100"
                >
                  Page {query.page} of {totalPages}
                </Badge>
                {query.genre ? (
                  <Badge
                    variant="outline"
                    className="border-white/[0.15] bg-white/10 text-slate-100"
                  >
                    {activeGenreLabel || "Genre filter"}
                  </Badge>
                ) : null}
                {query.year ? (
                  <Badge
                    variant="outline"
                    className="border-white/[0.15] bg-white/10 text-slate-100"
                  >
                    {query.year}
                  </Badge>
                ) : null}
                {mediaType === "all" && query.type !== "all" ? (
                  <Badge
                    variant="outline"
                    className="border-white/[0.15] bg-white/10 text-slate-100"
                  >
                    {query.type === "movie" ? "Movies only" : "TV only"}
                  </Badge>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/70">
                {mediaType === "tv" ? (
                  <TvMinimalPlayIcon className="size-4" />
                ) : (
                  <FilmIcon className="size-4" />
                )}
                Spotlight
              </div>

              {featured ? (
                <>
                  <h2 className="text-2xl font-semibold text-white">
                    {heroTitle}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    {heroYear ? <span>{heroYear}</span> : null}
                    {heroGenre ? <span>{heroGenre}</span> : null}
                    {featured.vote_average ? (
                      <span>{featured.vote_average.toFixed(1)} TMDB</span>
                    ) : null}
                  </div>
                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-300/82">
                    {featured.overview ||
                      "Jump straight into the current spotlight title from this collection."}
                  </p>
                  {heroHref ? (
                    <Link
                      href={heroHref}
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/12 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-300/18"
                    >
                      <ClapperboardIcon className="size-4" />
                      Open detail page
                    </Link>
                  ) : null}
                </>
              ) : (
                <p className="text-sm leading-7 text-slate-300/80">
                  Use the controls below to refine the catalog and discover a new title.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 lg:px-8">
        <CatalogControls
          defaultType={mediaType === "all" ? "all" : mediaType}
          genreOptions={genreOptions}
          mediaTypeOptions={mediaTypeOptions}
          selectedGenre={query.genre}
          selectedSort={query.sort}
          selectedType={query.type}
          selectedYear={query.year}
          sortOptions={sortOptions}
          yearOptions={yearOptions}
        />

        {items.length ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((item) => (
                <CatalogGridCard
                  key={`${item.media_type ?? mediaType}-${item.id}`}
                  item={item}
                  mediaType={mediaType}
                  showTypeBadge={mediaType === "all"}
                />
              ))}
            </div>

            <CatalogPagination
              currentPage={query.page}
              pathname={pathname}
              query={queryRecord}
              totalPages={totalPages}
            />
          </>
        ) : (
          <>
            <div className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold text-white">{emptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300/78">
                {emptyDescription}
              </p>
            </div>

            <CatalogPagination
              currentPage={query.page}
              pathname={pathname}
              query={queryRecord}
              totalPages={totalPages}
            />
          </>
        )}
      </main>
    </div>
  );
}
