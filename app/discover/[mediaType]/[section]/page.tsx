import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogPage from "@/components/catalog/CatalogPage";
import {
  applyFeedFilters,
  getFeedSection,
  getGenreOptions,
  getMediaTypeOptions,
  getSectionTitle,
  getSortOptions,
  getYearOptions,
  parseCatalogQuery,
  type CatalogMediaType,
  type CatalogSection,
  type SearchParamsRecord,
} from "@/utils/catalog";

type Props = {
  params: Promise<{ mediaType: string; section: string }>;
  searchParams: Promise<SearchParamsRecord>;
};

function isMediaType(value: string): value is CatalogMediaType {
  return ["movie", "tv", "all"].includes(value);
}

function isSection(value: string): value is CatalogSection {
  return ["trending", "popular", "top-rated"].includes(value);
}

function getDiscoverTitle(mediaType: CatalogMediaType, section: CatalogSection) {
  const sectionTitle = getSectionTitle(section);

  if (mediaType === "movie") {
    return `${sectionTitle} Movies`;
  }

  if (mediaType === "tv") {
    return `${sectionTitle} TV Series`;
  }

  return `${sectionTitle} Titles`;
}

function getDiscoverDescription(
  mediaType: CatalogMediaType,
  section: CatalogSection,
) {
  const noun =
    mediaType === "movie"
      ? "movies"
      : mediaType === "tv"
        ? "TV series"
        : "movies and TV series";

  return `Explore ${section.replace("-", " ")} ${noun} with page-by-page browsing, server-side filters, and smarter discovery controls.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mediaType, section } = await params;

  if (!isMediaType(mediaType) || !isSection(section)) {
    return {
      title: "Discover | StreamFlix",
    };
  }

  return {
    title: `${getDiscoverTitle(mediaType, section)} | StreamFlix`,
    description: getDiscoverDescription(mediaType, section),
  };
}

export default async function DiscoverPage({ params, searchParams }: Props) {
  const { mediaType, section } = await params;

  if (!isMediaType(mediaType) || !isSection(section)) {
    notFound();
  }

  if (mediaType === "all" && section !== "trending") {
    notFound();
  }

  const query = parseCatalogQuery(await searchParams, mediaType);
  const feedData = await getFeedSection({
    mediaType,
    page: query.page,
    section,
  });
  const items = applyFeedFilters({
    items: feedData.results,
    query,
    routeMediaType: mediaType,
  });
  const activeTypeForGenres =
    mediaType === "all" ? query.type : mediaType;

  return (
    <CatalogPage
      description={getDiscoverDescription(mediaType, section)}
      eyebrow="Discover"
      featured={items[0] ?? feedData.results[0]}
      genreOptions={getGenreOptions(activeTypeForGenres)}
      items={items}
      mediaType={mediaType}
      mediaTypeOptions={mediaType === "all" ? getMediaTypeOptions() : undefined}
      pathname={`/discover/${mediaType}/${section}`}
      query={query}
      sortOptions={getSortOptions(section)}
      title={getDiscoverTitle(mediaType, section)}
      totalPages={feedData.total_pages}
      totalResults={feedData.total_results}
      yearOptions={getYearOptions()}
    />
  );
}
