"use server";

import axios, { AxiosRequestConfig } from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type MediaTypeTrending = "movie" | "tv" | "all";
export type MediaTypePopular = "movie" | "tv";

export async function getTrending(
  mediaType: MediaTypeTrending = "all",
  timeWindow: string = "day",
  page: number = 1,
) {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?page=${page}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await axios.request(options);

    // FIX 1: Only return the pure serializable data object
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies from TMDB:", error);

    // FIX 2: Throw the error or return a structure your client component can handle safely
    throw new Error("Failed to fetch trending movies");
  }
}

export async function getPopular(
  mediaType: MediaTypePopular = "movie",
  page: number = 1,
) {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${TMDB_BASE_URL}/${mediaType}/popular?page=${page}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await axios.request(options);

    // FIX 1: Only return the pure serializable data object
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies from TMDB:", error);

    // FIX 2: Throw the error or return a structure your client component can handle safely
    throw new Error("Failed to fetch popular movies");
  }
}

export async function getTopRated(
  mediaType: MediaTypePopular = "movie",
  page: number = 1,
) {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${TMDB_BASE_URL}/${mediaType}/top_rated?page=${page}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await axios.request(options);

    // FIX 1: Only return the pure serializable data object
    return response.data;
  } catch (error) {
    console.error("Error fetching top_rated movies from TMDB:", error);

    // FIX 2: Throw the error or return a structure your client component can handle safely
    throw new Error("Failed to fetch top_rated movies");
  }
}

export async function getTVDetails(seriesId: string) {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${TMDB_BASE_URL}/tv/${seriesId}?append_to_response=videos,credits`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching TV details from TMDB:", error);
    throw new Error("Failed to fetch TV details");
  }
}

export async function getTVSeasonDetails(
  seriesId: string,
  seasonNumber: number,
) {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching TV season details from TMDB:", error);
    throw new Error("Failed to fetch TV season details");
  }
}
