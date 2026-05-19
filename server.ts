import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
console.log("TMDB API Key:", API_KEY);

// Fetch trending movies and TV series
// export const fetchTrending = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/trending/all/day`, {
//       params: {
//         api_key: API_KEY,
//       },
//     });
//     return response.data.results;
//   } catch (error) {
//     console.error("Error fetching trending data:", error);
//     throw error;
//   }
// };

// Fetch popular movies
export const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

// Fetch popular TV series
export const fetchPopularTV = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/popular`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular TV series:", error);
    throw error;
  }
};
