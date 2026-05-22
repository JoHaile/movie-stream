import React from "react";
import MovieCard from "@/components/features/MovieCard";

interface Movie {
  id: number;
  title: string;
  rating: number;
  genre: string[];
  year: number;
  poster: string;
}

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    rating: 8.8,
    genre: ["Sci-Fi", "Thriller"],
    year: 2010,
    poster: "https://via.placeholder.com/300x450?text=Inception",
  },
  {
    id: 2,
    title: "The Dark Knight",
    rating: 9.0,
    genre: ["Action", "Crime"],
    year: 2008,
    poster: "https://via.placeholder.com/300x450?text=The+Dark+Knight",
  },
  {
    id: 3,
    title: "Interstellar",
    rating: 8.6,
    genre: ["Sci-Fi", "Drama"],
    year: 2014,
    poster: "https://via.placeholder.com/300x450?text=Interstellar",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    rating: 8.9,
    genre: ["Crime", "Drama"],
    year: 1994,
    poster: "https://via.placeholder.com/300x450?text=Pulp+Fiction",
  },
  {
    id: 5,
    title: "The Matrix",
    rating: 8.7,
    genre: ["Sci-Fi", "Action"],
    year: 1999,
    poster: "https://via.placeholder.com/300x450?text=The+Matrix",
  },
  {
    id: 6,
    title: "Forrest Gump",
    rating: 8.8,
    genre: ["Drama", "Romance"],
    year: 1994,
    poster: "https://via.placeholder.com/300x450?text=Forrest+Gump",
  },
  {
    id: 7,
    title: "The Godfather",
    rating: 9.2,
    genre: ["Crime", "Drama"],
    year: 1972,
    poster: "https://via.placeholder.com/300x450?text=The+Godfather",
  },
  {
    id: 8,
    title: "Avatar",
    rating: 7.8,
    genre: ["Sci-Fi", "Action"],
    year: 2009,
    poster: "https://via.placeholder.com/300x450?text=Avatar",
  },
  {
    id: 9,
    title: "The Shawshank Redemption",
    rating: 9.3,
    genre: ["Drama"],
    year: 1994,
    poster: "https://via.placeholder.com/300x450?text=Shawshank",
  },
  {
    id: 10,
    title: "Titanic",
    rating: 7.8,
    genre: ["Drama", "Romance"],
    year: 1997,
    poster: "https://via.placeholder.com/300x450?text=Titanic",
  },
  {
    id: 11,
    title: "The Lion King",
    rating: 8.5,
    genre: ["Animation", "Family"],
    year: 1994,
    poster: "https://via.placeholder.com/300x450?text=The+Lion+King",
  },
  {
    id: 12,
    title: "Gladiator",
    rating: 8.5,
    genre: ["Action", "Drama"],
    year: 2000,
    poster: "https://via.placeholder.com/300x450?text=Gladiator",
  },
  {
    id: 13,
    title: "The Avengers",
    rating: 8.0,
    genre: ["Action", "Superhero"],
    year: 2012,
    poster: "https://via.placeholder.com/300x450?text=The+Avengers",
  },
  {
    id: 14,
    title: "Jurassic Park",
    rating: 8.1,
    genre: ["Sci-Fi", "Thriller"],
    year: 1993,
    poster: "https://via.placeholder.com/300x450?text=Jurassic+Park",
  },
  {
    id: 15,
    title: "Back to the Future",
    rating: 8.5,
    genre: ["Sci-Fi", "Comedy"],
    year: 1985,
    poster: "https://via.placeholder.com/300x450?text=Back+to+Future",
  },
  {
    id: 16,
    title: "The Silence of the Lambs",
    rating: 8.6,
    genre: ["Thriller", "Crime"],
    year: 1991,
    poster: "https://via.placeholder.com/300x450?text=Silence+of+Lambs",
  },
  {
    id: 17,
    title: "Saving Private Ryan",
    rating: 8.6,
    genre: ["War", "Drama"],
    year: 1998,
    poster: "https://via.placeholder.com/300x450?text=Saving+Private+Ryan",
  },
  {
    id: 18,
    title: "The Usual Suspects",
    rating: 8.5,
    genre: ["Crime", "Thriller"],
    year: 1995,
    poster: "https://via.placeholder.com/300x450?text=Usual+Suspects",
  },
  {
    id: 19,
    title: "Schindler's List",
    rating: 9.0,
    genre: ["Drama", "History"],
    year: 1993,
    poster: "https://via.placeholder.com/300x450?text=Schindlers+List",
  },
  {
    id: 20,
    title: "The Green Mile",
    rating: 8.6,
    genre: ["Drama", "Crime"],
    year: 1999,
    poster: "https://via.placeholder.com/300x450?text=The+Green+Mile",
  },
  {
    id: 21,
    title: "Fight Club",
    rating: 8.8,
    genre: ["Drama", "Thriller"],
    year: 1999,
    poster: "https://via.placeholder.com/300x450?text=Fight+Club",
  },
  {
    id: 22,
    title: "The Conjuring",
    rating: 7.5,
    genre: ["Horror", "Thriller"],
    year: 2013,
    poster: "https://via.placeholder.com/300x450?text=The+Conjuring",
  },
  {
    id: 23,
    title: "Parasite",
    rating: 8.6,
    genre: ["Thriller", "Drama"],
    year: 2019,
    poster: "https://via.placeholder.com/300x450?text=Parasite",
  },
  {
    id: 24,
    title: "Dune",
    rating: 8.0,
    genre: ["Sci-Fi", "Adventure"],
    year: 2021,
    poster: "https://via.placeholder.com/300x450?text=Dune",
  },
  {
    id: 25,
    title: "Oppenheimer",
    rating: 8.5,
    genre: ["Biography", "Drama"],
    year: 2023,
    poster: "https://via.placeholder.com/300x450?text=Oppenheimer",
  },
];

export default function MoviesPage() {
  return (
    <div className="w-full">
      <div className="px-6 py-8 md:px-12 lg:px-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
          Popular Movies
        </h1>
        <p className="text-muted-foreground mb-8">
          Explore our collection of trending and classic films
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {mockMovies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
