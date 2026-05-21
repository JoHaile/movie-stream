"use server";

import page from "@/app/movies/[movieID]/page";
import axios, { AxiosRequestConfig } from "axios";
import { MediaTypePopular } from "./tmdb";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const getMediaByID = async (
  movieID: string,
  mediaType: MediaTypePopular,
) => {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${TMDB_BASE_URL}/${mediaType}/${movieID}?append_to_response=videos`,
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
};
