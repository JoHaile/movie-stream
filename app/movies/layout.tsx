import type { Metadata } from "next";
import NavBar from "@/components/shared/NavBar";

export const metadata: Metadata = {
  title: "Movies - Stream Flex",
  description: "Browse and stream popular movies",
};

export default function MoviesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="py-4">
        <NavBar />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
