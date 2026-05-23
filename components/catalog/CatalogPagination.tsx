import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  pathname: string;
  query: Record<string, string | undefined>;
  totalPages: number;
};

export default function CatalogPagination({
  currentPage,
  pathname,
  query,
  totalPages,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2">
      <PaginationLink
        href={buildHref(pathname, query, Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </PaginationLink>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-slate-500"
          >
            ...
          </span>
        ) : (
          <PaginationLink
            key={page}
            href={buildHref(pathname, query, page)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationLink>
        ),
      )}

      <PaginationLink
        href={buildHref(pathname, query, Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  children,
  disabled,
  href,
  isActive,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  href: string;
  isActive?: boolean;
}) {
  if (disabled) {
    return (
      <span
        className={cn(
          buttonVariants({ size: "sm", variant: "outline" }),
          "cursor-not-allowed border-white/10 bg-white/[0.03] text-slate-500 opacity-60",
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        buttonVariants({ size: "sm", variant: "outline" }),
        isActive
          ? "border-sky-300/40 bg-sky-300/12 text-sky-100"
          : "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.1]",
      )}
    >
      {children}
    </Link>
  );
}

function buildHref(
  pathname: string,
  query: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (!value || key === "page") {
      continue;
    }

    params.set(key, value);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return params.toString() ? `${pathname}?${params}` : pathname;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}
