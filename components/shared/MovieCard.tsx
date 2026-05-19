import React from "react";

interface MovieCardProps {
  title: string;
  posterPath: string;
  releaseDate?: string;
  mediaType?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterPath,
  releaseDate,
  mediaType,
}) => {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={title}
        className="movie-card__image"
      />
      <div className="movie-card__info">
        <h3 className="movie-card__title">{title}</h3>
        {releaseDate && (
          <p className="movie-card__release-date">{releaseDate}</p>
        )}
        {mediaType && <p className="movie-card__media-type">{mediaType}</p>}
      </div>
    </div>
  );
};

export default MovieCard;
