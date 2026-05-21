"use server";

import axios, { AxiosRequestConfig } from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function getTrending(
  mediaType: string = "all",
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
