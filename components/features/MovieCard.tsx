import React from "react";
import { Star } from "lucide-react";

interface MovieCardProps {
  id: number;
  title: string;
  rating: number;
  genre: string[];
  year: number;
  poster: string;
}

export default function MovieCard({
  title,
  rating,
  genre,
  year,
  poster,
}: MovieCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg aspect-[9/13] mb-3 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="w-full">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <p className="text-white text-xs line-clamp-2">{genre.join(", ")}</p>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{year}</p>
      </div>
    </div>
  );
}
