import type { Metadata } from "next";
import CatalogPage from "@/components/catalog/CatalogPage";
import {
  getCatalogPage,
  getGenreOptions,
  getSortOptions,
  getYearOptions,
  parseCatalogQuery,
  type SearchParamsRecord,
} from "@/utils/catalog";

export const metadata: Metadata = {
  title: "TV Series Library | StreamFlix",
  description:
    "Browse TV series with filtering, sorting, pagination, and detailed discovery experiences powered by TMDB.",
};

type Props = {
  searchParams: Promise<SearchParamsRecord>;
};

export default async function TVSeriesPage({ searchParams }: Props) {
  const query = parseCatalogQuery(await searchParams, "tv");
  const data = await getCatalogPage({
    genre: query.genre,
    mediaType: "tv",
    page: query.page,
    sort: query.sort,
    year: query.year,
  });

  return (
    <CatalogPage
      description="Explore premium series discovery with genre filters, release-year browsing, and rankings that make finding your next binge feel easy and polished."
      eyebrow="Series Library"
      featured={data.results[0]}
      genreOptions={getGenreOptions("tv")}
      items={data.results}
      mediaType="tv"
      pathname="/tv-series"
      query={query}
      sortOptions={getSortOptions("catalog")}
      title="TV Series"
      totalPages={data.total_pages}
      totalResults={data.total_results}
      yearOptions={getYearOptions()}
    />
  );
}
