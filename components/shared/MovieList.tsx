import React from "react";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Array<{
    id: number;
    title: string;
    poster_path: string;
    release_date?: string;
    media_type?: string;
  }>;
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          releaseDate={movie.release_date}
          mediaType={movie.media_type}
        />
      ))}
    </div>
  );
};

export default MovieList;
