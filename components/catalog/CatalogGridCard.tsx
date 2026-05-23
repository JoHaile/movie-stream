import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";
import {
  type CatalogItem,
  type CatalogMediaType,
  getMediaHref,
  getMediaTitle,
  getMediaYear,
  getPrimaryGenreLabel,
} from "@/utils/catalog";

type Props = {
  item: CatalogItem;
  mediaType?: CatalogMediaType;
  showTypeBadge?: boolean;
};

export default function CatalogGridCard({
  item,
  mediaType = "movie",
  showTypeBadge = false,
}: Props) {
  const href = getMediaHref(item, mediaType);
  const title = getMediaTitle(item);
  const year = getMediaYear(item);
  const genre = getPrimaryGenreLabel(item, mediaType);
  const typeLabel =
    item.media_type === "tv" || mediaType === "tv" ? "TV Series" : "Movie";
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  return (
    <Link href={href} className="group block">
      <article className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-sky-200/30 hover:bg-white/[0.07]">
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-base font-semibold text-slate-200">
              {title}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07101a] via-[#07101a]/40 to-transparent" />

          {item.vote_average ? (
            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-black/20 bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <StarIcon className="size-3.5 fill-amber-300 text-amber-300" />
              {item.vote_average.toFixed(1)}
            </div>
          ) : null}

          {showTypeBadge ? (
            <div className="absolute left-3 top-3 rounded-full border border-white/[0.12] bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              {typeLabel}
            </div>
          ) : null}
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-2 text-base font-semibold text-white transition group-hover:text-sky-100">
              {title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              {year ? <span>{year}</span> : null}
              {genre ? <span>{genre}</span> : null}
              {!genre ? <span>{typeLabel}</span> : null}
            </div>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-slate-300/78">
            {item.overview || "No synopsis is available for this title yet."}
          </p>
        </div>
      </article>
    </Link>
  );
}
