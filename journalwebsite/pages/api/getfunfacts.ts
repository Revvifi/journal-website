import type { NextApiRequest, NextApiResponse } from "next";
import Prisma from "@/lib/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let total = await Prisma.funFact.count();
  let amount = req.body.take || 10;
  if (amount > total) {
    amount = total;
  }
  let facts = await Prisma.funFact.findMany({
    take: amount,
    where: {
      OR: [
        {
          Article: {
            published: true,
          },
        },
        {
            published: true,
        }
      ]
    },
    skip: Math.floor(Math.random() * (total - amount)),
  });
  if (req.body.random) {
    facts = facts.sort(() => Math.random() - 0.5);
  }
  res.status(200).json(facts.splice(0, req.body.take || 10));
}
