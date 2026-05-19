"use client";

import React, { useEffect, useState } from "react";
import { fetchPopularMovies, fetchPopularTV } from "../server";
import MovieList from "../components/shared/MovieList";

const HomePage = () => {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const trendingData = await fetchTrending();
        const popularMoviesData = await fetchPopularMovies();
        const popularTVData = await fetchPopularTV();

        // setTrending(trendingData);
        setPopularMovies(popularMoviesData);
        setPopularTV(popularTVData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      <section>
        <h2>Trending</h2>
        <MovieList movies={trending} />
      </section>
      <section>
        <h2>Popular Movies</h2>
        <MovieList movies={popularMovies} />
      </section>
      <section>
        <h2>Popular TV Series</h2>
        <MovieList movies={popularTV} />
      </section>
    </div>
  );
};

export default HomePage;
