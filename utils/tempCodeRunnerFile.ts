import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function getTrendingMovies() {
  const trending_url =
    TMDB_BASE_URL + `/trending/movies/day?api_key=${TMDB_API_KEY}`;

  axios
    .get(trending_url)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}
