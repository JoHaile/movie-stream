import { Button } from "@/components/ui/button";
import { getMediaByID } from "@/utils/getMovies";
import Image from "next/image";

type Props = {
  params: Promise<{ movieID: string }>;
};

export default async function Page({ params }: Props) {
  const { movieID } = await params;
  const movieData = await getMediaByID(movieID, "movie");

  const posterUrl = movieData.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
    : null;

  const getEmbedUrl = (movieID: String) => {
    return `https://vsembed.ru/embed/movie/${movieID}/?autoplay=1&muted=1`;
  };

  return (
    <div className="w-full p-4">
      <iframe
        src={getEmbedUrl(movieID)}
        className="w-full h-full border-none"
        allowFullScreen
        referrerPolicy="no-referrer"
      />

      {posterUrl ? (
        <div className="relative w-[95%] lg:w-[80%] h-125 md lg:h-112.5 mb-4 mx-auto rounded-lg overflow-hidden">
          <Image
            src={posterUrl}
            alt={movieData.title || movieData.name || "Movie Poster"}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="text-center my-4">No Image Available</div>
      )}

      <div className="w-[95%] lg:w-[80%] mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          {movieData.title || movieData.name}
        </h1>
        <p className="text-gray-700 leading-relaxed">{movieData.overview}</p>
      </div>

      <Button className="mt-6" variant="outline">
        Watch Now
      </Button>
    </div>
  );
}
