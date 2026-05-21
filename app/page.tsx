"use client";

import { getTrending } from "@/utils/tmdb";
import React, { useEffect, useState } from "react";

// 1. Define what a Movie object looks like
interface Movie {
  id: number;
  title?: string;
  name?: string; // TMDB uses 'name' for TV shows and 'title' for movies
  overview?: string;
  poster_path?: string;
}

function Page() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const data = await getTrending();

        // Safety check: Make sure we got data and results back
        // If your utility returns 'response.data', then 'data.results' is correct.
        // If your utility returns 'response', you might need 'data.data.results'.
        if (data && data.results) {
          setTrendingMovies(data.results);
        }
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  return (
    <div className="w-full h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-5">
          {trendingMovies.map((movie) => (
            <li key={movie.id}>{movie.title || movie.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Page;
