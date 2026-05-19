import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const favorites = await prisma.favorite.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  } else if (req.method === "POST") {
    try {
      const { tmdbId, type, title, posterPath } = req.body;
      const favorite = await prisma.favorite.create({
        data: { tmdbId, type, title, posterPath },
      });
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}