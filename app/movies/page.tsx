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
  title: "Movie Library | StreamFlix",
  description:
    "Browse movies with sorting, filtering, pagination, and rich discovery tools powered by TMDB.",
};

type Props = {
  searchParams: Promise<SearchParamsRecord>;
};

export default async function MoviesPage({ searchParams }: Props) {
  const query = parseCatalogQuery(await searchParams, "movie");
  const data = await getCatalogPage({
    genre: query.genre,
    mediaType: "movie",
    page: query.page,
    sort: query.sort,
    year: query.year,
  });

  return (
    <CatalogPage
      description="Browse the StreamFlix movie catalog with precise filters, thoughtful sorting, and spotlight picks that feel like a real streaming destination."
      eyebrow="Movie Library"
      featured={data.results[0]}
      genreOptions={getGenreOptions("movie")}
      items={data.results}
      mediaType="movie"
      pathname="/movies"
      query={query}
      sortOptions={getSortOptions("catalog")}
      title="Movies"
      totalPages={data.total_pages}
      totalResults={data.total_results}
      yearOptions={getYearOptions()}
    />
  );
}
